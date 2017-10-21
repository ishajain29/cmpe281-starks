package sharedcart

import (
	"carts/models"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"net/http"
)

func CreateCart(c *gin.Context) {

	reqAdminId, _ := c.GetPostForm("adminId")
	c.Header("Content-Type", "application/json; charset=utf-8")

	session, err := mgo.Dial(models.MongodbServer)
	if err != nil {
		fmt.Println("mongodb connection failed")
		panic(err)
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
	err = collection.FindId(bson.ObjectIdHex(c.Param("id"))).One(&sharedCart)
	//err = collection.Find(bson.M{"userId": c.Param("id")}).One(&userCart)

	if err != nil {
		c.String(http.StatusNotFound, "{\"Error\": \"Could no cart found for this id\"}")
		return
	}

	uj, _ := json.Marshal(sharedCart)

	c.String(http.StatusOK, string(uj))
}

func UpdateCart(c *gin.Context) {
	c.String(http.StatusOK, "update "+c.Param("id"))
}

func DeleteCart(c *gin.Context) {
	c.String(http.StatusOK, "delete "+c.Param("id"))
}
