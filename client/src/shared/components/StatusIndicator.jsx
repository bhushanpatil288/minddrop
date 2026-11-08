export default function StatusIndicator({ label, status }) {
    const isReady = status === 'ready'

    return (
        <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span
                className={`h-2 w-2 rounded-full ${isReady ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
            />

            <span>{label}</span>
        </div>
    )
}