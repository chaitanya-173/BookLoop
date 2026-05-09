export function BookCardSkeleton() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow animate-pulse">
      <div className="h-28 sm:h-36 md:h-44 bg-[var(--bg)]" />

      <div className="p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
        <div className="flex justify-between gap-3">
          <div className="h-4 w-2/3 rounded bg-[var(--bg)]" />
          <div className="h-6 w-16 rounded-full bg-[var(--bg)]" />
        </div>

        <div className="h-4 w-20 rounded bg-[var(--bg)]" />
        <div className="h-7 w-36 rounded-full bg-[var(--bg)]" />
        <div className="border-t border-[var(--border)]" />

        <div className="h-3 w-32 rounded bg-[var(--bg)]" />
        <div className="h-3 w-28 rounded bg-[var(--bg)]" />

        <div className="flex justify-between pt-2">
          <div className="h-3 w-20 rounded bg-[var(--bg)]" />
          <div className="h-3 w-24 rounded bg-[var(--bg)]" />
        </div>
      </div>
    </div>
  );
}

export function BookGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </div>
  );
}
