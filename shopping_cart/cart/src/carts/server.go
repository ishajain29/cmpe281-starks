package main

import (
	"carts/models"
	"carts/sharedcart"
	"carts/usercart"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/itsjamie/gin-cors"
	"github.com/joho/godotenv"
	"net/http"
	"os"
	"time"
)

var ServerAddress string
var ServerPort string

func init() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}
	ServerAddress = os.Getenv("SERVER_ADDRESS")
	ServerPort = os.Getenv("SERVER_PORT")
}

func main() {
	// Creates a gin router with default middleware:
	// logger and recovery (crash-free) middleware
	router := gin.Default()

	// Apply the middleware to the router (works with groups too)
	router.Use(cors.Middleware(cors.Config{
		Origins:         "*",
		Methods:         "GET, PUT, POST, DELETE",
		RequestHeaders:  "Origin, Authorization, Content-Type",
		ExposedHeaders:  "",
		MaxAge:          50 * time.Second,
		Credentials:     true,
		ValidateHeaders: false,
	}))

	router.GET("", ping)
	r1 := router.Group("/carts/user")
	{
		r1.POST("", usercart.CreateCart)
		r1.GET("/:userId", usercart.GetCart)
		r1.DELETE("/:userId", usercart.DeleteCart)

		r1.POST("/:userId/order", usercart.PlaceOrder)

		r1.POST("/:userId/product", usercart.AddProduct)
		r1.PUT("/:userId/product/:productId", usercart.UpdateProduct)
		r1.DELETE("/:userId/product/:productId", usercart.RemoveProduct)
	}

	r2 := router.Group("/carts/shared")
	{
		r2.POST("", sharedcart.CreateCart)
		r2.GET("/:cartId", sharedcart.GetCart)
		r2.DELETE("/:cartId", sharedcart.DeleteCart)

		r2.POST("/:cartId/order", sharedcart.PlaceOrder)

		r2.POST("/:cartId/product", sharedcart.AddProduct)
		r2.PUT("/:cartId/product/:productId", sharedcart.UpdateProduct)
		r2.DELETE("/:cartId/product/:productId", sharedcart.RemoveProduct)

		r2.POST("/:cartId/user", sharedcart.AddUser)
		r2.DELETE("/:cartId/user/:userId", sharedcart.RemoveUser)
	}

	router.GET("carts/user/:userId/all", getAllUserCarts)

	var userCart models.UserCart
	fmt.Println(userCart)

	// By default it serves on :8080
	router.Run(":" + ServerPort)
}

func getAllUserCarts(c *gin.Context) {
	c.Header("Content-Type", "application/json; charset=utf-8")

	userCart := usercart.GetUserCart(c.Param("userId"))

	sharedCarts := sharedcart.GetUsersAllSharedCart(c.Param("userId"))

	var combineCarts models.CombineCarts
	combineCarts.UserCarts = userCart
	combineCarts.SharedCarts = sharedCarts

	uj, _ := json.Marshal(combineCarts)
	c.String(http.StatusOK, string(uj))
}

func ping(c *gin.Context) {
	c.String(http.StatusOK, "Server running...")
}
