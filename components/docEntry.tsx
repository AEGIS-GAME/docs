interface Entry {
  name: string
  description: string
}

function DocEntry({ entries }: { entries: Entry[] }) {
  if (!entries.length) return null

  return (
    <section className="mb-6">
      <div className="space-y-2">
        {entries.map((entry, i) => (
          <div key={i} className="flex flex-col">
            <span className="font-mono font-bold text-lg">{entry.name}:</span>
            <span className="ml-4">{entry.description}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DocEntry
