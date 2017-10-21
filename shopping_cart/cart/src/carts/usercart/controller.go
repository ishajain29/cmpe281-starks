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
	//_, err = collection.Upsert(emptyUserCart, emptyUserCart)

	if err != nil {
		c.String(http.StatusInternalServerError, "{\"Error\": \"Could not create user cart\"}")
		return
	}

	resBody := models.CreateUserCartResponse{
		CartId: cartId.Hex(),
		Link:   models.LinkUserCart + "/" + cartId.Hex(),
	}

	resJSON, _ := json.Marshal(resBody)
	c.String(http.StatusCreated, string(resJSON))
}

// Get Get User's Cart from user id
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

// Update update user cart with patch method
func Update(c *gin.Context) {
	jsonResponse, _ := ioutil.ReadAll(c.Request.Body)
	//fmt.Printf("%s", string(jsonResponse))

	request := &models.UpdateUserCartRequest{}
	err := json.Unmarshal([]byte(jsonResponse), request)
	if err != nil {
		fmt.Println("Error Unmarshalling: ", err)
	}

	session, err := mgo.Dial(models.MongodbServer)
	if err != nil {
		fmt.Println("mongodb connection failed")
		panic(err)
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB(models.MongodbDatabase).C(models.MongodbCollectionUserCarts)

	for i := 0; i < len(request.Updates); i++ {
		switch request.Updates[i].Operation {
		case models.UPDATE_ADD:
			addProductsInCart(collection, request.Updates[i].Products, c.Param("id"))
		case models.UPDATE_REMOVE:
			removeProductsFromCart(collection, request.Updates[i].Products, c.Param("id"))
		case models.UPDATE_REPACE:
			replaceProductsInCart(collection, request.Updates[i].Products, c.Param("id"))
		}
	}

	println(request.Updates[0].Operation)

	c.String(http.StatusOK, "Update")
}

// Delete delete user cart
func Delete(c *gin.Context) {
	c.String(http.StatusOK, "delete "+c.Param("id"))
}

func addProductsInCart(collection *mgo.Collection, products []models.Product, userId string) {

	for i := 0; i < len(products); i++ {

		count, _ := collection.Find(bson.M{"userId": userId, "products.id": products[i].Id}).Count()

		fmt.Println("Product Id: ", products[i].Id.Hex(), " Count: ", count)

		if count > 0 {
			query := bson.M{"userId": userId, "products.id": products[i].Id}
			change := bson.M{"$set": bson.M{"products.$": products[i]}}
			err := collection.Update(query, change)

			if err != nil {
				fmt.Println("Error While updating: ", err)
			}

		} else {
			query := bson.M{"userId": userId}
			//query := bson.M{"userId": userId, "products.id": bson.M{"$in": []models.Product{models.Product{Id: products[i].Id}}}}
			change := bson.M{"$push": bson.M{"products": products[i]}}
			_, err := collection.Upsert(query, change)
			if err != nil {
				fmt.Println("Error While inserting: ", err)
			}
		}
	}

}

func removeProductsFromCart(collection *mgo.Collection, products []models.Product, userId string) {

}

func replaceProductsInCart(collection *mgo.Collection, products []models.Product, userId string) {

}
