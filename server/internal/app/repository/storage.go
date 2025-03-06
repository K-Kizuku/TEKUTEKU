package repository

import (
	"github.com/0-s0g0/TEKUTEKU/server/internal/domain/repository"
)

// type StorageRepository struct {
// 	client *storage.Client
// }

type StorageRepository struct {
}

// func NewStorageRepository(client *storage.Client) repository.IStorageRepository {
// 	return &StorageRepository{
// 		client: client,
// 	}
// }

func NewStorageRepository() repository.IStorageRepository {
	return &StorageRepository{}
}

// func (r *StorageRepository) GenerateSignedURL(ctx context.Context, bucketName, objectName string, expires time.Time) (string, error) {
// 	opts := &storage.SignedURLOptions{
// 		Scheme:  storage.SigningSchemeV4,
// 		Method:  "PUT",
// 		Expires: expires,
// 		Headers: []string{
// 			"Content-Type:image/*",
// 		},
// 		ContentType: "image/*",
// 	}

// 	url, err := r.client.Bucket(bucketName).SignedURL(objectName, opts)
// 	if err != nil {
// 		return "", errors.New(http.StatusInternalServerError, err)
// 	}
// 	return url, nil
// }
