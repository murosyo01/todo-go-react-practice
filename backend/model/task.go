package model

import (
	"todoapp/db"
)

type Task struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
}

func GetAllTasks() ([]Task, error) {
	// ここにSQLでDBからタスク一覧を取得する処理を書く
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

func GetTaskByID(id int) (Task, error) {
	var t Task
	err := db.Db.QueryRow("SELECT id, title, description, status FROM tasks WHERE id = $1", id).
		Scan(&t.ID, &t.Title, &t.Description, &t.Status)
	return t, err
}

func InsertTask(t Task) error {
	// ここにSQLでDBへ挿入する処理を書く
	_, err := db.Db.Exec(
		"INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3)",
		t.Title, t.Description, t.Status,
	)
	return err
}

func UpdateTask(t Task) error {
	_, err := db.Db.Exec(
		"UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4",
		t.Title, t.Description, t.Status, t.ID,
	)
	return err
}

func DeleteTask(id int) error {
	_, err := db.Db.Exec(
		"DELETE FROM tasks WHERE id = $1",
		id,
	)
	return err
}
