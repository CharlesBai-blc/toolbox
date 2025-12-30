import { useMemo } from 'react';
import { allCards } from '../data/cards';

export function useCards() {
  const cards = useMemo(() => allCards, []);

  // Get all unique tags from all cards
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    cards.forEach(card => {
      card.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [cards]);

  return {
    cards,
    allTags
  };
}

