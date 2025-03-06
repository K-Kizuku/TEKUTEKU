package handler

import (
	"encoding/json"
	"net/http"

	"github.com/0-s0g0/TEKUTEKU/server/internal/app/handler/schema"

	"github.com/0-s0g0/TEKUTEKU/server/internal/app/service"
)

type IMessageHandler interface {
	GET() func(http.ResponseWriter, *http.Request) error
	POST() func(http.ResponseWriter, *http.Request) error
}

type MessageHandler struct {
	ms service.IMessageService
}

func NewMessageHandler(ms service.IMessageService) IMessageHandler {
	return &MessageHandler{
		ms: ms,
	}
}

// GET implements IMessageHandler.
func (m *MessageHandler) GET() func(http.ResponseWriter, *http.Request) error {
	return func(w http.ResponseWriter, s *http.Request) error {
		message, err := m.ms.GetAll(s.Context())
		if err != nil {
			return err
		}
		m := make([]schema.Message, 0, len(message))
		for _, v := range message {
			m = append(m, schema.Message{
				ID:        v.ID,
				School:    v.School,
				Message:   v.Message,
				Likes:     v.Likes,
				X:         v.X,
				Y:         v.Y,
				FloatTime: v.FloatTime,
			})
		}
		res := schema.MessageGETResponse{
			Messages: m,
		}
		if err := json.NewEncoder(w).Encode(res); err != nil {
			return err
		}
		w.WriteHeader(http.StatusCreated)
		return nil

	}
}

// POST implements IMessageHandler.
func (m *MessageHandler) POST() func(http.ResponseWriter, *http.Request) error {
	return nil
}
