package controllers

import (
	"net/http"
	"strconv"

	"github.com/Dhirajsingh212/backend/database"
	"github.com/Dhirajsingh212/backend/models"
	"github.com/Dhirajsingh212/backend/utils"
	"github.com/gin-gonic/gin"
)

type UserInputs struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserLoginInputs struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func SignupUser(c *gin.Context) {
	var userDetails UserInputs
	if err := c.BindJSON(&userDetails); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"success": false})
		return
	}

	hp := utils.HashPassowrd(userDetails.Password)
	user := models.User{Username: userDetails.Username, Email: userDetails.Email, Password: hp}
	if err := database.DB.Create(&user).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	var findUserDbData models.User

	database.DB.Where("username = ?", user.Username).First(&findUserDbData)

	token := utils.GenerateToken(findUserDbData.Username, strconv.FormatUint(uint64(findUserDbData.ID), 10))

	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie("token", token, 3600*24, "", "", true, true)
	c.JSON(http.StatusOK, gin.H{"success": true})
}

func SignInUser(c *gin.Context) {
	var body UserLoginInputs
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var UserDetails models.User
	if err := database.DB.Where("username = ?", body.Username).First(&UserDetails).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	if UserDetails.Username == "" {
		c.JSON(http.StatusBadGateway, gin.H{"success": false, "message": "User does not exits"})
		return
	}

	isValidPassword := utils.VerifyPassword(UserDetails.Password, body.Password)

	if !isValidPassword {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Wrong password"})
		return
	}

	token := utils.GenerateToken(UserDetails.Username, strconv.FormatUint(uint64(UserDetails.ID), 10))
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie("token", token, 3600*24, "", "", true, false)
	c.JSON(http.StatusOK, gin.H{"success": true})
}

func GetAllUser(c *gin.Context) {
	var users []models.User

	if err := database.DB.Find(&users).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": users})
}

func DeleteUserById(c *gin.Context) {
	var user models.User
	if err := database.DB.Where("id = ?", c.Param("id")).First(&user).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}
	if err := database.DB.Delete(&user).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": "success"})
}

func GetSingleUser(c *gin.Context) {
	var user models.User
	if err := database.DB.Where("id = ?", c.Param("id")).First(&user).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"success": false, "message": "User does not exists"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": user})
}
