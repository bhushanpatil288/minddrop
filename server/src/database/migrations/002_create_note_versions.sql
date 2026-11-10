CREATE TABLE IF NOT EXISTS note_versions (
    id TEXT PRIMARY KEY,

    note_id TEXT NOT NULL,

    version_number INTEGER NOT NULL,

    source_content TEXT NOT NULL,

    title TEXT NOT NULL,
    summary TEXT NOT NULL,

    key_points TEXT NOT NULL DEFAULT '[]',
    topics TEXT NOT NULL DEFAULT '[]',
    action_items TEXT NOT NULL DEFAULT '[]',

    note_type TEXT NOT NULL,

    model_name TEXT NOT NULL,
    prompt_version TEXT NOT NULL,

    created_at TEXT NOT NULL,

    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    UNIQUE (note_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_note_versions_note_id
ON note_versions(note_id, version_number DESC);