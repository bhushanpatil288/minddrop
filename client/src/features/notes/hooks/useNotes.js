import { useCallback, useEffect, useState } from 'react'
import { notesApi } from '../services/notesApi'

export function useNotes() {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    const fetchNotes = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await notesApi.getAll()
            setNotes(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchNotes()
    }, [fetchNotes])

    const createNote = async (rawContent) => {
        try {
            setSaving(true)
            setError(null)

            const note = await notesApi.create(rawContent)

            setNotes((previousNotes) => [
                note,
                ...previousNotes,
            ])

            return note
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setSaving(false)
        }
    }

    const updateNote = async (id, rawContent) => {
        try {
            setSaving(true);
            setError(null);

            const updatedNote = await notesApi.update(id, rawContent);

            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === id ? updatedNote : note
                )
            );

            return updatedNote;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setSaving(false)
        }
    }

    return {
        notes,
        loading,
        saving,
        error,
        createNote,
        updateNote,
        refreshNotes: fetchNotes,
    }
}