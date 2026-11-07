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