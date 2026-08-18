import { ChevronLeftIcon, ChevronRightIcon } from './ui/Icons';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const ITEMS_PER_PAGE_OPTIONS = [6, 12, 24, 48] as const;
const MAX_VISIBLE_PAGES = 5;

export function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= MAX_VISIBLE_PAGES) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="mt-8 flex flex-col gap-5 border-y border-border py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-text-tertiary">
        Index <span className="text-text-primary">{String(startItem).padStart(2, '0')}</span>
        {' — '}
        <span className="text-text-primary">{String(endItem).padStart(2, '0')}</span>
        {' / '}
        {String(totalItems).padStart(2, '0')}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {totalPages > 1 && (
          <nav className="flex items-center gap-1" aria-label="Concept pages">
          <button
              type="button"
            onClick={handlePrevious}
            disabled={currentPage === 1}
              className="icon-button h-10 w-10"
            aria-label="Previous page"
          >
              <ChevronLeftIcon className="h-4 w-4" />
          </button>

          {getPageNumbers().map((page, idx) => {
            if (page === 'ellipsis') {
              return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="grid h-10 w-8 place-items-center font-mono text-xs text-text-tertiary"
                  >
                    ···
                </span>
              );
            }

            const pageNum = page;
            return (
              <button
                  type="button"
                key={pageNum}
                onClick={() => handlePageClick(pageNum)}
                  className={`h-10 min-w-10 border px-2 font-mono text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  currentPage === pageNum
                      ? 'border-accent bg-accent text-background'
                      : 'border-border bg-surface text-text-secondary hover:border-border-bright hover:bg-surface-soft hover:text-text-primary'
                }`}
                aria-label={`Page ${pageNum}`}
                aria-current={currentPage === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}

          <button
              type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages}
              className="icon-button h-10 w-10"
            aria-label="Next page"
          >
              <ChevronRightIcon className="h-4 w-4" />
          </button>
          </nav>
        )}

        <label className="flex items-center gap-2">
          <span className="spec-label whitespace-nowrap">Per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="h-10 cursor-pointer border border-border bg-surface px-3 font-mono text-xs text-text-primary outline-none transition-colors hover:border-border-bright focus:border-accent"
          >
            {ITEMS_PER_PAGE_OPTIONS.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

