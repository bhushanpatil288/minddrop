
import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(currentDir, '../../data')
const migrationsDir = path.join(currentDir, 'migrations')

let db

export function initializeDatabase() {
    if (db) return db

    fs.mkdirSync(dataDir, { recursive: true })

    const databasePath = path.join(dataDir, 'minddrop.db')

    db = new Database(databasePath)

    try {
        db.pragma('journal_mode = WAL')
        db.pragma('foreign_keys = ON')
        db.pragma('busy_timeout = 5000')

        runMigrations()

        console.log('SQLite database initialized')

        return db
    } catch (error) {
        db.close()
        db = undefined
        throw error
    }
}

function runMigrations() {
    // Keep track of migrations already executed.
    db.exec(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            migration_name TEXT NOT NULL UNIQUE,
            applied_at TEXT NOT NULL
        )
    `)

    // Discover all SQL migration files.
    const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort()

    for (const file of migrationFiles) {
        const alreadyApplied = db.prepare(`
            SELECT 1
            FROM schema_migrations
            WHERE migration_name = ?
        `).get(file)

        if (alreadyApplied) {
            continue
        }

        const migrationPath = path.join(migrationsDir, file)
        const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

        // Execute the migration and record it atomically.
        const applyMigration = db.transaction(() => {
            db.exec(migrationSQL)

            db.prepare(`
                INSERT INTO schema_migrations (
                    migration_name,
                    applied_at
                )
                VALUES (?, ?)
            `).run(file, new Date().toISOString())
        })

        applyMigration()

        console.log(`Migration applied: ${file}`)
    }
}

export function getDatabase() {
    if (!db) {
        throw new Error('Database has not been initialized')
    }

    return db
}

export function closeDatabase() {
    if (db) {
        db.close()
        db = undefined
    }
}
