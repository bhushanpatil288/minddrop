import { checkOllamaStatus } from './ai.service.js';

export async function getAIHealth(req, res) {
    const status = await checkOllamaStatus();

    res.json({
        success: true,
        data: status,
    });
};