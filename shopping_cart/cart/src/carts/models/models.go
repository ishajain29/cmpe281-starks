package models

import (
	"github.com/joho/godotenv"
	"gopkg.in/mgo.v2/bson"
	"os"
	"time"
)

// MongoDB Config
var MongodbServer = ""
var MongodbDatabase = ""
var MongodbCollectionUserCarts = ""
var MongodbCollectionSharedCarts = ""

var LinkAPI = ""
var LinkUserCart = ""
var LinkSharedCart = ""

func init() {

	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	MongodbServer = os.Getenv("MONGODB_SERVER")
	MongodbDatabase = os.Getenv("MONGODB_NAME")
	MongodbCollectionUserCarts = "usercarts"
	MongodbCollectionSharedCarts = "sharedcarts"

	LinkAPI = os.Getenv("SERVER_ADDRESS") + "/carts"
	LinkUserCart = LinkAPI + "/user"
	LinkSharedCart = LinkAPI + "/shared"

	println("LinkSharedCart:", LinkSharedCart)
}

type (
	UserCart struct {
		Id       bson.ObjectId `json:"id" bson:"_id,omitempty"`
		UserId   string        `json:"userId" bson:"userId"`
		Products []Product     `json:"products" bson:"products"`
	}

	SharedCart struct {
		Id             bson.ObjectId `json:"id" bson:"_id,omitempty"`
		AdminId        string        `json:"adminId" bson:"adminId"`
		GroupUsers     []string      `json:"groupUsers" bson:"groupUsers"`
		Products       []Product     `json:"products" bson:"products"`
		ExpirationDate time.Time     `json:"expirationDate" bson:"expirationDate"`
	}

	Product struct {
		Id       bson.ObjectId `json:"id" bson:"_id,omitempty"`
		Quantity int           `json:"quantity" bson:"quantity"`
		Name     string        `json:"name" bson:"name"`
		Price    float32       `json:"price" bson:"price"`
		AddedBy  string        `json:"addedBy" bson:"addedBy"`
	}

	CreateUserCartResponse struct {
		CartId string `json:"cartId"`
		Link   string `json:"link"`
	}

	CreateSharedCartResponse struct {
		CartId     string `json:"cartId"`
		Link       string `json:"link"`
		InviteLink string `json:"inviteLink"`
	}
)
