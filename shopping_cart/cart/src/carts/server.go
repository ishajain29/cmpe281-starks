package main

import (
	"carts/sharedcart"
	"carts/usercart"

	"github.com/gin-gonic/gin"
)

func main() {
	// Creates a gin router with default middleware:
	// logger and recovery (crash-free) middleware
	router := gin.Default()

	r1 := router.Group("/carts/user")
	{
		r1.POST("", usercart.CreateCart)
		r1.GET("/:id", usercart.GetCart)
		//r1.PUT("/:id", usercart.Update)
		//r1.PATCH("/:id", usercart.UpdateCart)
		r1.DELETE("/:id", usercart.DeleteCart)

		r1.POST("/:id/product", usercart.AddProduct)
		r1.PUT("/:id/product/:productid", usercart.UpdateProduct)
		r1.DELETE("/:id/product/:productid", usercart.RemoveProduct)
	}

	r2 := router.Group("/carts/shared")
	{
		r2.POST("", sharedcart.CreateCart)
		r2.GET("/:id", sharedcart.GetCart)
		//r2.PATCH("/:id", usercart.UpdateCart)
		//r2.PUT("/:id", sharedcart.Update)
		r2.DELETE("/:id", sharedcart.DeleteCart)
	}
	// By default it serves on :8080
	router.Run()
}
