package main

import (
	"carts/sharedcart"
	"carts/usercart"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"net/http"
	"os"
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
	// By default it serves on :8080
	router.Run(":" + ServerPort)
}

func ping(c *gin.Context) {
	c.String(http.StatusOK, "Server running...")
}
