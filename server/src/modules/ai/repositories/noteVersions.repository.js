
import { randomUUID } from 'crypto'
import { getDatabase } from '../../../database/connection.js'

function mapVersion(row) {
    if (!row) return null

    return {
        id: row.id,
        noteId: row.note_id,
        versionNumber: row.version_number,
        sourceContent: row.source_content,
        title: row.title,
        summary: row.summary,
        keyPoints: JSON.parse(row.key_points),
        topics: JSON.parse(row.topics),
        actionItems: JSON.parse(row.action_items),
        noteType: row.note_type,
        modelName: row.model_name,
        promptVersion: row.prompt_version,
        createdAt: row.created_at,
    }
}

export function create({
    noteId,
    sourceContent,
    optimizedNote,
    modelName,
    promptVersion,
}) {
    const db = getDatabase()

    const saveVersion = db.transaction(() => {
        const latestVersion = db.prepare(`
            SELECT MAX(version_number) AS latestVersion
            FROM note_versions
            WHERE note_id = ?
        `).get(noteId)

        const versionNumber = (latestVersion.latestVersion ?? 0) + 1

        const id = randomUUID()
        const createdAt = new Date().toISOString()

        db.prepare(`
            INSERT INTO note_versions (
                id,
                note_id,
                version_number,
                source_content,
                title,
                summary,
                key_points,
                topics,
                action_items,
                note_type,
                model_name,
                prompt_version,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            id,
            noteId,
            versionNumber,
            sourceContent,
            optimizedNote.title,
            optimizedNote.summary,
            JSON.stringify(optimizedNote.keyPoints),
            JSON.stringify(optimizedNote.topics),
            JSON.stringify(optimizedNote.actionItems),
            optimizedNote.noteType,
            modelName,
            promptVersion,
            createdAt
        )

        return findById(id)
    })

    return saveVersion()
}

export function findById(id) {
    const db = getDatabase()

    const row = db.prepare(`
        SELECT *
        FROM note_versions
        WHERE id = ?
    `).get(id)

    return mapVersion(row)
}

export function findAllByNoteId(noteId) {
    const db = getDatabase()

    const rows = db.prepare(`
        SELECT *
        FROM note_versions
        WHERE note_id = ?
        ORDER BY version_number DESC
    `).all(noteId)

    return rows.map(mapVersion)
}
