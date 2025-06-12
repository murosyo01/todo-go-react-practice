package main

import (
	"fmt"
	"os"
	"todoapp/db"
	"todoapp/handler"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db.Init()
	fmt.Println("DB_HOST:", os.Getenv("DB_HOST"))
	fmt.Println("DB_PORT:", os.Getenv("DB_PORT"))
	fmt.Println("DB_USER:", os.Getenv("DB_USER"))
	fmt.Println("DB_PASSWORD:", os.Getenv("DB_PASSWORD"))
	fmt.Println("DB_NAME:", os.Getenv("DB_NAME"))

	r := gin.Default()

	r.Use(cors.Default())

	// APIのルーティング設定
	r.GET("/tasks", handler.GetTasks)
	r.POST("/tasks", handler.InsertTask)
	r.PUT("/tasks", handler.UpdateTask)
	r.DELETE("/tasks/:id", handler.DeleteTask)

	r.Run(":8080") // 8080番ポートで起動
}
