package usercart

import (
	"bytes"
	"carts/models"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	"net/http"
	"time"
)

// CreateCart Create New User's Cart
func CreateCart(c *gin.Context) {

	jsonRequest, _ := ioutil.ReadAll(c.Request.Body)

	request := &models.CreateUserCartRequest{}
	err := json.Unmarshal([]byte(jsonRequest), request)
	if err != nil {
		fmt.Println("Error Unmarshalling: ", err)
		c.String(http.StatusInternalServerError, "error while unmarshalling json")
		return
	}

	requserId := request.UserId
	c.Header("Content-Type", "application/json; charset=utf-8")

	session, collection, err := getMongoConnection()
	if err != nil {
		c.String(http.StatusInternalServerError, "MongoDB Connection Failed")
		return
	}
	defer session.Close()

	// Check for already existing cart for the same user
	count, err := collection.Find(bson.M{"userId": requserId}).Limit(1).Count()
	if err != nil {
		c.String(http.StatusInternalServerError, "{\"Error\": \"Could not fetch data from database\"}")
		return
	}
	if count > 0 {
		c.String(http.StatusBadRequest, "{\"Error\": \"Cart for the user already exists\"}")
		return
	}

	// Create Empty Cart
	var products []models.Product

	cartId := bson.NewObjectId()
	emptyUserCart := models.UserCart{
		Id:       cartId,
		UserId:   requserId,
		Products: products,
	}

	err = collection.Insert(emptyUserCart)

	if err != nil {
		c.String(http.StatusInternalServerError, "{\"Error\": \"Could not create user cart\"}")
		return
	}

	// resBody := models.CreateUserCartResponse{
	// 	CartId: cartId.Hex(),
	// 	Link:   models.LinkUserCart + "/" + cartId.Hex(),
	// }

	// resJSON, _ := json.Marshal(resBody)
	// c.String(http.StatusCreated, string(resJSON))

	c.JSON(http.StatusCreated, nil)
}

// GetCart Get User's Cart from user id
func GetCart(c *gin.Context) {

	c.Header("Content-Type", "application/json; charset=utf-8")
	userCart := GetUserCart(c.Param("userId"))
	// if userCart.Id == bson.ObjectIdHex("") {
	// 	c.String(http.StatusNotFound, "{\"Error\": \"Could no cart found for this id\"}")
	// 	return
	// }

	uj, _ := json.Marshal(userCart)
	c.String(http.StatusOK, string(uj))
}

func GetUserCart(userId string) models.UserCart {

	var userCart models.UserCart

	session, collection, err := getMongoConnection()
	if err != nil {
		//c.String(http.StatusInternalServerError, "MongoDB Connection Failed")
		return userCart
	}
	defer session.Close()

	//err = collection.FindId(bson.ObjectIdHex(c.Param("userId"))).One(&userCart)
	err = collection.Find(bson.M{"userId": userId}).One(&userCart)

	if err != nil {
		//c.String(http.StatusNotFound, "{\"Error\": \"Could no cart found for this id\"}")
		return userCart
	}

	return userCart
}

// DeleteCart delete user cart
func DeleteCart(c *gin.Context) {

	session, collection, err := getMongoConnection()
	if err != nil {
		c.String(http.StatusInternalServerError, "MongoDB Connection Failed")
		return
	}
	defer session.Close()

	err = collection.Remove(bson.M{"userId": c.Param("userId")})

	if err != nil {
		c.String(http.StatusNotFound, "{\"Error\": \"Could not delete cart\"}")
		return
	}

	c.JSON(http.StatusOK, nil)
}

