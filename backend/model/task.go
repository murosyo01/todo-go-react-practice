package model

import (
	"time"
	"todoapp/db"
)

// タスクを表す構造体
// タスクのID、タイトル、説明、ステータスを含む
// タスクのステータスは、"未着手", "進行中", "完了" の値を取ることができます。
type Task struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	UserID      int       `json:"user_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ユーザごとのタスク一覧を取得する関数
func GetTasksByUserID(userID int) ([]Task, error) {
	rows, err := db.Db.Query("SELECT id, title, description, status, user_id, created_at, updated_at FROM tasks WHERE user_id = $1 ORDER BY id",
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.Status, &t.UserID, &t.CreatedAt, &t.UpdatedAt); err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}
	return tasks, nil
}

// タスクIDでタスクを取得する関数
func GetTaskByID(id int) (Task, error) {
	var t Task
	err := db.Db.QueryRow("SELECT id, title, description, status, user_id, created_at, updated_at FROM tasks WHERE id = $1", id).
		Scan(&t.ID, &t.Title, &t.Description, &t.Status, &t.UserID, &t.CreatedAt, &t.UpdatedAt)
	return t, err
}

// タスクを挿入する関数
func InsertTask(t Task) error {
	_, err := db.Db.Exec(
		"INSERT INTO tasks (title, description, status, user_id) VALUES ($1, $2, $3, $4)",
		t.Title, t.Description, t.Status, t.UserID,
	)
	return err
}

// タスクを更新する関数
func UpdateTask(t Task) error {
	_, err := db.Db.Exec(
		"UPDATE tasks SET title = $1, description = $2, status = $3, updated_at = $4 WHERE id = $5",
		t.Title, t.Description, t.Status, t.UpdatedAt, t.ID,
	)
	return err
}

// タスクを削除する関数
func DeleteTask(id int) error {
	_, err := db.Db.Exec(
		"DELETE FROM tasks WHERE id = $1",
		id,
	)
	return err
}
