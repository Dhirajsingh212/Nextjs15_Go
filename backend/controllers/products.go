package controllers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type Products struct {
	Products []Product `json:"products"`
}

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
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{
			"success": false,
			"data":    nil,
		})
	}
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	var products Products

	json.Unmarshal(byteValue, &products)

	pageNumberStr := c.Query("page")
	searchText := c.Query("search")

	pageNumber, err := strconv.Atoi(pageNumberStr)
	if err != nil || pageNumber < 1 {
		pageNumber = 1
	}

	startIndex := (pageNumber - 1) * 10
	endIndex := startIndex + 10

	if startIndex > len(products.Products) {
		startIndex = len(products.Products)
	}
	if endIndex > len(products.Products) {
		endIndex = len(products.Products)
	}

	var filteredData []Product

	for i := 0; i < len(products.Products); i++ {
		if strings.Contains(strings.ToLower(searchText), strings.ToLower(products.Products[i].Name)) {
			filteredData = append(filteredData, products.Products[i])
		}
	}

	fmt.Println(filteredData)

	if len(filteredData) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"success":    true,
			"totalPages": len(filteredData) / 10,
			"data":       filteredData,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"totalPages": len(filteredData) / 10,
		"data":       filteredData[startIndex:endIndex],
	})
}
