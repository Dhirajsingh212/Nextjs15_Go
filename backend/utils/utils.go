package utils

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func HashPassowrd(password string) string {
	byteData, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Fatal("Failed to hash password")
	}
	return string(byteData)
}

func VerifyPassword(dbPassword string, reqPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(dbPassword), []byte(reqPassword))
	return err == nil
}

func GenerateToken(username string, userId string) string {
	secretKey := os.Getenv("SECRET_KEY")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": username,
		"userId":   userId,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})
	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return ""
	}
	return tokenString
}

func VerifyToken(tokenString string) string {
	secretKey := os.Getenv("SECRET_KEY")
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil {
		return ""
	}
	if !token.Valid {
		return ""
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {

		userId := claims["userId"] // Another example key
		fmt.Println(userId)
		return userId.(string)
	} else {
		fmt.Println("Invalid token or claims parsing failed")
		return ""
	}
}
