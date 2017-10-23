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

	session, err := mgo.Dial(models.MongodbServer)
	if err != nil {
		fmt.Println("mongodb connection failed")
		c.String(http.StatusInternalServerError, "{\"Error\": \"mongodb connection failed\"}")
		return
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB(models.MongodbDatabase).C(models.MongodbCollectionSharedCarts)

	// Create Empty Cart
	var products []models.Product

	cartId := bson.NewObjectId()
	var arrGroupUsers []string

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

	session, err := mgo.Dial(models.MongodbServer)
	if err != nil {
		fmt.Println("mongodb connection failed")
		panic(err)
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB(models.MongodbDatabase).C(models.MongodbCollectionSharedCarts)

	var sharedCart models.SharedCart
	err = collection.FindId(bson.ObjectIdHex(c.Param("cartId"))).One(&sharedCart)
	//err = collection.Find(bson.M{"userId": c.Param("cartId")}).One(&userCart)

	if err != nil {
		c.String(http.StatusNotFound, "{\"Error\": \"Could no cart found for this id\"}")
		return
	}

	uj, _ := json.Marshal(sharedCart)

	c.String(http.StatusOK, string(uj))
}

// DeleteCart Delete shared cart
func DeleteCart(c *gin.Context) {
	session, err := mgo.Dial(models.MongodbServer)
	if err != nil {
		fmt.Println("mongodb connection failed")
		panic(err)
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB(models.MongodbDatabase).C(models.MongodbCollectionSharedCarts)

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
		c.String(http.StatusInternalServerError, "")
		return
	}

	session, err := mgo.Dial(models.MongodbServer)
	if err != nil {
		fmt.Println("mongodb connection failed", err)
		c.String(http.StatusInternalServerError, "")
		return
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB(models.MongodbDatabase).C(models.MongodbCollectionSharedCarts)

	query := bson.M{"_id": bson.ObjectIdHex(c.Param("cartId"))}
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

	session, err := mgo.Dial(models.MongodbServer)
	if err != nil {
		fmt.Println("mongodb connection failed", err)
		c.String(http.StatusInternalServerError, "")
		return
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB(models.MongodbDatabase).C(models.MongodbCollectionSharedCarts)

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
	collection := session.DB(models.MongodbDatabase).C(models.MongodbCollectionSharedCarts)

	fmt.Println("ProductId: ", c.Param("productId"))

	query := bson.M{"_id": bson.ObjectIdHex(c.Param("cartId"))}
	change := bson.M{"$pull": bson.M{"products": bson.M{"id": bson.ObjectIdHex(c.Param("productId"))}}}

	err = collection.Update(query, change)
	if err != nil {
		fmt.Println("Error While removing: ", err)
	}
	c.String(http.StatusOK, "")
}
