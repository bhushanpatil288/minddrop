import { randomUUID } from 'crypto';
import * as notesRepository from './notes.repository.js';

export function createNote(rawContent) {
    const now = new Date().toISOString();

    const noteData = {
        id: randomUUID(),
        rawContent,
        createdAt: now,
        updatedAt: now,
    }

    return notesRepository.create(noteData);
};

export function getAllNotes() {
    return notesRepository.findAll();
};

export function getNoteById(id) {
    const note = notesRepository.findById(id);

    if (!note) {
        const error = new Error('Note not found');
        error.statusCode = 404
        throw error;
    }

    return note;
};

export async function updateNote(id, rawContent) {
    const existingNote = notesRepository.findById(id);

    if (!existingNote) {
        const error = new Error('Note not found');
        error.statusCode = 404;
        throw error;
    }

    const updatedAt = new Date().toISOString();

    return notesRepository.update(id, rawContent, updatedAt);
}