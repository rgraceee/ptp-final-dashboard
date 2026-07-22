export default function DashboardLoading() {
  return (
    <div className="min-h-screen gradient-soft">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-6 w-56 rounded shimmer mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
          <div className="lg:col-span-1 flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-gray-200/60 bg-white shadow-sm p-5 w-full h-full">
                <div className="h-3 w-20 rounded shimmer mb-3" />
                <div className="h-7 w-28 rounded shimmer mb-3" />
                <div className="h-4 w-16 rounded shimmer" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="card-static p-6 h-full min-h-[360px] w-full">
              <div className="h-5 w-40 rounded shimmer mb-2" />
              <div className="h-3 w-56 rounded shimmer mb-6" />
              <div className="h-64 w-full shimmer rounded-lg" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-gray-200/60 bg-white shadow-sm p-5 w-full h-full">
                <div className="h-3 w-20 rounded shimmer mb-3" />
                <div className="h-7 w-28 rounded shimmer mb-3" />
                <div className="h-4 w-16 rounded shimmer" />
              </div>
            ))}
        </div>
        <div className="space-y-5">
          <div className="h-6 w-48 rounded shimmer" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-9 w-16 rounded-full shimmer" />
            ))}
          </div>
          <div className="card-static p-5 h-80">
            <div className="h-5 w-56 rounded shimmer mb-3" />
            <div className="h-64 w-full shimmer rounded-lg" />
          </div>
          <div className="card-static p-5 h-72">
            <div className="h-5 w-56 rounded shimmer mb-3" />
            <div className="h-56 w-full shimmer rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
