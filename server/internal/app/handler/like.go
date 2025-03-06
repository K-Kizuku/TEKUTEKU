package handler

import (
	"encoding/json"
	"net/http"

	"github.com/0-s0g0/TEKUTEKU/server/internal/app/handler/schema"
	"github.com/0-s0g0/TEKUTEKU/server/internal/app/service"
	"github.com/0-s0g0/TEKUTEKU/server/pkg/errors"
)

type ILikeHandler interface {
	POST() func(http.ResponseWriter, *http.Request) error
}

type LikeHandler struct {
	ms service.IMessageService
}

func NewLikeHandler(ms service.IMessageService) ILikeHandler {
	return &LikeHandler{
		ms: ms,
	}
}

// POST implements IMessageHandler.
func (m *LikeHandler) POST() func(http.ResponseWriter, *http.Request) error {
	return func(w http.ResponseWriter, r *http.Request) error {
		var req schema.LikePOSTRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			return errors.New(http.StatusBadRequest, err)
		}
		if err := m.ms.GiveLike(r.Context(), req.ID); err != nil {
			return errors.New(http.StatusInternalServerError, err)
		}
		w.WriteHeader(http.StatusNoContent)
		return nil
	}
}
