import { useEffect, useMemo, useRef, useState } from 'react';
import type { CardClassification, CardDifficulty } from '../types/card';
import type { FilterState, SortOption } from '../hooks/useFilters';
import { CLASSIFICATIONS, DIFFICULTIES, formatClassification } from '../utils/constants';
import { SearchIcon, SlidersIcon, XIcon } from './ui/Icons';

interface FilterBarProps {
  filters: FilterState;
  allTags: string[];
  resultCount: number;
  totalCount: number;
  onFiltersChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
}

const SORT_OPTIONS: readonly { value: SortOption; label: string }[] = [
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'difficulty', label: 'Difficulty' },
  { value: 'date', label: 'Date Added' },
  { value: 'classification', label: 'Classification' },
] as const;

const VISIBLE_TAG_COUNT = 12;

export function FilterBar({
  filters,
  allTags,
  resultCount,
  totalCount,
  onFiltersChange,
  onReset,
}: FilterBarProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.classifications.length > 0 ||
      filters.difficulties.length > 0 ||
      filters.tags.length > 0 ||
      filters.searchQuery.trim() !== ''
    );
  }, [filters]);

  const activeFilterCount =
    filters.classifications.length +
    filters.difficulties.length +
    filters.tags.length +
    (filters.searchQuery.trim() ? 1 : 0);

  const visibleTags = showAllTags
    ? allTags
    : [
        ...filters.tags,
        ...allTags.filter(tag => !filters.tags.includes(tag)),
      ].slice(0, VISIBLE_TAG_COUNT);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable;

      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  const toggleClassification = (classification: CardClassification) => {
    const newClassifications = filters.classifications.includes(classification)
      ? filters.classifications.filter(c => c !== classification)
      : [...filters.classifications, classification];
    onFiltersChange({ classifications: newClassifications });
  };

  const toggleDifficulty = (difficulty: CardDifficulty) => {
    const newDifficulties = filters.difficulties.includes(difficulty)
      ? filters.difficulties.filter(d => d !== difficulty)
      : [...filters.difficulties, difficulty];
    onFiltersChange({ difficulties: newDifficulties });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ tags: newTags });
  };

  return (
    <section className="panel mb-8" aria-label="Filter concept library">
      <div className="grid gap-px bg-border lg:grid-cols-[1fr_auto_auto]">
        <div className="relative bg-surface">
          <label className="sr-only" htmlFor="concept-search">
            Search concepts
          </label>
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-text-tertiary" />
          <input
            ref={searchRef}
            id="concept-search"
            type="text"
            placeholder="Search concepts, patterns, tags, or code..."
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
            className="h-16 w-full border-0 bg-surface py-3 pl-12 pr-14 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:bg-surface-soft"
          />
          {filters.searchQuery ? (
            <button
              type="button"
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center text-text-tertiary transition-colors hover:text-text-primary"
              onClick={() => onFiltersChange({ searchQuery: '' })}
              aria-label="Clear search"
            >
              <XIcon className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border border-border px-2 py-1 font-mono text-[0.625rem] text-text-tertiary">
              /
            </kbd>
          )}
        </div>

        <label className="flex min-h-16 items-center gap-3 bg-surface px-4">
          <span className="spec-label whitespace-nowrap">Sort</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ sortBy: e.target.value as SortOption })}
            className="min-w-[150px] cursor-pointer border-0 bg-transparent py-2 font-mono text-xs uppercase tracking-[0.04em] text-text-primary outline-none"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="flex min-h-16 items-center justify-between gap-4 bg-surface px-5 text-left transition-colors hover:bg-surface-soft md:hidden"
          onClick={() => setShowMobileFilters(current => !current)}
          aria-expanded={showMobileFilters}
        >
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-text-primary">
            <SlidersIcon className="h-4 w-4 text-accent" />
            Filters
          </span>
          {activeFilterCount > 0 && (
            <span className="grid h-6 min-w-6 place-items-center bg-accent px-1 font-mono text-[0.625rem] text-background">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="hidden min-h-16 items-center bg-surface px-5 md:flex">
          <span className="whitespace-nowrap font-mono text-xs text-text-secondary">
            <strong className="font-medium text-text-primary">{resultCount}</strong>
            <span className="text-text-tertiary"> / {totalCount}</span>
          </span>
        </div>
      </div>

      <div
        className={`${showMobileFilters ? 'grid' : 'hidden'} gap-7 border-t border-border p-5 md:grid md:grid-cols-2 md:p-6 xl:grid-cols-[1.35fr_0.65fr]`}
      >
        <div>
          <span className="spec-label mb-3 block">Domain</span>
          <div className="flex flex-wrap gap-2">
            {CLASSIFICATIONS.map(classification => {
              const selected = filters.classifications.includes(classification);
              return (
                <button
                  type="button"
                  key={classification}
                  onClick={() => toggleClassification(classification)}
                  aria-pressed={selected}
                  className={`filter-chip ${selected ? 'filter-chip-active' : ''}`}
                >
                  {formatClassification(classification)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="spec-label mb-3 block">Difficulty</span>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map(difficulty => {
              const selected = filters.difficulties.includes(difficulty);
              return (
                <button
                  type="button"
                  key={difficulty}
                  onClick={() => toggleDifficulty(difficulty)}
                  aria-pressed={selected}
                  className={`filter-chip ${selected ? 'filter-chip-active' : ''}`}
                >
                  {difficulty}
                </button>
              );
            })}
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="md:col-span-2 xl:col-span-2">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="spec-label">Tags</span>
              {allTags.length > VISIBLE_TAG_COUNT && (
                <button
                  type="button"
                  className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-text-tertiary transition-colors hover:text-accent"
                  onClick={() => setShowAllTags(current => !current)}
                >
                  {showAllTags ? 'Show less' : `Show all +${allTags.length - VISIBLE_TAG_COUNT}`}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {visibleTags.map(tag => {
                const selected = filters.tags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    aria-pressed={selected}
                    className={`filter-chip ${selected ? 'filter-chip-active' : ''}`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between border-t border-border bg-background/50 px-5 py-3">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-text-tertiary">
            {activeFilterCount} active {activeFilterCount === 1 ? 'parameter' : 'parameters'}
          </span>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-text-secondary transition-colors hover:text-accent"
          >
            <XIcon className="h-3.5 w-3.5" />
            Clear all
          </button>
        </div>
      )}
    </section>
  );
}
