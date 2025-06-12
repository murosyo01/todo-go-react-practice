package handler

import (
	"net/http"
	"strconv"
	"todoapp/model"

	"github.com/gin-gonic/gin"
)

// 全てのタスクを取得するハンドラー
func GetTasks(c *gin.Context) {
	tasks, err := model.GetAllTasks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tasks)
}

// タスクを挿入するハンドラー
func InsertTask(c *gin.Context) {
	var task model.Task
	if err := c.BindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "不正なJSONです"})
		return
	}

	if task.Status == "" {
		task.Status = "not_started"
	}
	if err := model.InsertTask(task); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "タスク登録に失敗しました"})
		return
	}
	c.JSON(http.StatusCreated, task)
}

// タスクを更新するハンドラー
func UpdateTask(c *gin.Context) {
	var task model.Task
	if err := c.BindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "不正なJSONです"})
		return
	}

	existingTask, err := model.GetTaskByID(task.ID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "タスクが見つかりません"})
		return
	}
	if task.Status == "" {
		task.Status = existingTask.Status
	}
	if err := model.UpdateTask(task); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "タスクの更新に失敗しました"})
		return
	}
	c.JSON(http.StatusCreated, task)
}

// タスクを削除するハンドラー
func DeleteTask(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "IDが不正です"})
		return
	}
	if err := model.DeleteTask(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "タスク削除に失敗しました"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "削除成功"})
}
