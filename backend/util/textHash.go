package util

import (
	"golang.org/x/crypto/bcrypt"
)

// 文字列をハッシュ化する関数
func EncryptText(text string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(text), bcrypt.DefaultCost)
	return string(hash), err
}

// リクエストされたテキストをハッシュ化してハッシュ化されたテキストと比較する関数
func CompareHashAndPassword(hashedText, requestText string) error {
	if err := bcrypt.CompareHashAndPassword([]byte(hashedText), []byte(requestText)); err != nil {
		return err
	}
	return nil
}
