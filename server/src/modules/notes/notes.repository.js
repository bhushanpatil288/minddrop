import { getDatabase } from '../../database/connection.js';

export function create(data) {
    const db = getDatabase();

    const statement = db.prepare(`
        INSERT INTO notes (
            id,
            raw_content,
            created_at,
            updated_at
        )
        VALUES (
            @id,
            @rawContent,
            @createdAt,
            @updatedAt
        )
    `)
    statement.run(data);

    return findById(data.id);
};

export function findById(id) {
    const db = getDatabase();

    return db.prepare(`
        SELECT
            id,
            raw_content AS rawContent,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM notes
        WHERE id = ?    
    `).get(id);
}

export function findAll() {
    const db = getDatabase();

    return db.prepare(`
        SELECT
            id,
            raw_content AS rawContent,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM notes
        ORDER BY created_at DESC
    `).all();
};
