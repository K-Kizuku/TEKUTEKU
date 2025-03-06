package schema

type MessagePOSTRequest struct {
	Message string `json:"message"`
}

type MessagePOSTResponse struct {
}

type MessageGETResponse struct {
	Messages []Message `json:"messages"`
	School   int       `json:"number"`
}

type Message struct {
	ID        string  `json:"id"`
	Message   string  `json:"text"`
	Likes     int     `json:"likes"`
	X         int     `json:"X"`
	Y         int     `json:"Y"`
	FloatTime float32 `json:"float_time"`
	CreatedAt string  `json:"created_at"`
}
