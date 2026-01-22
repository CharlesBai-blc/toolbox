import { useState, useEffect, useMemo } from 'react';

import { supabase } from '../lib/supabase';
import { getAllCards } from '../services/cardService';
import type { Card } from '../types/card';

/**
 * Custom hook for managing cards data with real-time updates
 * @returns Cards data, loading state, error state, and refetch function
 */
export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cards and set up real-time subscription
  useEffect(() => {
    let mounted = true;

    async function loadCards() {
      try {
        setLoading(true);
        setError(null);

        const fetchedCards = await getAllCards();
        
        if (mounted) {
          setCards(fetchedCards);
        }
      } catch (err) {
        console.error('Error loading cards:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load cards');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCards();

    // Set up real-time subscription for card changes
    const channel = supabase
      .channel('cards-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cards',
        },
        async () => {
          // Reload cards when any change occurs
          try {
            const fetchedCards = await getAllCards();
            if (mounted) {
              setCards(fetchedCards);
            }
          } catch (err) {
            console.error('Error reloading cards after real-time update:', err);
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Get all unique tags from all cards
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    cards.forEach(card => {
      card.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [cards]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCards = await getAllCards();
      setCards(fetchedCards);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reload cards';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    cards,
    allTags,
    loading,
    error,
    refetch,
  };
}
