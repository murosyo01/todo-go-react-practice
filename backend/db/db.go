package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var Db *sql.DB

func Init() {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	var err error
	Db, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Failed to open DB: %v", err)
	}

	maxRetries := 30
	retryInterval := 2 * time.Second

	for i := 0; i < maxRetries; i++ {
		if err := Db.Ping(); err != nil {
			log.Printf("Failed to ping DB (attempt %d/%d): %v", i+1, maxRetries, err)
			if i == maxRetries-1 {
				log.Fatalf("Failed to connect to DB after %d attempts", maxRetries)
			}
			time.Sleep(retryInterval)
			continue
		}
		log.Println("Successfully connected to the database")
		return
	}
}
