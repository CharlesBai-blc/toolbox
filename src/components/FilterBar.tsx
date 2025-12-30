import { useMemo } from 'react';
import type { CardClassification, CardDifficulty } from '../types/card';
import type { FilterState, SortOption } from '../hooks/useFilters';
import './FilterBar.css';

interface FilterBarProps {
  filters: FilterState;
  allTags: string[];
  onFiltersChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
}

const classifications: CardClassification[] = ['sorts', 'searches', 'algorithms', 'heuristics', 'patterns', 'data-structures'];
const difficulties: CardDifficulty[] = ['easy', 'medium', 'hard'];
const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'difficulty', label: 'Difficulty' },
  { value: 'date', label: 'Date Added' },
  { value: 'classification', label: 'Classification' }
];

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
    <div className="filter-bar">
      <div className="filter-section">
        <div className="filter-search">
          <input
            type="text"
            placeholder="Search cards..."
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
            className="filter-search-input"
          />
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Classification</label>
        <div className="filter-buttons">
          {classifications.map(classification => (
            <button
              key={classification}
              onClick={() => toggleClassification(classification)}
              className={`filter-button ${filters.classifications.includes(classification) ? 'active' : ''}`}
            >
              {classification === 'data-structures' 
                ? 'Data Structures' 
                : classification.charAt(0).toUpperCase() + classification.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Difficulty</label>
        <div className="filter-buttons">
          {difficulties.map(difficulty => (
            <button
              key={difficulty}
              onClick={() => toggleDifficulty(difficulty)}
              className={`filter-button ${filters.difficulties.includes(difficulty) ? 'active' : ''}`}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Tags</label>
        <div className="filter-tags">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`filter-tag ${filters.tags.includes(tag) ? 'active' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section filter-actions">
        <label className="filter-label">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFiltersChange({ sortBy: e.target.value as SortOption })}
          className="filter-select"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button onClick={onReset} className="filter-reset">
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
