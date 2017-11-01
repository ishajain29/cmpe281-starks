package sharedcart

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

// CreateCart Create New Shared's Cart
func CreateCart(c *gin.Context) {

	jsonRequest, _ := ioutil.ReadAll(c.Request.Body)

	request := &models.CreateSharedCartRequest{}
	err := json.Unmarshal([]byte(jsonRequest), request)
	if err != nil {
		fmt.Println("Error Unmarshalling: ", err)
		c.String(http.StatusInternalServerError, "")
		return
	}

	reqAdminId := request.AdminId
	cartName := request.CartName
	c.Header("Content-Type", "application/json; charset=utf-8")

	session, collection, err := getMongoConnection()
	if err != nil {
		c.String(http.StatusInternalServerError, "MongoDB Connection Failed")
		return
	}
	defer session.Close()

	// Create Empty Cart
	var products []models.Product

	cartId := bson.NewObjectId()
	var arrGroupUsers []string
	arrGroupUsers = append(arrGroupUsers, reqAdminId)

	emptySharedCart := models.SharedCart{
		Id:         cartId,
		AdminId:    reqAdminId,
		CartName:   cartName,
		GroupUsers: arrGroupUsers,
		Products:   products,
	}

	err = collection.Insert(emptySharedCart)

	resBody := models.CreateSharedCartResponse{
		CartId:     cartId.Hex(),
		Link:       models.LinkSharedCart + "/" + cartId.Hex(),
		InviteLink: models.LinkSharedCart + "/" + cartId.Hex() + "/join",
	}

	resJSON, _ := json.Marshal(resBody)
	c.String(http.StatusCreated, string(resJSON))
}

// GetCart get shared cart information
func GetCart(c *gin.Context) {

	c.Header("Content-Type", "application/json; charset=utf-8")

	session, collection, err := getMongoConnection()
	if err != nil {
		c.String(http.StatusInternalServerError, "MongoDB Connection Failed")
		return
	}
	defer session.Close()

	var sharedCart models.SharedCart
	err = collection.FindId(bson.ObjectIdHex(c.Param("cartId"))).One(&sharedCart)

	if err != nil {
		c.String(http.StatusNotFound, "{\"Error\": \"Could no cart found for this id\"}")
		return
	}

	uj, _ := json.Marshal(sharedCart)

	c.String(http.StatusOK, string(uj))
}

// DeleteCart Delete shared cart
func DeleteCart(c *gin.Context) {
	session, collection, err := getMongoConnection()
	if err != nil {
		c.String(http.StatusInternalServerError, "")
		return
	}
	defer session.Close()

	err = collection.Remove(bson.M{"_id": bson.ObjectIdHex(c.Param("cartId"))})

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
		c.String(http.StatusInternalServerError, "Error Unmarshalling json")
		return
	}

	session, collection, err := getMongoConnection()
	if err != nil {
		c.String(http.StatusInternalServerError, "MongoDB Connection Failed")
		return
	}
	defer session.Close()

	query := bson.M{"_id": bson.ObjectIdHex(c.Param("cartId"))}
	change := bson.M{"$push": bson.M{"products": product}}
	_, err = collection.Upsert(query, change)
	if err != nil {
		fmt.Println("Error While inserting: ", err)
		c.String(http.StatusInternalServerError, "error while inserting")
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
		c.String(http.StatusInternalServerError, "error while unmarshalling json")
		return
	}

	session, collection, err := getMongoConnection()
	if err != nil {
		c.String(http.StatusInternalServerError, "MongoDB Connection Failed")
		return
	}
	defer session.Close()

	fmt.Println("ProductId: ", c.Param("productId"))
	count, _ := collection.Find(bson.M{"_id": bson.ObjectIdHex(c.Param("cartId")), "products.id": bson.ObjectIdHex(c.Param("productId"))}).Count()

	if count == 0 {
		c.String(http.StatusNotFound, "")
		return
	}

	query := bson.M{"_id": bson.ObjectIdHex(c.Param("cartId")), "products.id": product.Id}
	change := bson.M{"$set": bson.M{"products.$": product}}
	err = collection.Update(query, change)

	if err != nil {
		fmt.Println("Error While updating: ", err)
		c.String(http.StatusInternalServerError, "error while updating in mongo")
		return
	}

	c.String(http.StatusOK, "")
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

	query := bson.M{"_id": bson.ObjectIdHex(c.Param("cartId"))}
	change := bson.M{"$pull": bson.M{"products": bson.M{"id": bson.ObjectIdHex(c.Param("productId"))}}}

	err = collection.Update(query, change)
	if err != nil {
		fmt.Println("Error While removing: ", err)
		c.String(http.StatusInternalServerError, "Error while removing product from mongodb")
		return
	}
	c.String(http.StatusOK, "")
}

