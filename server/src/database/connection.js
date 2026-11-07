import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const dataDir = path.resolve(currentDir, '../../data');

let db;

export function initializeDatabase() {
    if (db) return db;

    fs.mkdirSync(dataDir, { recursive: true });

    const databasePath = path.join(dataDir, 'minddrop.db');

    db = new Database(databasePath);

    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('busy_timeout = 5000');

    runMigrations();

    console.log('SQLite database initialized');

    return db;
};

function runMigrations() {
    const migrationPath = path.join(
        currentDir,
        'migrations',
        '001_create_notes.sql'
    )

    const migration = fs.readFileSync(migrationPath, 'utf-8');

    db.exec(migration);
}

export function getDatabase() {
    if (!db) {
        throw new Error('Database has not been initialized');
    }

    return db;
}

export function closeDatabase() {
    if (db) {
        db.close();
        db = undefined;
    }
}