package usercart

import (
	"carts/models"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	"net/http"
)

// CreateCart Create New User's Cart
func CreateCart(c *gin.Context) {

	jsonRequest, _ := ioutil.ReadAll(c.Request.Body)

	request := &models.CreateUserCartRequest{}
	err := json.Unmarshal([]byte(jsonRequest), request)
	if err != nil {
		fmt.Println("Error Unmarshalling: ", err)
		c.String(http.StatusInternalServerError, "")
		return
	}

	requserId := request.UserId
	c.Header("Content-Type", "application/json; charset=utf-8")

	session, err := mgo.Dial(models.MongodbServer)
	if err != nil {
		fmt.Println("mongodb connection failed")
		c.String(http.StatusInternalServerError, "{\"Error\": \"mongodb connection failed\"}")
		return
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB(models.MongodbDatabase).C(models.MongodbCollectionUserCarts)

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

	c.String(http.StatusCreated, "")
}

// GetCart Get User's Cart from user id
func GetCart(c *gin.Context) {

	c.Header("Content-Type", "application/json; charset=utf-8")

	session, err := mgo.Dial(models.MongodbServer)
	if err != nil {
		fmt.Println("mongodb connection failed")
		panic(err)
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB(models.MongodbDatabase).C(models.MongodbCollectionUserCarts)

	var userCart models.UserCart
	//err = collection.FindId(bson.ObjectIdHex(c.Param("userId"))).One(&userCart)
	err = collection.Find(bson.M{"userId": c.Param("userId")}).One(&userCart)

	if err != nil {
		c.String(http.StatusNotFound, "{\"Error\": \"Could no cart found for this id\"}")
		return
	}

	uj, _ := json.Marshal(userCart)

	c.String(http.StatusOK, string(uj))
}

// DeleteCart delete user cart
func DeleteCart(c *gin.Context) {

	session, err := mgo.Dial(models.MongodbServer)
	if err != nil {
		fmt.Println("mongodb connection failed")
		panic(err)
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB(models.MongodbDatabase).C(models.MongodbCollectionUserCarts)

	err = collection.Remove(bson.M{"userId": c.Param("userId")})

	if err != nil {
		c.String(http.StatusNotFound, "{\"Error\": \"Could not delete cart\"}")
		return
	}

	c.String(http.StatusOK, "")
}

// AddProduct to User cart
func AddProduct(c *gin.Context) {
	jsonRequest, _ := ioutil.ReadAll(c.Request.Body)

	product := &models.Product{}
	err := json.Unmarshal([]byte(jsonRequest), product)
	if err != nil {
		fmt.Println("Error Unmarshalling: ", err)
		c.String(http.StatusInternalServerError, "")
		return
	}
	product.AddedBy = c.Param("userId")

	session, err := mgo.Dial(models.MongodbServer)
	if err != nil {
		fmt.Println("mongodb connection failed", err)
		c.String(http.StatusInternalServerError, "")
		return
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB(models.MongodbDatabase).C(models.MongodbCollectionUserCarts)

	query := bson.M{"userId": c.Param("userId")}
	change := bson.M{"$push": bson.M{"products": product}}
	_, err = collection.Upsert(query, change)
	if err != nil {
		fmt.Println("Error While inserting: ", err)
		c.String(http.StatusInternalServerError, "")
		return
	}

	c.String(http.StatusOK, "")
}

// UpdateProduct User Cart
func UpdateProduct(c *gin.Context) {
	jsonRequest, _ := ioutil.ReadAll(c.Request.Body)

	product := &models.Product{}
	err := json.Unmarshal([]byte(jsonRequest), product)
	if err != nil {
		fmt.Println("Error Unmarshalling: ", err)
		c.String(http.StatusInternalServerError, "")
		return
	}
	product.AddedBy = c.Param("userId")

	session, err := mgo.Dial(models.MongodbServer)
	if err != nil {
		fmt.Println("mongodb connection failed", err)
		c.String(http.StatusInternalServerError, "")
		return
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB(models.MongodbDatabase).C(models.MongodbCollectionUserCarts)

	fmt.Println("ProductId: ", c.Param("productId"))
	count, _ := collection.Find(bson.M{"userId": c.Param("userId"), "products.id": bson.ObjectIdHex(c.Param("productId"))}).Count()

	if count == 0 {
		c.String(http.StatusNotFound, "")
		return
	}

	query := bson.M{"userId": c.Param("userId"), "products.id": product.Id}
	change := bson.M{"$set": bson.M{"products.$": product}}
	err = collection.Update(query, change)

	if err != nil {
		fmt.Println("Error While updating: ", err)
		c.String(http.StatusInternalServerError, "")
		return
	}

	c.String(http.StatusOK, "")
}

// RemoveProduct User Cart
func RemoveProduct(c *gin.Context) {
	session, err := mgo.Dial(models.MongodbServer)
	if err != nil {
		fmt.Println("mongodb connection failed", err)
		c.String(http.StatusInternalServerError, "")
		return
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB(models.MongodbDatabase).C(models.MongodbCollectionUserCarts)

	fmt.Println("ProductId: ", c.Param("productId"))

	query := bson.M{"userId": c.Param("userId")}
	change := bson.M{"$pull": bson.M{"products": bson.M{"id": bson.ObjectIdHex(c.Param("productId"))}}}

	err = collection.Update(query, change)
	if err != nil {
		fmt.Println("Error While removing: ", err)
	}
	c.String(http.StatusOK, "")
}
