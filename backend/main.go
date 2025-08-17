package main

import (
	"todoapp/db"
	"todoapp/handler"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db.Init()

	r := gin.Default()

	config := cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}

	r.Use(cors.New(config))

	// APIのルーティング設定
	r.GET("/tasks", handler.GetTasksByUser)
	r.POST("/tasks", handler.InsertTask)
	r.PUT("/tasks/:id", handler.UpdateTask)
	r.DELETE("/tasks/:id", handler.DeleteTask)
	r.GET("/users", handler.GetUsers)
	r.GET("/users/:id", handler.GetUserByID)
	r.PUT("/users/:id", handler.UpdateUser)
	r.DELETE("/users/:id", handler.DeleteUser)
	r.POST("/register", handler.RegisterUser)
	// ユーザ認証のルーティング設定
	r.POST("/login", handler.PostLogin)

	r.Run(":8080")
}
