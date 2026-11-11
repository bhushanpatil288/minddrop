import { checkOllamaStatus } from './ai.service.js';

export async function getAIHealth(req, res) {
    const status = await checkOllamaStatus();

    res.json({
        success: true,
        data: status,
    });
};


import {
    optimizeNote,
    generateAndSaveNoteVersion,
    getNoteVersions,
} from './ai.service.js'

export async function optimize(req, res, next) {
    try {
        const result = await optimizeNote(req.body.rawContent)

        return res.status(200).json({
            success: true,
            data: result,
        })
    } catch (error) {
        return next(error)
    }
}

export async function generateVersion(req, res, next) {
    try {
        const version = await generateAndSaveNoteVersion(
            req.params.noteId,
            req.body.rawContent
        )

        return res.status(201).json({
            success: true,
            data: version,
        })
    } catch (error) {
        return next(error)
    }
}

export async function getVersions(req, res, next) {
    try {
        const versions = await getNoteVersions(req.params.noteId)

        return res.status(200).json({
            success: true,
            data: versions,
        })
    } catch (error) {
        return next(error)
    }
}
