export default function PostLoading() {
  return (
    <article className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-20">
        <div className="h-4 w-64 bg-gray-100 rounded mb-8 animate-pulse" />
        <div className="h-10 w-full max-w-3xl bg-gray-100 rounded mb-3 animate-pulse" />
        <div className="h-10 w-2/3 bg-gray-100 rounded mb-6 animate-pulse" />
        <div className="flex items-center gap-4 mb-8">
          <div className="h-7 w-32 bg-gray-100 rounded animate-pulse" />
          <div className="h-7 w-24 bg-gray-100 rounded animate-pulse" />
          <div className="h-7 w-20 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="aspect-[16/9] max-w-4xl bg-gray-100 rounded-lg mb-12 animate-pulse" />
        <div className="flex gap-12">
          <div className="flex-1 max-w-4xl space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-100 rounded animate-pulse"
                style={{ width: `${70 + ((i * 17) % 28)}%` }}
              />
            ))}
          </div>
          <aside className="hidden small:block w-72 flex-shrink-0">
            <div className="h-80 rounded-xl bg-gray-100 animate-pulse" />
          </aside>
        </div>
      </div>
    </article>
  )
}
