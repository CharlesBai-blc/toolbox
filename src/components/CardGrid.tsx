import { Card } from './Card';
import type { Card as CardType } from '../types/card';

interface CardGridProps {
  cards: CardType[];
  onCardClick?: (card: CardType) => void;
}

export function CardGrid({ cards, onCardClick }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-8 text-[#6a6a6a] text-sm">
        <p>No cards found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 md:gap-3 py-2">
      {cards.map(card => (
        <Card key={card.id} card={card} onCardClick={onCardClick} />
      ))}
    </div>
  );
}

