import { useEffect, useState } from "react"

const App = () => {
  const [backend, setBackend] = useState('Checking...')
  const [ai, setAi] = useState('Checking...')

  useEffect(() => {
    async function checkServices() {
      try {
        const response = await fetch('http://localhost:8080/api/health')
        const data = await response.json()
        setBackend(data.success ? 'Connected' : 'Unavailable')
      } catch {
        setBackend('Disconnected')
      }

      try {
        const response = await fetch('http://localhost:8080/api/ai/health')
        const data = await response.json()
        setAi(
          data.success && data.modelAvailable
            ? `${data.model} ready`
            : data.success
              ? 'Model not installed'
              : 'Disconnected'
        )
      } catch {
        setAi('Disconnected')
      }
    }
    checkServices();
  }, [])

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#252525] flex items-center justify-center p-6">
      <section className="w-full max-w-xl">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tight">
            MindDrop<span className="text-amber-600">.</span>
          </h1>
          <p className="mt-2 text-neutral-500">
            Your thoughts, organized intelligently.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-5">
            System status
          </h2>

          <div className="space-y-4">
            <Status label="Express backend" value={backend} />
            <Status label="Ollama AI" value={ai} />
          </div>
        </div>

        <p className="mt-6 text-sm text-neutral-400">
          Local-first. Private. Yours.
        </p>
      </section>
    </main>
  )
}

function Status({ label, value }) {
  const connected =
    value === 'Connected' || value.endsWith('ready')

  return (
    <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
      <span className="text-sm text-neutral-600">{label}</span>
      <span className={`text-sm font-medium ${connected ? 'text-green-600' : 'text-amber-600'
        }`}>
        {value}
      </span>
    </div>
  )
}

export default App