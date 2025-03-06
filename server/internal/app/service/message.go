package service

import (
	"context"
	"math/rand"
	"time"

	"github.com/0-s0g0/TEKUTEKU/server/internal/domain/entity"
	"github.com/0-s0g0/TEKUTEKU/server/internal/domain/repository"
	"github.com/0-s0g0/TEKUTEKU/server/pkg/uuid"
)

type IMessageService interface {
	GetAll(ctx context.Context) ([]entity.Message, error)
	GetByID(ctx context.Context, id string) (*entity.Message, error)
	GetByTimeRange(ctx context.Context, from, to time.Time) ([]entity.Message, error)
	Create(ctx context.Context, message entity.Message) (*entity.Message, error)
	GiveLike(ctx context.Context, id string) error
}

type MessageService struct {
	mr repository.IMessageRepository
}

func NewMessageService(mr repository.IMessageRepository) IMessageService {
	return &MessageService{
		mr: mr,
	}
}

// Create implements IMessageService.
func (m *MessageService) Create(ctx context.Context, message entity.Message) (*entity.Message, error) {
	mess := entity.Message{
		ID:        uuid.New(),
		School:    message.School,
		Message:   message.Message,
		X:         rand.Intn(5) * 10,
		Y:         rand.Intn(5) * 10,
		FloatTime: float32(rand.Intn(10))*0.2 + 5.0,
	}
	created, err := m.mr.Create(ctx, mess)
	if err != nil {
		return nil, err
	}
	return created, nil
}

// GetAll implements IMessageService.
func (m *MessageService) GetAll(ctx context.Context) ([]entity.Message, error) {
	return m.mr.GetAll(ctx)
}

// GetByID implements IMessageService.
func (m *MessageService) GetByID(ctx context.Context, id string) (*entity.Message, error) {
	return nil, nil
}

// GetByTimeRange implements IMessageService.
func (m *MessageService) GetByTimeRange(ctx context.Context, from time.Time, to time.Time) ([]entity.Message, error) {
	return nil, nil
}

// GiveLike implements IMessageService.
func (m *MessageService) GiveLike(ctx context.Context, id string) error {
	if err := m.mr.GiveLike(ctx, id); err != nil {
		return err
	}
	return nil
}
