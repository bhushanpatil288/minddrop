import { Router } from 'express';
import { getAIHealth, optimize, generateVersion, getVersions } from './ai.controller.js';
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
    noteIdParamsSchema,
    optimizeNoteRequestSchema
} from './ai.validation.js';

const router = Router();

router.get('/health', getAIHealth);

router.post(
    '/optimize',
    validateRequest(optimizeNoteRequestSchema),
    optimize
)

router.post(
    '/notes/:noteId/versions',
    validateRequest(noteIdParamsSchema, 'params'),
    validateRequest(optimizeNoteRequestSchema),
    generateVersion
)

router.get(
    '/notes/:noteId/versions',
    validateRequest(noteIdParamsSchema, 'params'),
    getVersions
)

export default router;