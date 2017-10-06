package sharedcart

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Create(c *gin.Context) {
	c.String(http.StatusOK, "create")
}

func Get(c *gin.Context) {
	c.String(http.StatusOK, "get "+c.Param("id"))
}

func Update(c *gin.Context) {
	c.String(http.StatusOK, "update "+c.Param("id"))
}

func Delete(c *gin.Context) {
	c.String(http.StatusOK, "delete "+c.Param("id"))
}
