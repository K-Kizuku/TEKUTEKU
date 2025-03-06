CREATE TABLE IF NOT EXISTS  messages(
    message_id text PRIMARY KEY,
    user_id text NOT NULL,
    message text NOT NULL,
    created_at timestamp NOT NULL
);
