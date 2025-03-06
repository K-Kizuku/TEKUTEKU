package timeformat

import (
	"log"
	"time"
)

const Layout = "2006-01-02 15:04:05"

func Format(t time.Time) string {
	return t.Format(Layout)
}

func Parse(s string) time.Time {
	t, err := time.Parse(Layout, s)
	if err != nil {
		log.Printf("time.Parse error: %v", err)
		return time.Now()
	}
	return t
}
