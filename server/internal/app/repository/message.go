package repository

import (
	"context"
	"github.com/0-s0g0/TEKUTEKU/server/pkg/errors"
	"time"

	"github.com/0-s0g0/TEKUTEKU/server/db/sql/query"
	"github.com/0-s0g0/TEKUTEKU/server/internal/domain/entity"
	"github.com/0-s0g0/TEKUTEKU/server/internal/domain/repository"
)

type MessageRepository struct {
	queries *query.Queries
}

func NewMessageRepository(queries *query.Queries) repository.IMessageRepository {
	return &MessageRepository{queries: queries}
}

// Create implements repository.IMessageRepository.
func (m *MessageRepository) Create(ctx context.Context, message entity.Message) (*entity.Message, error) {
	panic("unimplemented")
}

// GetAll implements repository.IMessageRepository.
func (m *MessageRepository) GetAll(ctx context.Context) ([]entity.Message, error) {
	massage, err := m.queries.GetAllMessage(ctx)
	if err != nil {
		return nil, errors.HandleDBError(err)
	}
	var a []entity.Message
	for _, m := range massage {
		a = append(a, entity.Message{
			ID:        m.MessageID,
			Message:   m.Message,
			Likes:     int(m.Likes),
			X:         int(m.X),
			Y:         int(m.Y),
			FloatTime: m.FloatTime,
		})
	}
	return a, nil
}

// GetByID implements repository.IMessageRepository.
func (m *MessageRepository) GetByID(ctx context.Context, id string) (*entity.Message, error) {
	panic("unimplemented")
}

// GetByTimeRange implements repository.IMessageRepository.
func (m *MessageRepository) GetByTimeRange(ctx context.Context, from time.Time, to time.Time) ([]entity.Message, error) {
	panic("unimplemented")
}
