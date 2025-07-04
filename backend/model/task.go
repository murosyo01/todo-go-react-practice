package model

import (
	"todoapp/db"
)

// タスクを表す構造体
// タスクのID、タイトル、説明、ステータスを含む
// タスクのステータスは、"pending", "in_progress", "completed" などの値を取ることができます。
type Task struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
}

// タスクの一覧を取得する関数
func GetAllTasks() ([]Task, error) {
	rows, err := db.Db.Query("SELECT id, title, description, status FROM tasks ORDER BY id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.Status); err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}
	return tasks, nil
}

// タスクIDでタスクを取得する関数
func GetTaskByID(id int) (Task, error) {
	var t Task
	err := db.Db.QueryRow("SELECT id, title, description, status FROM tasks WHERE id = $1", id).
		Scan(&t.ID, &t.Title, &t.Description, &t.Status)
	return t, err
}

// タスクを挿入する関数
func InsertTask(t Task) error {
	_, err := db.Db.Exec(
		"INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3)",
		t.Title, t.Description, t.Status,
	)
	return err
}

// タスクを更新する関数
func UpdateTask(t Task) error {
	_, err := db.Db.Exec(
		"UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4",
		t.Title, t.Description, t.Status, t.ID,
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
