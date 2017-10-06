package usercart

import (
	"carts/models"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Create(c *gin.Context) {
	c.String(http.StatusOK, "create")
}

func Get(c *gin.Context) {

	u := models.Product{
		Id:       c.Param("id"),
		Quantity: 10,
		Name:     "Google Pixel 2",
		Price:    649,
		AddedBy:  "user_id",
	}

	var products []models.Product

	products = append(products, u)
	products = append(products, u)

	cart := models.UserCart{
		Id:       "cart_id",
		UserId:   "user_id",
		Products: products,
	}

	uj, _ := json.Marshal(cart)

	c.String(http.StatusOK, string(uj))
}

func Update(c *gin.Context) {
	c.String(http.StatusOK, "update "+c.Param("id"))
}

func Delete(c *gin.Context) {
	c.String(http.StatusOK, "delete "+c.Param("id"))
}
