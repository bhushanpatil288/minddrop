import NoteListItem from './NoteListItem'

export default function NoteList({
    notes,
    activeNoteId,
    onSelect,
    loading,
}) {
    return (
        <section className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    Your notes
                </h2>

                <span className="text-xs text-neutral-400">
                    {notes.length}
                </span>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-4">
                {loading && (
                    <p className="p-4 text-sm text-neutral-400">
                        Loading notes...
                    </p>
                )}

                {!loading && notes.length === 0 && (
                    <p className="p-4 text-sm leading-6 text-neutral-400">
                        Your library is empty. Start capturing your thoughts.
                    </p>
                )}

                {!loading && notes.map((note) => (
                    <NoteListItem
                        key={note.id}
                        note={note}
                        active={note.id === activeNoteId}
                        onClick={() => onSelect(note)}
                    />
                ))}
            </div>
        </section>
    )
}