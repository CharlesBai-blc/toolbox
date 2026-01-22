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
  const totalPages = Math.ceil(totalItems / itemsPerPage);
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

  if (totalPages <= 1) {
    return (
      <div className="flex justify-between items-center py-3 flex-wrap gap-3 flex-col md:flex-row">
        <div className="text-[#9a9a9a] text-xs">
          Showing {startItem}-{endItem} of {totalItems} cards
        </div>
        <div className="flex items-center gap-4 flex-wrap flex-col md:flex-row">
          <label className="flex items-center gap-1.5 text-xs text-[#b5b5b5] justify-center md:justify-start">
            Items per page:
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-1.5 py-1.5 border border-dark-border bg-dark-surface rounded text-xs cursor-pointer text-[#b5b5b5] hover:border-[#4a4a4a] hover:bg-[#3a3a3a] focus:outline-none focus:border-[#5a5a5a] focus:shadow-[0_0_0_2px_rgba(90,90,90,0.2)]"
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

  return (
    <div className="flex justify-between items-center py-3 flex-wrap gap-3 flex-col md:flex-row">
      <div className="text-[#9a9a9a] text-xs">
        Showing {startItem}-{endItem} of {totalItems} cards
      </div>
      <div className="flex items-center gap-4 flex-wrap flex-col md:flex-row">
        <div className="flex gap-1 items-center justify-center md:justify-start flex-wrap">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-2 py-1.5 border border-dark-border bg-dark-surface rounded cursor-pointer text-xs text-[#b5b5b5] transition-all duration-200 min-w-[2rem] hover:bg-[#3a3a3a] hover:border-[#4a4a4a] hover:text-[#e5e5e5] disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            Previous
          </button>

          {getPageNumbers().map((page, idx) => {
            if (page === 'ellipsis') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1.5 py-1.5 text-[#6a6a6a] select-none text-xs">
                  ...
                </span>
              );
            }

            const pageNum = page;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum)}
                className={`px-2 py-1.5 border rounded cursor-pointer text-xs transition-all duration-200 min-w-[2rem] ${
                  currentPage === pageNum
                    ? 'bg-[#3a3a3a] text-[#e5e5e5] border-[#5a5a5a] hover:bg-[#4a4a4a] hover:border-[#6a6a6a]'
                    : 'border-dark-border bg-dark-surface text-[#b5b5b5] hover:bg-[#3a3a3a] hover:border-[#4a4a4a] hover:text-[#e5e5e5]'
                }`}
                aria-label={`Page ${pageNum}`}
                aria-current={currentPage === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-2 py-1.5 border border-dark-border bg-dark-surface rounded cursor-pointer text-xs text-[#b5b5b5] transition-all duration-200 min-w-[2rem] hover:bg-[#3a3a3a] hover:border-[#4a4a4a] hover:text-[#e5e5e5] disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            Next
          </button>
        </div>

        <label className="flex items-center gap-1.5 text-xs text-[#b5b5b5] justify-center md:justify-start">
          Items per page:
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-1.5 py-1.5 border border-dark-border bg-dark-surface rounded text-xs cursor-pointer text-[#b5b5b5] hover:border-[#4a4a4a] hover:bg-[#3a3a3a] focus:outline-none focus:border-[#5a5a5a] focus:shadow-[0_0_0_2px_rgba(90,90,90,0.2)]"
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

