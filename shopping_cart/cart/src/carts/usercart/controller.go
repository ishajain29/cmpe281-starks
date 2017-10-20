package usercart

import (
	"carts/models"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"net/http"
)

// Create New User's Cart
func Create(c *gin.Context) {

	reqUserId, _ := c.GetPostForm("userId")
	c.Header("Content-Type", "application/json; charset=utf-8")

	session, err := mgo.Dial(models.MongodbServer)
	if err != nil {
		fmt.Println("mongodb connection failed")
		panic(err)
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB(models.MongodbDatabase).C(models.MongodbCollectionUserCarts)

	// Check for already existing cart for the same user
	count, err := collection.Find(bson.M{"userId": reqUserId}).Limit(1).Count()
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
		UserId:   reqUserId,
		Products: products,
	}

	err = collection.Insert(emptyUserCart)

	resBody := models.CreateUserCartResponse{
		CartId: cartId.Hex(),
		Link:   models.LinkUserCart + "/" + cartId.Hex(),
	}

	resJSON, _ := json.Marshal(resBody)
	c.String(http.StatusCreated, string(resJSON))
}

func Get(c *gin.Context) {

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
	//err = collection.FindId(bson.ObjectIdHex(c.Param("id"))).One(&userCart)
	err = collection.Find(bson.M{"userId": c.Param("id")}).One(&userCart)

	if err != nil {
		c.String(http.StatusNotFound, "{\"Error\": \"Could no cart found for this id\"}")
		return
	}

	uj, _ := json.Marshal(userCart)

	c.String(http.StatusOK, string(uj))
}

func Update(c *gin.Context) {
	c.String(http.StatusOK, "update "+c.Param("id"))
}

func Delete(c *gin.Context) {
	c.String(http.StatusOK, "delete "+c.Param("id"))
}
