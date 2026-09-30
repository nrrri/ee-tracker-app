// Shown while the server renders the page (first visit after the cache is refreshed)
function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200 ${className}`} />;
}

export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading Express Entry data">
      {/* Header */}
      <div className="mx-4 mt-4 mb-6 flex justify-center">
        <Block className="h-8 md:h-9 w-64 md:w-80 rounded-md" />
      </div>

      {/* Summary Cards */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 px-4 mb-8 md:h-[550px]">
        <Block className="h-64 md:h-full md:flex-1" />
        <Block className="h-64 md:h-full md:flex-1 lg:min-w-100" />
        <Block className="h-64 md:h-full md:flex-1" />
      </div>

      {/* Navigation */}
      <div className="flex justify-end px-4 md:px-8 mb-4">
        <Block className="h-10 w-64 rounded-md" />
      </div>

      {/* Table */}
      <div className="flex flex-col gap-2 px-4 md:px-8">
        <Block className="h-12 rounded-md" />
        {Array.from({ length: 8 }, (_, i) => (
          <Block key={i} className="h-9 rounded-md" />
        ))}
      </div>
    </main>
  );
}
