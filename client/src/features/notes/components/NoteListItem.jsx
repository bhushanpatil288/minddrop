export default function NoteListItem({
    note,
    active,
    onClick,
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
        <button
            onClick={onClick}
            className={`w-full rounded-xl p-3 text-left transition ${active
                ? 'bg-amber-50 border border-amber-200'
                : 'border border-transparent hover:bg-neutral-100'
                }`}
        >
            <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs text-neutral-400">
                    {formattedDate}
                </span>

                <span className="text-xs text-neutral-400">
                    {preview.length} chars
                </span>
            </div>

            <p className="line-clamp-3 text-sm leading-6 text-neutral-700">
                {preview || 'Empty note'}
            </p>
        </button>
    )
}