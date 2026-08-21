export default function BlogLoading() {
  return (
    <main className="bg-white min-h-screen">
      {/* Intro skeleton */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10 small:py-14 text-center">
          <div className="h-3 w-40 bg-gray-100 rounded mx-auto mb-6 animate-pulse" />
          <div className="h-12 w-[min(32rem,90%)] bg-gray-100 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-4 w-[min(20rem,80%)] bg-gray-100 rounded mx-auto animate-pulse" />
        </div>
      </section>

      {/* Hero card skeleton */}
      <section className="max-w-7xl mx-auto px-6 pt-12 small:pt-16 pb-4">
        <div className="grid grid-cols-1 small:grid-cols-12 gap-8 small:gap-12 items-center">
          <div className="small:col-span-7 aspect-[4/3] rounded-lg bg-gray-100 animate-pulse" />
          <div className="small:col-span-5 space-y-4">
            <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
            <div className="h-8 w-3/4 bg-gray-100 rounded animate-pulse" />
            <div className="h-8 w-1/2 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </section>

      {/* Category pill skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-10 small:py-12 flex items-center justify-center gap-3 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-28 rounded-full bg-gray-100 animate-pulse"
          />
        ))}
      </div>

      {/* Secondary grid skeleton */}
      <section className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 xsmall:grid-cols-2 small:grid-cols-3 gap-x-8 gap-y-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function ArticleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] rounded-lg bg-gray-100 mb-5" />
      <div className="h-3 w-24 bg-gray-100 rounded mb-3" />
      <div className="h-5 w-3/4 bg-gray-100 rounded mb-2" />
      <div className="h-5 w-1/2 bg-gray-100 rounded mb-3" />
      <div className="h-3 w-32 bg-gray-100 rounded" />
    </div>
  )
}
