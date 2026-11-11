import { z } from 'zod'

export const optimizedNoteSchema = z.object({
    title: z.string().min(1),
    summary: z.string(),
    keyPoints: z.array(z.string()),
    topics: z.array(z.string()),
    actionItems: z.array(z.string()),
    noteType: z.enum([
        'idea',
        'learning',
        'task',
        'reflection',
        'reference',
        'general',
    ]),
}).strict()

export function parseOptimizedNote(rawResponse) {
    let parsed

    try {
        parsed = JSON.parse(rawResponse)
    } catch {
        const error = new Error('AI returned invalid JSON')
        error.statusCode = 502
        throw error
    }

    const result = optimizedNoteSchema.safeParse(parsed)

    if (!result.success) {
        const error = new Error('AI returned an unexpected response structure')
        error.statusCode = 502
        throw error
    }

    return result.data
}


export const optimizeNoteRequestSchema = z.object({
    rawContent: z.string().trim().min(1).max(100000),
})


export const noteIdParamsSchema = z.object({
    noteId: z.string().uuid(),
})
