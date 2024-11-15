package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username  string    `json:"username" gorm:"unique;not null"`
	Email     string    `json:"email" gorm:"unique;not null"`
	Password  string    `json:"password"`
	CreatedAt time.Time `json:"createdAt"`
	Posts     []Post    `json:"post" gorm:"foreignKey:UserID"`
}

type Post struct {
	gorm.Model
	UserID    uint      `json:"userId"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}
