package schema

type SignUpRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

type SignUpResponse struct {
	Token     string `json:"token"`
	SignedURL string `json:"signed_url"`
}
