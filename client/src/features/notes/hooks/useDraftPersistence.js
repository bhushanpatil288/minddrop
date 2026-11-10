
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'minddrop:active-draft'

export function useDraftPersistence() {
    const [draftState, setDraftState] = useState({
        content: '',
        activeNoteId: null,
        hydrated: false,
        isDirty: false,
    })

    // Restore the previous draft when the app starts.
    useEffect(() => {
        try {
            const storedDraft = localStorage.getItem(STORAGE_KEY)

            if (storedDraft) {
                const parsedDraft = JSON.parse(storedDraft)

                setDraftState({
                    content: parsedDraft.content ?? '',
                    activeNoteId: parsedDraft.activeNoteId ?? null,
                    hydrated: true,
                })
            } else {
                setDraftState((previous) => ({
                    ...previous,
                    hydrated: true,
                }))
            }
        } catch (error) {
            console.error('Failed to restore draft:', error)

            setDraftState({
                content: '',
                activeNoteId: null,
                hydrated: true,
            })
        }
    }, [])

    // Persist changes after the initial restoration.
    useEffect(() => {
        if (!draftState.hydrated) return

        if (!draftState.isDirty) {
            localStorage.removeItem(STORAGE_KEY);
            return;
        }

        const payload = {
            content: draftState.content,
            activeNoteId: draftState.activeNoteId,
            savedAt: new Date().toISOString(),
        }

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(payload)
            )
        } catch (error) {
            console.error('Failed to persist draft:', error)
        }
    }, [
        draftState.content,
        draftState.activeNoteId,
        draftState.hydrated,
    ])

    return {
        draftState,
        setDraftState,
    }
}
