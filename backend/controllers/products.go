package controllers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// Users struct which contains
// an array of users
type Products struct {
	Products []Product `json:"products"`
}

// User struct which contains a name
// a type and a list of social links
type Product struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Price       int    `json:"price"`
	Category    string `json:"category"`
	Image       string `json:"image"`
}

func GetAllProducts(c *gin.Context) {
	jsonFile, err := os.Open("data.json")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"success": false, "data": nil})
	}
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	var products Products

	json.Unmarshal(byteValue, &products)

	c.JSON(http.StatusOK, gin.H{"success": true, "data": products})
}
