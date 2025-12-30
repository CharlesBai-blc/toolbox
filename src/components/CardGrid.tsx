import { CardComponent } from './Card';
import type { Card } from '../types/card';
import './CardGrid.css';

interface CardGridProps {
  cards: Card[];
  onCardClick?: (card: Card) => void;
}

export function CardGrid({ cards, onCardClick }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="card-grid-empty">
        <p>No cards found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {cards.map(card => (
        <CardComponent key={card.id} card={card} onCardClick={onCardClick} />
      ))}
    </div>
  );
}

