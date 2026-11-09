
export default function NoteListItem({
    note,
    active,
    onClick,
    onDelete,
}) {
    const preview = note.rawContent
        .replace(/\s+/g, ' ')
        .trim()

    const formattedDate = new Date(note.createdAt)
        .toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
        })

    return (
        <div
            className={`group w-full rounded-xl p-3 transition ${active
                    ? 'bg-amber-50 border border-amber-200'
                    : 'border border-transparent hover:bg-neutral-100'
                }`}
        >
            <div className="mb-2 flex items-center justify-between gap-2">
                <button
                    onClick={onClick}
                    className="text-xs text-neutral-400 hover:text-neutral-700"
                >
                    {formattedDate}
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400">
                        {preview.length} chars
                    </span>

                    <button
                        onClick={(event) => {
                            event.stopPropagation()
                            onDelete()
                        }}
                        aria-label="Delete note"
                        title="Delete note"
                        className="rounded-md p-1 text-neutral-400 opacity-0 transition hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
                    >
                        ×
                    </button>
                </div>
            </div>

            <button
                onClick={onClick}
                className="w-full text-left"
            >
                <p className="line-clamp-3 text-sm leading-6 text-neutral-700">
                    {preview || 'Empty note'}
                </p>
            </button>
        </div>
    )
}