// AddProduct to User cart
func AddProduct(c *gin.Context) {
	jsonRequest, _ := ioutil.ReadAll(c.Request.Body)

	product := &models.Product{}
	err := json.Unmarshal([]byte(jsonRequest), product)
	if err != nil {
		fmt.Println("Error Unmarshalling: ", err)
		c.String(http.StatusInternalServerError, "error while unmarshalling json")
		return
	}
	product.AddedBy = c.Param("userId")

	session, collection, err := getMongoConnection()
	if err != nil {
		c.String(http.StatusInternalServerError, "")
		return
	}
	defer session.Close()

	query := bson.M{"userId": c.Param("userId")}
	change := bson.M{"$push": bson.M{"products": product}}
	_, err = collection.Upsert(query, change)
	if err != nil {
		fmt.Println("Error While inserting: ", err)
		c.String(http.StatusInternalServerError, "")
		return
	}

	sendAddProductEvent(c.Param("userId"), *product)

	c.JSON(http.StatusOK, nil)
}

// UpdateProduct User Cart
func UpdateProduct(c *gin.Context) {
	jsonRequest, _ := ioutil.ReadAll(c.Request.Body)

	product := &models.Product{}
	err := json.Unmarshal([]byte(jsonRequest), product)
	if err != nil {
		fmt.Println("Error Unmarshalling: ", err)
		c.String(http.StatusInternalServerError, "error while unmarshalling json")
		return
	}
	product.AddedBy = c.Param("userId")

	session, collection, err := getMongoConnection()
	if err != nil {
		c.String(http.StatusInternalServerError, "MongoDB Connection Failed")
		return
	}
	defer session.Close()

	fmt.Println("ProductId: ", c.Param("productId"))
	count, _ := collection.Find(bson.M{"userId": c.Param("userId"), "products.id": c.Param("productId")}).Count()

	if count == 0 {
		c.String(http.StatusNotFound, "")
		return
	}

	query := bson.M{"userId": c.Param("userId"), "products.id": product.Id}
	change := bson.M{"$set": bson.M{"products.$": product}}
	err = collection.Update(query, change)

	if err != nil {
		fmt.Println("Error While updating: ", err)
		c.String(http.StatusInternalServerError, "error while updating products in mongodb")
		return
	}

	sendUpdateProductEvent(c.Param("userId"), c.Param("productId"), *product)

	c.JSON(http.StatusOK, nil)
}

// RemoveProduct User Cart
func RemoveProduct(c *gin.Context) {
	session, collection, err := getMongoConnection()
	if err != nil {
		c.String(http.StatusInternalServerError, "MongoDB Connection Failed")
		return
	}
	defer session.Close()
	fmt.Println("ProductId: ", c.Param("productId"))

	query := bson.M{"userId": c.Param("userId")}
	change := bson.M{"$pull": bson.M{"products": bson.M{"id": c.Param("productId")}}}

	err = collection.Update(query, change)
	if err != nil {
		fmt.Println("Error While removing: ", err)
		c.String(http.StatusInternalServerError, "Error while removing product from mongodb")
		return
	}

	sendRemoveProductEvent(c.Param("userId"), c.Param("productId"))

	c.JSON(http.StatusOK, nil)
}

// PlaceOrder place order for the items in the cart
func PlaceOrder(c *gin.Context) {
	c.Header("Content-Type", "application/json; charset=utf-8")

	session, collection, err := getMongoConnection()
	if err != nil {
		c.String(http.StatusInternalServerError, "MongoDB Connection Failed")
		return
	}
	defer session.Close()

	// get cart information for the user
	var userCart models.UserCart
	err = collection.Find(bson.M{"userId": c.Param("userId")}).One(&userCart)
	if err != nil {
		c.String(http.StatusNotFound, "{\"Error\": \"Could not find cart for this id\"}")
		return
	}

	//b, err := json.Marshal(userCart)
	//fmt.Println(string(b))

	if len(userCart.Products) == 0 {
		c.String(http.StatusNotFound, "{\"Error\": \"cart is empty\"}")
		return
	}

	// remove products from the cart
	var products []models.Product
	query := bson.M{"userId": c.Param("userId")}
	change := bson.M{"$set": bson.M{"products": products}}
	err = collection.Update(query, change)
	if err != nil {
		fmt.Println("Error While removing: ", err)
		c.String(http.StatusInternalServerError, "{\"Error\": \"Could not find cart for this id\"}")
	}

	//TODO: Send event to activity log about order placed successfully
	sendPlaceOrderEvent(userCart)

	c.JSON(http.StatusOK, nil)
}

