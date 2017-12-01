package models

import (
	"fmt"
	"github.com/joho/godotenv"
	"gopkg.in/mgo.v2"
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

var ActivityLogServerURL = ""
var RecommendationServerURL = ""

var MongoSession *mgo.Session

func init() {

	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	MongodbServer = os.Getenv("MONGODB_SERVER")
	MongodbDatabase = os.Getenv("MONGODB_NAME")
	MongodbCollectionUserCarts = "usercarts"
	MongodbCollectionSharedCarts = "sharedcarts"

	var serverAddress = os.Getenv("SERVER_ADDRESS") + ":" + os.Getenv("SERVER_PORT")
	LinkAPI = serverAddress + "/carts"
	LinkUserCart = LinkAPI + "/user"
	LinkSharedCart = LinkAPI + "/shared"

	ActivityLogServerURL = os.Getenv("ACTIVITY_LOG_SERVER_URL")
	RecommendationServerURL = os.Getenv("RECOMMENDATION_SERVER_URL")

}

func GetMongoSession() *mgo.Session {
	if MongoSession == nil {
		var err error
		MongoSession, err = mgo.DialWithTimeout(MongodbServer, 5 * time.Second)
		if err != nil {
			fmt.Println("mongodb connection failed: ", err)
			panic("mongodb connection failed:")
		}
		MongoSession.SetMode(mgo.Secondary, true)
		fmt.Println("New Mongo Session Created")
	}
	return MongoSession.Clone()
}

const (
	UPDATE_ADD    = "add"
	UPDATE_REMOVE = "remove"
	UPDATE_REPACE = "replace"
)

type (
	CombineCarts struct {
		UserCarts   UserCart     `json:"userCart"`
		SharedCarts []SharedCart `json:"sharedCarts"`
	}

	UserCart struct {
		Id       bson.ObjectId `json:"id" bson:"_id,omitempty"`
		UserId   string        `json:"userId" bson:"userId"`
		Products []Product     `json:"products" bson:"products"`
	}

	SharedCart struct {
		Id             bson.ObjectId `json:"id" bson:"_id,omitempty"`
		AdminId        string        `json:"adminId" bson:"adminId"`
		CartName       string        `json:"cartName" bson:"cartName"`
		GroupUsers     []string      `json:"groupUsers" bson:"groupUsers"`
		Products       []Product     `json:"products" bson:"products"`
		ExpirationDate time.Time     `json:"expirationDate" bson:"expirationDate"`
	}

	Product struct {
		Id       string  `json:"id" bson:"id"`
		Quantity int     `json:"quantity" bson:"quantity"`
		Name     string  `json:"name" bson:"name"`
		Price    float32 `json:"price" bson:"price"`
		AddedBy  string  `json:"addedBy" bson:"addedBy"`
	}

	CreateSharedCartResponse struct {
		CartId     string `json:"cartId"`
		Link       string `json:"link"`
		InviteLink string `json:"inviteLink"`
	}

	CreateUserCartRequest struct {
		UserId string `json:userId`
	}

	CreateSharedCartRequest struct {
		AdminId  string `json:adminId`
		CartName string `json:cartName`
	}
)
