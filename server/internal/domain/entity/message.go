package entity

import "time"

type Message struct {
	ID        string
	Message   string
	Likes     int
	X         int
	Y         int
	FloatTime float32
	School    int
	CreatedAt time.Time
}
