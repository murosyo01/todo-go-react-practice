package handler

import (
	"net/http"
	"strconv"
	"todoapp/model"

	"github.com/gin-gonic/gin"
)

// 全てのユーザを取得するハンドラー
func GetUsers(c *gin.Context) {
	users, err := model.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

// ユーザIDでユーザを取得するハンドラー
func GetUserByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "IDが不正です"})
		return
	}

	user, err := model.GetUserByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ユーザーが見つかりません"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// ユーザを登録するハンドラー
func RegisterUser(c *gin.Context) {
	var user model.User
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "不正なJSONです"})
		return
	}

	if err := model.InsertUser(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ユーザー登録に失敗しました"})
		return
	}
	c.JSON(http.StatusCreated, user)
}

// ユーザを更新するハンドラー
func UpdateUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "IDが不正です"})
		return
	}

	existingUser, err := model.GetUserByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ユーザーが見つかりません"})
		return
	}

	var updateData model.User
	if err := c.BindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "不正なJSONです"})
		return
	}

	updateData.ID = existingUser.ID // Ensure we update the correct user
	if err := model.UpdateUser(updateData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ユーザー更新に失敗しました"})
		return
	}
	c.JSON(http.StatusOK, updateData)
}

// ユーザを削除するハンドラー
func DeleteUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "IDが不正です"})
		return
	}

	if err := model.DeleteUser(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ユーザー削除に失敗しました"})
		return
	}
	c.Status(http.StatusNoContent)
}

// ユーザのログインを処理するハンドラー
func PostLogin(c *gin.Context) {
	var loginData struct {
		MailAddress string `json:"mail_address"`
		Password    string `json:"password"`
	}

	if err := c.BindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "不正なJSONです"})
		return
	}

	user, err := model.GetUserByMailAddress(loginData.MailAddress)
	if err != nil || !model.CheckPassword(user.Password, loginData.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "メールアドレスまたはパスワードが間違っています"})
		return
	}

	userResponse := gin.H{
		"id":           user.ID,
		"username":     user.UserName,
		"mail_address": user.MailAddress,
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "ログイン成功",
		"user":    userResponse,
	})
}

// ユーザのメールアドレスでユーザを取得するハンドラー
func GetUserByMailAddress(c *gin.Context) {
	mailAddress := c.Param("mail_address")

	user, err := model.GetUserByMailAddress(mailAddress)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ユーザーが見つかりません"})
		return
	}
	c.JSON(http.StatusOK, user)
}
