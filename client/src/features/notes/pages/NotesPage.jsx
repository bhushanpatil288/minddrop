import { useState } from 'react'

import { useNotes } from '../hooks/useNotes'

import NoteList from '../components/NoteList'
import NoteEditor from '../components/NoteEditor'

import StatusIndicator from '../../../shared/components/StatusIndicator'

export default function NotesPage() {
    const {
        notes,
        loading,
        saving,
        error,
        createNote,
    } = useNotes()

    const [draft, setDraft] = useState('')
    const [activeNoteId, setActiveNoteId] = useState(null)

    const activeNote = notes.find(
        (note) => note.id === activeNoteId
    )

    const currentContent = activeNote
        ? activeNote.rawContent
        : draft

    function handleNewNote() {
        setActiveNoteId(null)
        setDraft('')
    }

    async function handleSave() {
        if (!draft.trim() || saving) return

        try {
            const note = await createNote(draft)

            setActiveNoteId(note.id)
            setDraft('')
        } catch {
            // The hook maintains the error state.
        }
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
                        onSelect={(note) => setActiveNoteId(note.id)}
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
                value={currentContent}
                onChange={setDraft}
                onSave={handleSave}
                onNewNote={handleNewNote}
                saving={saving}
                selectedNote={activeNote}
                error={error}
            />
        </main>
    )
}