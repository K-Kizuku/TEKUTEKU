CREATE TABLE IF NOT EXISTS  messages(
    message_id text PRIMARY KEY,
    user_id text NOT NULL,
    likes int NOT NULL default 0,
    x         int NOT NULL,
    y         int NOT NULL,
    message text NOT NULL,
    created_at timestamp NOT NULL,
    float_time real NOT NULL
);
