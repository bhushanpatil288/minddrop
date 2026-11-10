import { Router } from 'express';
import { getAIHealth, optimize } from './ai.controller.js';
import { validateRequest } from "../../middlewares/validateRequest.js";
import { optimizeNoteRequestSchema } from './ai.validation.js';

const router = Router();

router.get('/health', getAIHealth);

router.post(
    '/optimize',
    validateRequest(optimizeNoteRequestSchema),
    optimize
)

export default router;