func getMongoConnection() (mgo.Session, mgo.Collection, error) {

	var collection *mgo.Collection

	var mgoSession *mgo.Session = models.GetMongoSession()
	// session, err := mgo.Dial(models.MongodbServer)
	// if err != nil {
	// 	fmt.Println("mongodb connection failed", err)
	// 	//c.String(http.StatusInternalServerError, "")
	// 	return *session, *collection, err
	// }
	// //defer session.Close()
	// session.SetMode(mgo.SecondaryPreferred, true)

	mgoSession.SetSocketTimeout(10 *  time.Second)
	collection = mgoSession.DB(models.MongodbDatabase).C(models.MongodbCollectionUserCarts)

	return *mgoSession, *collection, nil
}

// --- Activity Log Events --- //

func sendAddProductEvent(userId string, product models.Product) {

	var dic map[string]string
	dic = make(map[string]string)

	productString, _ := json.Marshal(product)

	dic["userid"] = userId
	dic["typeofcart"] = "user"
	dic["product"] = string(productString)
	dic["activity"] = "Product Added"

	requestData, _ := json.Marshal(dic)
	fmt.Println(string(requestData));
	_, err := http.Post(models.ActivityLogServerURL, "application/json", bytes.NewBuffer(requestData))

	if err != nil {
		fmt.Println("Could not send event to activity log server", err)
	}
}

func sendUpdateProductEvent(userId string, productId string, product models.Product) {
	var dic map[string]string
	dic = make(map[string]string)

	productString, _ := json.Marshal(product)

	dic["userid"] = userId
	dic["typeofcart"] = "user"
	dic["product"] = string(productString)
	dic["activity"] = "Product Updated"

	requestData, _ := json.Marshal(dic)

	_, err := http.Post(models.ActivityLogServerURL, "application/json", bytes.NewBuffer(requestData))

	if err != nil {
		fmt.Println("Could not send event to activity log server", err)
	}
}

func sendRemoveProductEvent(userId string, productId string) {
	var dic map[string]string
	dic = make(map[string]string)

	dic["userid"] = userId
	dic["typeofcart"] = "user"
	dic["productId"] = productId
	dic["activity"] = "Product Removed"

	requestData, _ := json.Marshal(dic)

	_, err := http.Post(models.ActivityLogServerURL, "application/json", bytes.NewBuffer(requestData))

	if err != nil {
		fmt.Println("Could not send event to activity log server", err)
	}
}

func sendPlaceOrderEvent(usercart models.UserCart) {
	var dic map[string]string
	dic = make(map[string]string)

	products, _ := json.Marshal(usercart.Products)

	dic["userid"] = usercart.UserId
	dic["typeofcart"] = "user"
	dic["products"] = string(products)
	dic["activity"] = "Order Placed"

	requestData, _ := json.Marshal(dic)

	_, err := http.Post(models.ActivityLogServerURL, "application/json", bytes.NewBuffer(requestData))

	if err != nil {
		fmt.Println("Could not send event to activity log server", err)
	}

	fmt.Println("###########################")
	fmt.Println(string(requestData))

	dic = make(map[string]string)
	dic["products"] = string(products)
	requestData, _ = json.Marshal(dic)

	fmt.Println("$$$$$$$$$$$$$$$$$$$$$$$$$$$")
	fmt.Println(string(requestData))

	_, err = http.Post(models.RecommendationServerURL, "application/json", bytes.NewBuffer(requestData))

	if err != nil {
		fmt.Println("Could not send event to recommandation server", err)
	}

}
