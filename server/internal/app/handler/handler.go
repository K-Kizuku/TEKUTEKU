package handler

type Root struct {
	UserHandler    IUserHandler
	MessageHandler IMessageHandler
}

func New(UserHandler IUserHandler, MessageHandler IMessageHandler) *Root {
	return &Root{
		UserHandler:    UserHandler,
		MessageHandler: MessageHandler,
	}
}
