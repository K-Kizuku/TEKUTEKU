package repository

import (
	"context"
	"time"

	"github.com/0-s0g0/TEKUTEKU/server/internal/domain/entity"
)

type IMessageRepository interface {
	GetAll(ctx context.Context) ([]entity.Message, error)
	GetByID(ctx context.Context, id string) (*entity.Message, error)
	GetByTimeRange(ctx context.Context, from, to time.Time) ([]entity.Message, error)
	Create(ctx context.Context, message entity.Message) (*entity.Message, error)
	GiveLike(ctx context.Context, id string) error
}
