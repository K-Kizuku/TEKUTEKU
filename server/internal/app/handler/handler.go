package handler

type Root struct {
	UserHandler    IUserHandler
	MessageHandler IMessageHandler
	LikeHandler    ILikeHandler
}

func New(UserHandler IUserHandler, MessageHandler IMessageHandler, LikeHandler ILikeHandler) *Root {
	return &Root{
		UserHandler:    UserHandler,
		MessageHandler: MessageHandler,
		LikeHandler:    LikeHandler,
	}
}
