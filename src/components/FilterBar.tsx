import { useMemo } from 'react';
import type { CardClassification, CardDifficulty } from '../types/card';
import type { FilterState, SortOption } from '../hooks/useFilters';
import { CLASSIFICATIONS, DIFFICULTIES, formatClassification } from '../utils/constants';

interface FilterBarProps {
  filters: FilterState;
  allTags: string[];
  onFiltersChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
}

const SORT_OPTIONS: readonly { value: SortOption; label: string }[] = [
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'difficulty', label: 'Difficulty' },
  { value: 'date', label: 'Date Added' },
  { value: 'classification', label: 'Classification' },
] as const;

export function FilterBar({ filters, allTags, onFiltersChange, onReset }: FilterBarProps) {
  const hasActiveFilters = useMemo(() => {
    return (
      filters.classifications.length > 0 ||
      filters.difficulties.length > 0 ||
      filters.tags.length > 0 ||
      filters.searchQuery.trim() !== ''
    );
  }, [filters]);

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
    <div className="bg-surface border-none rounded-lg p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.3),0_4px_8px_3px_rgba(0,0,0,0.15)] mb-6 md:p-6">
      <div className="mb-3 last:mb-0">
        <div className="w-full">
          <input
            type="text"
            placeholder="Search cards..."
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-full text-sm bg-background text-text-primary transition-all duration-200 font-normal focus:outline-none focus:border-accent focus:shadow-[0_0_0_1px_#8ab4f8] focus:bg-surface"
          />
        </div>
      </div>

      <div className="mb-3 last:mb-0">
        <label className="block font-medium text-text-secondary mb-3 text-xs uppercase tracking-[0.5px]">
          Classification
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CLASSIFICATIONS.map(classification => (
            <button
              key={classification}
              onClick={() => toggleClassification(classification)}
              className={`px-4 py-2 border rounded-[20px] cursor-pointer text-[0.8125rem] text-text-secondary transition-all duration-200 font-normal hover:bg-[#3c4043] hover:border-accent hover:text-text-primary hover:shadow-[0_1px_2px_0_rgba(0,0,0,0.3)] ${
                filters.classifications.includes(classification)
                  ? 'bg-accent text-background border-accent font-medium hover:bg-accent-hover hover:border-accent-hover'
                  : 'border-border bg-background'
              }`}
            >
              {formatClassification(classification)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 last:mb-0">
        <label className="block font-medium text-text-secondary mb-3 text-xs uppercase tracking-[0.5px]">
          Difficulty
        </label>
        <div className="flex flex-wrap gap-1.5">
          {DIFFICULTIES.map(difficulty => (
            <button
              key={difficulty}
              onClick={() => toggleDifficulty(difficulty)}
              className={`px-4 py-2 border rounded-[20px] cursor-pointer text-[0.8125rem] text-text-secondary transition-all duration-200 font-normal hover:bg-[#3c4043] hover:border-accent hover:text-text-primary hover:shadow-[0_1px_2px_0_rgba(0,0,0,0.3)] ${
                filters.difficulties.includes(difficulty)
                  ? 'bg-accent text-background border-accent font-medium hover:bg-accent-hover hover:border-accent-hover'
                  : 'border-border bg-background'
              }`}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 last:mb-0">
        <label className="block font-medium text-text-secondary mb-3 text-xs uppercase tracking-[0.5px]">
          Tags
        </label>
        <div className="flex flex-wrap gap-1.5">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 border rounded-2xl cursor-pointer text-xs text-text-secondary transition-all duration-200 font-normal hover:bg-[#3c4043] hover:border-accent hover:text-text-primary ${
                filters.tags.includes(tag)
                  ? 'bg-accent text-background border-accent font-medium hover:bg-accent-hover hover:border-accent-hover'
                  : 'border-border bg-background'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 last:mb-0 flex justify-between items-center flex-wrap gap-3 md:flex-row md:flex-wrap">
        <label className="block font-medium text-text-secondary mb-3 text-xs uppercase tracking-[0.5px] md:mb-0">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFiltersChange({ sortBy: e.target.value as SortOption })}
          className="px-2 py-1.5 border border-dark-border bg-dark-surface rounded text-xs cursor-pointer text-[#b5b5b5] min-w-[120px] w-full md:w-auto focus:outline-none focus:border-[#5a5a5a] focus:shadow-[0_0_0_2px_rgba(90,90,90,0.2)]"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button 
            onClick={onReset} 
            className="px-3 py-1.5 border border-[#4a4a4a] bg-dark-surface rounded cursor-pointer text-xs text-[#b5b5b5] transition-all duration-200 hover:bg-[#3a3a3a] hover:border-[#5a5a5a] hover:text-[#e5e5e5] w-full md:w-auto"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
