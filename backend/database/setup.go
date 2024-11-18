package database

import (
	"fmt"
	"log"

	"github.com/Dhirajsingh212/backend/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := "host=postgres user=postgres password=postgres dbname=mydb port=5432 sslmode=disable timezone=Asia/Shanghai"

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect to databse")
	}
	database.AutoMigrate(&models.User{}, &models.Post{})
	DB = database
	defer fmt.Println("Database connected")
}
