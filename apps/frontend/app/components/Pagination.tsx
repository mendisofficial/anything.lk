"use client";

type PaginationProps = {
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  totalCount?: number;
  onPageSelect?: (page: number) => void;
};

export default function Pagination({
  page,
  pageSize, // reserved for future display; referenced to satisfy linter
  hasNext,
  hasPrev,
  onNext,
  onPrev,
  totalCount,
  onPageSelect,
}: PaginationProps) {
  const canPrev = !!hasPrev;
  const canNext = !!hasNext;
  // no-op usage to avoid TS/ESLint unused warning for now until we show ranges like "1-6 of 42"
  void pageSize;

  return (
    <nav
      aria-label="Pagination"
      className="mx-auto mt-6 flex max-w-7xl justify-between px-4 text-sm font-medium text-gray-700 sm:px-6 lg:px-8"
    >
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={canPrev ? onPrev : undefined}
          disabled={!canPrev}
          className={`inline-flex h-10 items-center rounded-md border bg-white px-4 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/25 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:outline-hidden ${
            canPrev
              ? "border-gray-300 hover:bg-gray-100"
              : "border-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Previous
        </button>
      </div>
      <div className="hidden items-center space-x-2 sm:flex">
        {/* Keep it simple for now: show current page indicator; could expand when totalCount is available */}
        {onPageSelect && totalCount ? (
          <span className="text-gray-600">Page {page}</span>
        ) : (
          <span className="text-gray-600">Page {page}</span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 justify-end">
        <button
          type="button"
          onClick={canNext ? onNext : undefined}
          disabled={!canNext}
          className={`inline-flex h-10 items-center rounded-md border bg-white px-4 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/25 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:outline-hidden ${
            canNext
              ? "border-gray-300 hover:bg-gray-100"
              : "border-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
