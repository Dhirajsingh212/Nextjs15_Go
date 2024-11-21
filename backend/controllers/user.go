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
	Email    string `json:"email"`
	Password string `json:"password"`
}

func AuthUser(c *gin.Context) {
	var userData UserInputs
	if err := c.BindJSON(&userData); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "User details incomplete",
		})
	}

	var findDBDetails models.User
	database.DB.Where("email = ?", userData.Email).First(&findDBDetails)

	if findDBDetails.Email != "" {
		token, id, err := SignInUser(userData)
		if err != nil || id == 0 {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
				"success": false,
			})
		}
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "User SignedIn",
			"id":      id,
			"email":   userData.Email,
			"token":   token,
		})
		return

	} else {
		token, id, err := SignupUser(userData)
		if err != nil || id == 0 {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
				"success": false,
			})
		}
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "User SignedUp",
			"id":      id,
			"email":   userData.Email,
			"token":   token,
		})
		return
	}

}

func SignupUser(userDetails UserInputs) (token string, id int, err error) {

	hp := utils.HashPassowrd(userDetails.Password)
	user := models.User{Email: userDetails.Email, Password: hp}
	if err := database.DB.Create(&user).Error; err != nil {
		return "", 0, err
	}

	var findUserDbData models.User

	database.DB.Where("email = ?", user.Email).First(&findUserDbData)

	jwtToken := utils.GenerateToken(findUserDbData.Email, strconv.FormatUint(uint64(findUserDbData.ID), 10))

	return jwtToken, int(findUserDbData.ID), nil
}

func SignInUser(body UserInputs) (token string, id int, err error) {
	var UserDetails models.User
	if err := database.DB.Where("email = ?", body.Email).First(&UserDetails).Error; err != nil {
		return "", 0, err
	}

	if UserDetails.Email == "" {
		return "", 0, err
	}

	isValidPassword := utils.VerifyPassword(UserDetails.Password, body.Password)

	if !isValidPassword {
		return "", 0, err
	}

	jwtToken := utils.GenerateToken(UserDetails.Email, strconv.FormatUint(uint64(UserDetails.ID), 10))

	return jwtToken, int(UserDetails.ID), nil
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

func VerifyToken(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
	})
}
