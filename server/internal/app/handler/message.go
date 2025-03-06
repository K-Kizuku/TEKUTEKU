package handler

import (
	"net/http"

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
	panic("unimplemented")
}

// POST implements IMessageHandler.
func (m *MessageHandler) POST() func(http.ResponseWriter, *http.Request) error {
	panic("unimplemented")
}
