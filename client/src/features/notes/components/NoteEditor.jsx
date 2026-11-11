
export default function NoteEditor({
    value,
    onChange,
    onSave,
    onNewNote,
    onDelete,
    onOptimize,
    saving,
    optimizing,
    selectedNote,
    error,
}) {
    const isSavedNote = Boolean(selectedNote)

    const wordCount = value.trim()
        ? value.trim().split(/\s+/).length
        : 0

    return (
        <section className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-16 items-center justify-between border-b border-neutral-200 px-6">
                <span className="text-sm font-medium text-neutral-700">
                    {isSavedNote ? 'Saved note' : 'Quick capture'}
                </span>

                <div className="flex items-center gap-2">
                    {isSavedNote && (
                        <button
                            onClick={() => onDelete(selectedNote.id)}
                            className="rounded-lg px-3 py-2 text-sm text-red-500 transition hover:bg-red-50"
                        >
                            Delete
                        </button>
                    )}

                    <button
                        onClick={onNewNote}
                        className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 transition hover:bg-neutral-100"
                    >
                        + New note
                    </button>
                </div>
            </header>

            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10 sm:px-10">
                <div className="mb-8">
                    <p className="mb-3 text-xs font-medium uppercase tracking-widest text-amber-600">
                        {isSavedNote ? 'Your thoughts' : 'Capture without limits'}
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-neutral-800">
                        {isSavedNote ? 'Your saved thoughts.' : 'What’s on your mind?'}
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-neutral-400">
                        {isSavedNote
                            ? 'This is your original, unmodified note.'
                            : "Don't organize. Don't edit. Just write."}
                    </p>
                </div>

                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Start typing anything... an idea, something you learned, a random thought, a task, or an observation."
                    spellCheck
                    className="min-h-[300px] flex-1 resize-none bg-transparent text-base leading-8 text-neutral-700 outline-none placeholder:text-neutral-300"
                />

                <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-5">
                    <span className="text-xs text-neutral-400">
                        {wordCount} words · {value.length} characters
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={onOptimize}
                            disabled={!isSavedNote || !value.trim() || optimizing}
                            title={
                                !isSavedNote
                                    ? 'Save this note before optimizing'
                                    : 'Generate an AI-organized version'
                            }
                            className="rounded-xl border border-amber-300 px-4 py-3 text-sm font-medium text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {optimizing ? 'Optimizing...' : '✦ Optimize'}
                        </button>

                        <button
                            onClick={onSave}
                            disabled={!value.trim() || saving}
                            className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {saving ? 'Saving...' : 'Save note'}
                        </button>
                    </div>
                </footer>

                {!isSavedNote && (
                    <p className="mt-3 text-right text-xs text-neutral-400">
                        Save your note before generating an AI version.
                    </p>
                )}

                {error && (
                    <p className="mt-4 text-sm text-red-600" role="alert">
                        {error}
                    </p>
                )}
            </div>
        </section>
    )
}
