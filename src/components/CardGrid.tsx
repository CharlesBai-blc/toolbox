import { Card } from './Card';
import type { Card as CardType } from '../types/card';

interface CardGridProps {
  cards: CardType[];
  startIndex?: number;
  onCardClick?: (card: CardType) => void;
  onReset?: () => void;
}

export function CardGrid({
  cards,
  startIndex = 0,
  onCardClick,
  onReset,
}: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="panel relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
        <span className="absolute left-6 top-6 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-text-tertiary">
          Query / 000
        </span>
        <div className="mb-6 grid h-16 w-16 place-items-center border border-border">
          <span className="font-display text-2xl text-accent">Ø</span>
        </div>
        <h3 className="m-0 font-display text-2xl font-medium tracking-tight text-text-primary">
          No matching concepts
        </h3>
        <p className="mb-0 mt-3 max-w-md text-sm leading-6 text-text-secondary">
          The current query returned no cards. Clear the filters or search with a broader
          term.
        </p>
        {onReset && (
          <button type="button" className="button-secondary mt-7" onClick={onReset}>
            Clear query
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          index={startIndex + index}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
}

export function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading concepts">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="min-h-[330px] border border-border bg-surface p-6"
        >
          <div className="skeleton h-3 w-20" />
          <div className="skeleton mt-10 h-7 w-3/4" />
          <div className="skeleton mt-3 h-7 w-1/2" />
          <div className="mt-8 space-y-3">
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-11/12" />
            <div className="skeleton h-3 w-3/4" />
          </div>
          <div className="skeleton mt-12 h-11 w-full" />
        </div>
      ))}
    </div>
  );
}

