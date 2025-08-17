package model

import (
	"todoapp/db"
	"todoapp/util"
)

// ユーザーを表す構造体
// ユーザーのID、ユーザー名、メールアドレス、パスワードを含む
// パスワードはハッシュ化されて保存される
type User struct {
	ID          int    `json:"id"`
	UserName    string `json:"username"`
	MailAddress string `json:"mail_address"`
	Password    string `json:"password"`
}

// ユーザーを作成する関数
func InsertUser(u User) error {
	hashedPassword, error := util.EncryptText(u.Password)

	if error != nil {
		return error
	}

	_, err := db.Db.Exec(
		"INSERT INTO users (username, mail_address, password) VALUES ($1, $2, $3)",
		u.UserName, u.MailAddress, hashedPassword,
	)
	return err
}

// ユーザーを更新する関数
func UpdateUser(u User) error {
	hashedPassword, error := util.EncryptText(u.Password)

	if error != nil {
		return error
	}

	_, err := db.Db.Exec(
		"UPDATE users SET username = $1, mail_address = $2, password = $3 WHERE id = $4",
		u.UserName, u.MailAddress, hashedPassword, u.ID,
	)
	return err
}

// ユーザーを削除する関数
func DeleteUser(id int) error {
	_, err := db.Db.Exec("DELETE FROM users WHERE id = $1", id)
	return err
}

// ユーザーIDでユーザーを取得する関数
func GetUserByID(id int) (User, error) {
	var u User
	err := db.Db.QueryRow("SELECT id, username, mail_address, password FROM users WHERE id = $1", id).
		Scan(&u.ID, &u.UserName, &u.MailAddress, &u.Password)
	return u, err
}

// ユーザー名でユーザーを取得する関数
func GetUserByUserName(username string) (User, error) {
	var u User
	err := db.Db.QueryRow("SELECT id, username, mail_address, password FROM users WHERE username = $1", username).
		Scan(&u.ID, &u.UserName, &u.MailAddress, &u.Password)
	return u, err
}

// ユーザーの一覧を取得する関数
func GetAllUsers() ([]User, error) {
	rows, err := db.Db.Query("SELECT id, username, mail_address, password FROM users ORDER BY id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.UserName, &u.MailAddress, &u.Password); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

// メールアドレスユーザを取得する関数
func GetUserByMailAddress(mailAddress string) (User, error) {
	var u User
	err := db.Db.QueryRow("SELECT id, username, mail_address, password FROM users WHERE mail_address = $1", mailAddress).
		Scan(&u.ID, &u.UserName, &u.MailAddress, &u.Password)
	return u, err
}

// パスワードをチェックする関数
func CheckPassword(hashedPassword, password string) bool {
	return util.CompareHashAndPassword(hashedPassword, password) == nil
}
