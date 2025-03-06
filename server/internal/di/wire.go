//go:build wireinject
// +build wireinject

package di

import (
	"github.com/0-s0g0/TEKUTEKU/server/db"
	"github.com/0-s0g0/TEKUTEKU/server/internal/app/handler"
	"github.com/0-s0g0/TEKUTEKU/server/internal/app/repository"
	"github.com/0-s0g0/TEKUTEKU/server/internal/app/service"
	"github.com/google/wire"
)

func InitHandler() *handler.Root {
	wire.Build(
		db.New,
		repository.NewMessageRepository,
		repository.NewUserRepository,
		repository.NewStorageRepository,
		service.NewMessageService,
		service.NewUserService,
		handler.NewMessageHandler,
		handler.NewUserHandler,
		handler.NewLikeHandler,
		handler.New,
	)
	return &handler.Root{}
}
