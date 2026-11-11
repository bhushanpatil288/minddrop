
import { useState, useCallback } from 'react'
import { aiApi } from '../services/aiApi'

export function useNoteAI() {
    const [generating, setGenerating] = useState(false)
    const [loadingVersions, setLoadingVersions] = useState(false)
    const [versions, setVersions] = useState([])
    const [activeVersion, setActiveVersion] = useState(null)
    const [error, setError] = useState(null)

    async function generateVersion(noteId, rawContent) {
        try {
            setGenerating(true)
            setError(null)

            const version = await aiApi.generateVersion(
                noteId,
                rawContent
            )

            setVersions(previous => [
                version,
                ...previous.filter(item => item.id !== version.id),
            ])

            setActiveVersion(version)

            return version
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setGenerating(false)
        }
    }

    const loadVersions = useCallback(async (noteId) => {
        try {
            setLoadingVersions(true)
            setError(null)

            const result = await aiApi.getVersions(noteId)

            setVersions(result)
            setActiveVersion(result[0] ?? null)

            return result
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoadingVersions(false)
        }
    }, [])

    function selectVersion(version) {
        setActiveVersion(version)
    }

    const clearAIState = useCallback(() => {
        setVersions([])
        setActiveVersion(null)
        setError(null)
    }, [])

    return {
        generating,
        loadingVersions,
        versions,
        activeVersion,
        error,
        generateVersion,
        loadVersions,
        selectVersion,
        clearAIState,
    }
}
