import { env } from "../../config/env.js";

const GENERATION_TIMEOUT = 120_000

export async function generateWithOllama(prompt) {
    let res;

    try {
        res = await fetch(`${env.OLLAMA_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: env.OLLAMA_MODEL,
                prompt,
                stream: false,
                format: 'json',
                options: {
                    temperature: 0.2,
                },
            }),
            signal: AbortSignal.timeout(GENERATION_TIMEOUT),
        });
    } catch (err) {
        if (err.name === 'TimeoutError') {
            throw new Error('AI generation timed out');
        }

        throw new Error('Could not connect to Ollama');
    }

    if (!res.ok) {
        throw new Error(`Ollama returned HTTP ${res.status}`);
    };

    const result = await res.json();
    console.log('Ollama raw response:', result)

    if (!result.response) {
        throw new Error('Ollama returned empty response');
    }

    return result.response;
}