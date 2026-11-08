import { Router } from 'express';

import * as notesController from './notes.controller.js';
import { createNoteSchema } from './notes.validation.js';
import { validateRequest } from '../../middlewares/validateRequest.js';

const router = Router();

router.post('/', validateRequest(createNoteSchema), notesController.createNote);

router.get('/', notesController.getAllNotes);

router.get('/:id', notesController.getNoteById);

router.put('/:id', validateRequest(createNoteSchema), notesController.update);

export default router;