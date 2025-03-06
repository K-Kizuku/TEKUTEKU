package service

import (
	"context"
	"time"

	"github.com/0-s0g0/TEKUTEKU/server/internal/domain/entity"
	"github.com/0-s0g0/TEKUTEKU/server/internal/domain/repository"
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
	panic("unimplemented")
}

// GetAll implements IMessageService.
func (m *MessageService) GetAll(ctx context.Context) ([]entity.Message, error) {
	return m.mr.GetAll(ctx)
}

// GetByID implements IMessageService.
func (m *MessageService) GetByID(ctx context.Context, id string) (*entity.Message, error) {
	panic("unimplemented")
}

// GetByTimeRange implements IMessageService.
func (m *MessageService) GetByTimeRange(ctx context.Context, from time.Time, to time.Time) ([]entity.Message, error) {
	panic("unimplemented")
}

// GiveLike implements IMessageService.
func (m *MessageService) GiveLike(ctx context.Context, id string) error {
	if err := m.mr.GiveLike(ctx, id); err != nil {
		return err
	}
	return nil
}
