import * as noteServices from './notes.service.js';

export function createNote(req, res) {
    const note = noteServices.createNote(req.body.rawContent);

    res.status(201).json({
        success: true,
        data: note,
    });
};

export function getAllNotes(req, res) {
    const notes = noteServices.getAllNotes();

    res.json({
        success: true,
        data: notes,
    });
};

export function getNoteById(req, res) {
    const note = noteServices.getNoteById(req.params.id);

    res.json({
        success: true,
        data: note,
    });
};

