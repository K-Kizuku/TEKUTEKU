package handler

import (
	"encoding/json"
	"net/http"

	"github.com/0-s0g0/TEKUTEKU/server/internal/app/handler/schema"
	"github.com/0-s0g0/TEKUTEKU/server/internal/app/service"
	"github.com/0-s0g0/TEKUTEKU/server/internal/domain/entity"
	"github.com/0-s0g0/TEKUTEKU/server/pkg/errors"
)

type IUserHandler interface {
	SignUp() func(http.ResponseWriter, *http.Request) error
	SignIn() func(http.ResponseWriter, *http.Request) error
}

type UserHandler struct {
	us service.IUserService
}

func NewUserHandler(us service.IUserService) IUserHandler {
	return &UserHandler{us: us}
}

func (h *UserHandler) SignUp() func(http.ResponseWriter, *http.Request) error {
	return func(w http.ResponseWriter, r *http.Request) error {
		var req schema.SignUpRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			return err
		}
		u := entity.User{
			Name:     req.Name,
			Password: req.Password,
			Email:    req.Email,
		}
		createdUser, err := h.us.Create(r.Context(), u)
		if err != nil {
			return err
		}
		token, err := h.us.GenerateJWT(r.Context(), createdUser.ID)
		if err != nil {
			return err
		}
		// url, err := h.us.GenerateSignedURL(r.Context(), createdUser.ID)
		// if err != nil {
		// 	return err
		// }
		res := schema.SignUpResponse{
			Token:     token,
			SignedURL: "",
		}
		if err := json.NewEncoder(w).Encode(res); err != nil {
			return err
		}
		w.WriteHeader(http.StatusCreated)
		return nil
	}
}

func (h *UserHandler) SignIn() func(http.ResponseWriter, *http.Request) error {
	return func(w http.ResponseWriter, r *http.Request) error {
		var req schema.SignInRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			return errors.New(http.StatusBadRequest, err)
		}
		id, err := h.us.VerifyPassword(r.Context(), req.Email, req.Password)
		if err != nil {
			return err
		}
		token, err := h.us.GenerateJWT(r.Context(), id)
		if err != nil {
			return err
		}

		res := schema.SignInResponse{
			Token: token,
		}
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(res); err != nil {
			return errors.New(http.StatusInternalServerError, err)
		}
		w.WriteHeader(http.StatusOK)
		return nil
	}
}
