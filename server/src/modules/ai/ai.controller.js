import { checkOllamaStatus } from './ai.service.js';

export async function getAIHealth(req, res) {
    const status = await checkOllamaStatus();

    res.json({
        success: true,
        data: status,
    });
};


import { optimizeNote } from './ai.service.js'

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
