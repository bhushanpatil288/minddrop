export default function NoteEditor({
    value,
    onChange,
    onSave,
    onNewNote,
    onDelete,
    saving,
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
                <div>
                    <span className="text-sm font-medium text-neutral-700">
                        {isSavedNote ? 'Saved note' : 'Quick capture'}
                    </span>
                </div>

                <button
                    onClick={onNewNote}
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 transition hover:bg-neutral-100"
                >
                    + New note
                </button>
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
                    onChange={(event) => {
                        onChange(event.target.value)
                        console.log(event.target.value)
                    }}
                    placeholder="Start typing anything... an idea, something you learned, a random thought, a task, or an observation."
                    spellCheck
                    className="min-h-[300px] flex-1 resize-none bg-transparent text-base leading-8 text-neutral-700 outline-none placeholder:text-neutral-300"
                />

                <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-5">
                    <span className="text-xs text-neutral-400">
                        {wordCount} words · {value.length} characters
                    </span>
                    <button
                        onClick={onSave}
                        disabled={!value.trim() || saving}
                        className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {saving ? 'Saving...' : 'Save note'}
                    </button>
                </footer>

                {error && (
                    <p className="mt-4 text-sm text-red-600" role="alert">
                        {error}
                    </p>
                )}
            </div>
        </section>
    )
}