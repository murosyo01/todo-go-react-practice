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

	r.Use(cors.Default())

	// APIのルーティング設定
	r.GET("/tasks", handler.GetTasks)
	r.POST("/tasks", handler.InsertTask)
	r.PUT("/tasks/:id", handler.UpdateTask)
	r.DELETE("/tasks/:id", handler.DeleteTask)

	r.Run(":8080")
}
