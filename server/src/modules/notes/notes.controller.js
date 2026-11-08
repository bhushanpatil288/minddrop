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

export async function update(req, res, next) {
    try {
        const note = await noteServices.updateNote(
            req.params.id,
            req.body.rawContent
        );

        res.status(200).json({
            success: true,
            data: note,
        })
    } catch (error) {
        next(error);
    }
}