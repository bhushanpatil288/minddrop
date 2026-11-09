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

export function update(id, rawContent, updatedAt) {
    const db = getDatabase();
    const statement = db.prepare(`
        UPDATE notes 
        SET raw_content = ?, updated_at = ?
        WHERE id = ?    
    `);

    const result = statement.run(rawContent, updatedAt, id);

    if (result.changes === 0) {
        return null;
    }

    return findById(id);
}

export function deleteNote(id) {
    const db = getDatabase();
    const statement = db.prepare(`
        DELETE FROM notes
        WHERE id = ?
    `);

    const result = statement.run(id);

    return result.changes > 0;
};
