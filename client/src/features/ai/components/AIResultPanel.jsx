
export default function AIResultPanel({
    version,
    versions,
    generating,
    loadingVersions,
    error,
    onSelectVersion,
}) {
    if (generating) {
        return (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
                    <div>
                        <p className="text-sm font-semibold text-neutral-800">
                            Organizing your thoughts...
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                            Qwen is analyzing your note.
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm font-medium text-red-700">
                    AI processing failed
                </p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
            </section>
        )
    }

    if (!version) {
        return (
            <section className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center">
                <p className="text-sm font-medium text-neutral-700">
                    No AI-generated version yet
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                    Optimize a saved note to see its structured version here.
                </p>
            </section>
        )
    }

    if (loadingVersions) {
        return (
            <section className="rounded-2xl border border-neutral-200 bg-white p-5">
                <p className="text-sm text-neutral-500">
                    Loading previous AI versions...
                </p>
            </section>
        )
    }

    return (
        <section className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-5">

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                        AI optimized note
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                        Generated using {version.modelName}
                    </p>
                </div>

                {versions.length > 0 && (
                    <select
                        value={version.id}
                        onChange={(event) => {
                            const selected = versions.find(
                                item => item.id === event.target.value
                            )

                            if (selected) onSelectVersion(selected)
                        }}
                        className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs outline-none"
                    >
                        {versions.map(item => (
                            <option key={item.id} value={item.id}>
                                Version {item.versionNumber}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                    {version.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-neutral-600">
                    {version.summary}
                </p>
            </div>

            {version.keyPoints.length > 0 && (
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Key points
                    </h3>

                    <ul className="mt-3 space-y-2">
                        {version.keyPoints.map((point, index) => (
                            <li
                                key={index}
                                className="flex gap-3 text-sm leading-6 text-neutral-700"
                            >
                                <span className="text-amber-600">•</span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {version.topics.length > 0 && (
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Topics
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {version.topics.map(topic => (
                            <span
                                key={topic}
                                className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-800"
                            >
                                {topic}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {version.actionItems.length > 0 && (
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Action items
                    </h3>

                    <ul className="mt-3 space-y-2">
                        {version.actionItems.map((item, index) => (
                            <li
                                key={index}
                                className="flex gap-2 text-sm text-neutral-700"
                            >
                                <span className="text-amber-600">→</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="border-t border-neutral-100 pt-3">
                <div className="flex flex-wrap justify-between gap-2 text-xs text-neutral-400">
                    <span>
                        Type: {version.noteType}
                    </span>
                    <span>
                        Prompt: {version.promptVersion}
                    </span>
                </div>
            </div>
        </section>
    )
}
