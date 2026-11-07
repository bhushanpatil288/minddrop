CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    raw_content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notes_created_at
ON notes(created_at DESC);