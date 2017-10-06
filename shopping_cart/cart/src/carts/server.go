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
		r1.POST("", usercart.Create)
		r1.GET("/:id", usercart.Get)
		r1.PUT("/:id", usercart.Update)
		r1.DELETE("/:id", usercart.Delete)
	}

	r2 := router.Group("/carts/shared")
	{
		r2.POST("", sharedcart.Create)
		r2.GET("/:id", sharedcart.Get)
		r2.PUT("/:id", sharedcart.Update)
		r2.DELETE("/:id", sharedcart.Delete)
	}
	// By default it serves on :8080
	router.Run()
}
