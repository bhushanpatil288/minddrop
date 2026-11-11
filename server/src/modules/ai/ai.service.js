import { env } from '../../config/env.js'

export async function checkOllamaStatus() {
    const response = await fetch(
        `${env.OLLAMA_URL}/api/tags`,
        { signal: AbortSignal.timeout(5000) }
    )

    if (!response.ok) {
        throw new Error('Ollama returned an unsuccessful response')
    }

    const data = await response.json()

    return {
        connected: true,
        model: env.OLLAMA_MODEL,
        modelAvailable: data.models?.some(
            model => model.name === env.OLLAMA_MODEL
        ) ?? false,
    }
}

import { generateWithOllama } from './ai.provider.js'
import { buildNoteOptimizationPrompt } from './ai.prompts.js'
import { parseOptimizedNote } from './ai.validation.js'

export async function optimizeNote(rawContent) {
    const prompt = buildNoteOptimizationPrompt(rawContent)

    const rawResponse = await generateWithOllama(prompt)

    const optimizedNote = parseOptimizedNote(rawResponse)

    return optimizedNote
}


import * as notesRepository from '../notes/notes.repository.js'
import * as noteVersionsRepository from './repositories/noteVersions.repository.js'


const PROMPT_VERSION = '1.0'

export async function generateAndSaveNoteVersion(noteId, rawContent) {
    // 1. Verify that the original note exists.
    const note = notesRepository.findById(noteId)

    if (!note) {
        const error = new Error('Note not found')
        error.statusCode = 404
        throw error
    }

    // 2. Generate the structured result.
    const optimizedNote = await optimizeNote(rawContent)

    // 3. Save the generated version.
    const savedVersion = noteVersionsRepository.create({
        noteId,
        sourceContent: rawContent,
        optimizedNote,
        modelName: env.OLLAMA_MODEL,
        promptVersion: PROMPT_VERSION,
    })

    return savedVersion
}


export async function getNoteVersions(noteId) {
    const note = notesRepository.findById(noteId)

    if (!note) {
        const error = new Error('Note not found')
        error.statusCode = 404
        throw error
    }

    return noteVersionsRepository.findAllByNoteId(noteId)
}
