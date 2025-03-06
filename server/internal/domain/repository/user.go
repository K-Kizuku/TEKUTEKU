package repository

import (
	"context"

	"github.com/0-s0g0/TEKUTEKU/server/internal/domain/entity"
)

type IUserRepository interface {
	FindUserByID(ctx context.Context, id string) (*entity.User, error)
	FindUserByEmail(ctx context.Context, email string) (*entity.User, error)
	Create(ctx context.Context, user entity.User) (*entity.User, error)
	UpdatePassword(ctx context.Context, id, password string) error
}
