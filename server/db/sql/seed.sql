INSERT INTO messages (message_id, user_id, message, created_at) VALUES
  ('msg1', 'user1', 'Hello, world!', '2023-03-01 10:00:00'),
  ('msg2', 'user2', 'Hi there!', '2023-03-01 11:00:00'),
  ('msg3', 'user1', 'This is a sample message.', '2023-03-02 09:30:00');RETURNING *;


