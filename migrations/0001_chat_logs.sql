-- One row per question/answer turn. No IP stored; country only.
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  question TEXT NOT NULL,
  answer TEXT,
  error TEXT,
  country TEXT
);
CREATE INDEX idx_messages_session ON messages (session_id, id);
