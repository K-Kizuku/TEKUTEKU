package schema

type MessagePOSTRequest struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Message string `json:"message"`
}

type MessagePOSTResponse struct {
}

type MessageGETResponse struct {
	Messages []Message `json:"messages"`
}

type Message struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Message   string `json:"message"`
	Likes     int    `json:"likes"`
	Size      int    `json:"size"`
	FloatTime int    `json:"float_time"`
	CreatedAt string `json:"created_at"`
}
