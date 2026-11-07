import { z } from 'zod';

export const createNoteSchema = z.object({
    rawContent: z.string()
        .trim()
        .min(1, 'Note cannot be empty')
        .max(100000, 'Note is too large'),
})