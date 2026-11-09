import * as noteServices from './notes.service.js';

export async function createNote(req, res) {
    const note = await noteServices.createNote(req.body.rawContent);

    res.status(201).json({
        success: true,
        data: note,
    });
};

export async function getAllNotes(req, res) {
    const notes = await noteServices.getAllNotes();

    res.json({
        success: true,
        data: notes,
    });
};

export async function getNoteById(req, res) {
    const note = await noteServices.getNoteById(req.params.id);

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

export async function remove(req, res, next) {
    try {
        const result = await noteServices.deleteNote(req.params.id);

        return res.status(200).json({
            success: true,
            data: result,
        })
    } catch (err) {
        return next(err);
    }
}