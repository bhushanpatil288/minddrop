import { useState } from 'react'

import { useNotes } from '../hooks/useNotes'

import NoteList from '../components/NoteList'
import NoteEditor from '../components/NoteEditor'

import StatusIndicator from '../../../shared/components/StatusIndicator'

import { useDraftPersistence } from '../hooks/useDraftPersistence';

export default function NotesPage() {
    const {
        notes,
        loading,
        saving,
        error,
        createNote,
        updateNote,
        deleteNote
    } = useNotes()

    const { draftState, setDraftState } = useDraftPersistence();
    const { content: draft, activeNoteId, hydrated } = draftState;

    const handleDraftChanges = (content) => {
        setDraftState((prev) => ({
            ...prev,
            content,
            isDirty: true,
        }))
    }

    const activeNote = notes.find(
        (note) => note.id === activeNoteId
    )

    function handleNewNote() {
        setDraftState({
            content: '',
            activeNoteId: null,
            hydrated: true,
            isDirty: false,
        })
    }

    const handleSelectNote = (note) => {
        if (draftState.isDirty) {
            const confirmed = window.confirm(
                'You have unsaved changes. Discard them and open another note?'
            )

            if (!confirmed) return;
        }
        setDraftState({
            content: note.rawContent,
            activeNoteId: note.id,
            hydrated: true,
            isDirty: false,
        })
    }

    async function handleSave() {
        const content = draft.trim();

        if (!content || saving) return;

        try {
            if (activeNoteId) {
                await updateNote(activeNoteId, content);
            } else {
                const note = await createNote(content);
                setDraftState(prev => ({
                    ...prev,
                    activeNoteId: note.id,
                }))
            }

            setDraftState(prev => ({
                ...prev,
                isDirty: false
            }))
        } catch (err) {
            console.error('Failed to save note: ', err);
        }
    }

    async function handleDeleteNote(noteId) {
        const confirmed = window.confirm(
            'Are you sure you want to delete this note?'
        )

        if (!confirmed) return;

        try {
            await deleteNote(noteId);

            // If the deleted note was open,
            // return to the new note screen

            if (activeNoteId === noteId) {
                setDraftState({
                    content: '',
                    activeNoteId: null,
                    hydrated: true,
                    isDirty: false,
                })
            }
        } catch (err) {
            console.error('Failed to delete note: ', err);
        }
    }

    if (!hydrated) {
        return <div className="p-8">Restoring your workspace...</div>
    }

    return (
        <main className="flex h-screen overflow-hidden bg-[#f8f7f4]">
            <aside className="flex w-full max-w-[300px] shrink-0 flex-col border-r border-neutral-200 bg-white max-sm:hidden">
                <div className="border-b border-neutral-200 px-5 py-6">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        MindDrop<span className="text-amber-600">.</span>
                    </h1>

                    <p className="mt-1 text-xs text-neutral-400">
                        Your personal thinking space
                    </p>
                </div>

                <div className="border-b border-neutral-200 p-3">
                    <button
                        onClick={handleNewNote}
                        className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
                    >
                        + Capture a thought
                    </button>
                </div>

                <div className="flex-1 overflow-hidden">
                    <NoteList
                        notes={notes}
                        loading={loading}
                        activeNoteId={activeNoteId}
                        onSelect={handleSelectNote}
                        onDelete={handleDeleteNote}
                    // handleSelect={handleSelectNote}
                    />
                </div>

                <div className="border-t border-neutral-200 p-4">
                    <StatusIndicator
                        label="Stored locally"
                        status="ready"
                    />
                </div>
            </aside>

            <NoteEditor
                value={draft}
                onChange={handleDraftChanges}
                onSave={handleSave}
                onNewNote={handleNewNote}
                onDelete={handleDeleteNote}
                saving={saving}
                selectedNote={activeNote}
                error={error}
            />
        </main>
    )
}