// PlaceOrder place order for the items in the cart
func PlaceOrder(c *gin.Context) {

	session, collection, err := getMongoConnection()
	if err != nil {
		c.String(http.StatusInternalServerError, "MongoDB Connection Failed")
		return
	}
	defer session.Close()

	// Get full cart information before placing the order
	var sharedCart models.SharedCart
	err = collection.FindId(bson.ObjectIdHex(c.Param("cartId"))).One(&sharedCart)

	if err != nil {
		c.String(http.StatusNotFound, "{\"Error\": \"Could no cart found for this id\"}")
		return
	}

	b, err := json.Marshal(sharedCart)
	fmt.Println(string(b))

	if len(sharedCart.Products) == 0 {
		c.String(http.StatusNotFound, "{\"Error\": \"cart is empty\"}")
		return
	}

	// Remove cart products from the cart
	var products []models.Product
	query := bson.M{"_id": bson.ObjectIdHex(c.Param("cartId"))}
	change := bson.M{"$set": bson.M{"products": products}}

	err = collection.Update(query, change)
	if err != nil {
		fmt.Println("Error While removing: ", err)
		c.String(http.StatusInternalServerError, "Error while removing product from mongodb")
		return
	}

	//TODO: Send order placed event to user activity log

	c.String(http.StatusOK, "")
}

// AddUser add users to the shared cart
func AddUser(c *gin.Context) {
	jsonRequest, _ := ioutil.ReadAll(c.Request.Body)

	var arrUserId []string

	if err := json.Unmarshal([]byte(jsonRequest), &arrUserId); err != nil {
		fmt.Println("Error Unmarshalling: ", err)
		c.String(http.StatusInternalServerError, "Error Unmarshalling json")
	}

	session, collection, err := getMongoConnection()
	if err != nil {
		c.String(http.StatusInternalServerError, "MongoDB Connection Failed")
		return
	}
	defer session.Close()

	query := bson.M{"_id": bson.ObjectIdHex(c.Param("cartId"))}
	change := bson.M{"$push": bson.M{"groupUsers": bson.M{"$each": arrUserId}}}
	_, err = collection.Upsert(query, change)
	if err != nil {
		fmt.Println("Error While inserting: ", err)
		c.String(http.StatusInternalServerError, "error while inserting")
		return
	}

	c.String(http.StatusOK, "")

}

// RemoveUser remove users from shared cart
func RemoveUser(c *gin.Context) {

	session, collection, err := getMongoConnection()
	if err != nil {
		c.String(http.StatusInternalServerError, "MongoDB Connection Failed")
		return
	}
	defer session.Close()

	fmt.Println("UserId: ", c.Param("userId"))

	query := bson.M{"_id": bson.ObjectIdHex(c.Param("cartId"))}
	change := bson.M{"$pull": bson.M{"groupUsers": c.Param("userId")}}

	err = collection.Update(query, change)
	if err != nil {
		fmt.Println("Error While removing user: ", err)
		c.String(http.StatusInternalServerError, "Error while removing group user from mongodb")
		return
	}

	c.String(http.StatusOK, "")
}

func GetUsersAllSharedCart(userId string) []models.SharedCart {
	var sharedCarts []models.SharedCart

	session, collection, err := getMongoConnection()
	if err != nil {
		//c.String(http.StatusInternalServerError, "MongoDB Connection Failed")
		fmt.Println("MongoDB Connection Failed")
		return sharedCarts
	}
	defer session.Close()

	var arrUserId []string
	arrUserId = append(arrUserId, userId)

	err = collection.Find(bson.M{"groupUsers": bson.M{"$in": arrUserId}}).All(&sharedCarts)

	if err != nil {
		//c.String(http.StatusNotFound, "{\"Error\": \"Could no cart found for this id\"}")
		fmt.Println("no cart found for this id")
		return sharedCarts
	}
	return sharedCarts
}

func getMongoConnection() (mgo.Session, mgo.Collection, error) {

	var collection *mgo.Collection

	session, err := mgo.Dial(models.MongodbServer)
	if err != nil {
		fmt.Println("mongodb connection failed", err)
		//c.String(http.StatusInternalServerError, "")
		return *session, *collection, err
	}
	//defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection = session.DB(models.MongodbDatabase).C(models.MongodbCollectionSharedCarts)

	return *session, *collection, nil
}
