import { useMemo, useState } from 'react';

import type { Card, CardClassification, CardDifficulty } from '../types/card';

export type SortOption = 'alphabetical' | 'difficulty' | 'date' | 'classification';

export interface FilterState {
  classifications: CardClassification[];
  difficulties: CardDifficulty[];
  tags: string[];
  searchQuery: string;
  sortBy: SortOption;
}

const DEFAULT_FILTERS: FilterState = {
  classifications: [],
  difficulties: [],
  tags: [],
  searchQuery: '',
  sortBy: 'alphabetical',
} as const;

const DIFFICULTY_ORDER: Record<CardDifficulty | 'none', number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  none: 4,
} as const;

/**
 * Custom hook for filtering and sorting cards
 * @param cards - Array of cards to filter and sort
 * @returns Filter state, filtered/sorted cards, and filter update functions
 */
export function useFilters(cards: Card[]) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filteredAndSortedCards = useMemo(() => {
    let filtered = [...cards];

    // Apply classification filter
    if (filters.classifications.length > 0) {
      filtered = filtered.filter(card =>
        filters.classifications.includes(card.classification)
      );
    }

    // Apply difficulty filter
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter(card =>
        card.difficulty && filters.difficulties.includes(card.difficulty)
      );
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(card =>
        filters.tags.some(tag => card.tags.includes(tag))
      );
    }

    // Apply search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(card =>
        card.title.toLowerCase().includes(query) ||
        card.explanation.toLowerCase().includes(query) ||
        card.code.toLowerCase().includes(query) ||
        card.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        
        case 'difficulty': {
          const aDiff = a.difficulty || 'none';
          const bDiff = b.difficulty || 'none';
          return DIFFICULTY_ORDER[aDiff] - DIFFICULTY_ORDER[bDiff];
        }
        
        case 'date': {
          const aDate = a.dateAdded || '';
          const bDate = b.dateAdded || '';
          return bDate.localeCompare(aDate); // Newest first
        }
        
        case 'classification':
          return a.classification.localeCompare(b.classification) ||
                 a.title.localeCompare(b.title);
        
        default:
          return 0;
      }
    });

    return sorted;
  }, [cards, filters]);

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return {
    filters,
    filteredAndSortedCards,
    updateFilters,
    resetFilters,
  };
}

