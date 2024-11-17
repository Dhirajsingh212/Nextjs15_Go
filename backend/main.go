package main

import (
	"log"
	"net/http"

	"github.com/Dhirajsingh212/backend/controllers"
	"github.com/Dhirajsingh212/backend/database"
	"github.com/Dhirajsingh212/backend/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Env not loaded")
	}

	database.ConnectDB()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.GET("/health-check", greetingFunc)

	// USER ROUTES
	r.POST("/auth", controllers.AuthUser)
	r.GET("/getAllUser", middleware.ProtectedCheck, controllers.GetAllUser)
	r.DELETE("/delete/:id", controllers.DeleteUserById)
	r.GET("/user/:id", middleware.ProtectedCheck, controllers.GetSingleUser)
	r.Run("localhost:8080")
}

func greetingFunc(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Server is healthy"})
}
