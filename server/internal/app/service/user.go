package service

import (
	"context"
	nomal_errors "errors"
	"net/http"

	"github.com/0-s0g0/TEKUTEKU/server/internal/domain/entity"
	"github.com/0-s0g0/TEKUTEKU/server/internal/domain/repository"
	"github.com/0-s0g0/TEKUTEKU/server/pkg/errors"
	"github.com/0-s0g0/TEKUTEKU/server/pkg/hash"
	"github.com/0-s0g0/TEKUTEKU/server/pkg/jwt"
	"github.com/0-s0g0/TEKUTEKU/server/pkg/middleware"
	"github.com/0-s0g0/TEKUTEKU/server/pkg/uuid"
)

type IUserService interface {
	FindUserByID(ctx context.Context, id string) (*entity.User, error)
	Create(ctx context.Context, user entity.User) (*entity.User, error)
	UpdatePassword(ctx context.Context, id, password string) error
	CheckID(ctx context.Context, id string) error
	VerifyPassword(ctx context.Context, email, password string) (string, error)
	GenerateJWT(ctx context.Context, id string) (string, error)
	// GenerateSignedURL(ctx context.Context, id string) (string, error)
}

type UserService struct {
	ur repository.IUserRepository
	sr repository.IStorageRepository
}

func NewUserService(ur repository.IUserRepository, sr repository.IStorageRepository) IUserService {
	return &UserService{
		ur: ur,
		sr: sr,
	}
}

func (s *UserService) FindUserByID(ctx context.Context, id string) (*entity.User, error) {
	return s.ur.FindUserByID(ctx, id)
}

func (s *UserService) Create(ctx context.Context, user entity.User) (*entity.User, error) {
	u := entity.User{
		ID:       uuid.New(),
		Name:     user.Name,
		Password: hash.EncryptPassword(user.Password),
		Email:    user.Email,
	}
	createdUser, err := s.ur.Create(ctx, u)
	if err != nil {
		return nil, err
	}
	return createdUser, nil
}

func (s *UserService) UpdatePassword(ctx context.Context, id, password string) error {
	return s.ur.UpdatePassword(ctx, id, password)
}

func (s *UserService) CheckID(ctx context.Context, id string) error {
	tokenID := ctx.Value(middleware.UserIDKey).(string)
	if id != tokenID {
		return errors.New(http.StatusForbidden, nomal_errors.New("token id and request id are different"))
	}
	return nil
}

func (s *UserService) VerifyPassword(ctx context.Context, email, password string) (string, error) {
	user, err := s.ur.FindUserByEmail(ctx, email)
	if err != nil {
		return "", err
	}
	if err := hash.CompareHashPassword(user.Password, password); err != nil {
		return "", errors.New(http.StatusUnauthorized, nomal_errors.New("password is incorrect"))
	}
	return user.ID, nil
}

func (s *UserService) GenerateJWT(ctx context.Context, id string) (string, error) {
	jwt, err := jwt.GenerateToken(id)
	if err != nil {
		return "", errors.New(http.StatusInternalServerError, err)
	}
	return jwt, nil
}

// func (s *UserService) GenerateSignedURL(ctx context.Context, id string) (string, error) {
// 	expirationTime := time.Now().Add(time.Minute * 30)
// 	url, err := s.sr.GenerateSignedURL(ctx, env.Basket, fmt.Sprintf("%s-%d.png", id, time.Now().Unix()), expirationTime)
// 	if err != nil {
// 		return "", err
// 	}
// 	return url, nil
// }
