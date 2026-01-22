import type { Card } from '../types/card';
import { formatClassification, getDifficultyColor } from '../utils/constants';

interface CardProps {
  card: Card;
  onCardClick?: (card: Card) => void;
}

/**
 * Truncates text to a maximum length with ellipsis
 */
function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function Card({ card, onCardClick }: CardProps) {
  const handleClick = () => {
    onCardClick?.(card);
  };

  return (
    <div 
      className="bg-surface border-none rounded-lg shadow-card p-4 flex flex-col transition-all duration-200 cursor-pointer h-full hover:shadow-card-hover hover:-translate-y-0.5"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-3 gap-3">
        <h3 className="m-0 text-base font-medium text-text-primary flex-1 leading-[1.4] tracking-normal">
          {card.title}
        </h3>
        <div className="flex gap-1 flex-wrap flex-shrink-0">
          <span className="px-2.5 py-1 rounded-2xl text-[0.6875rem] font-medium uppercase text-text-primary leading-[1.4] tracking-[0.5px] bg-[#5b8fb8] border border-[#6b9fc8]">
            {formatClassification(card.classification)}
          </span>
          {card.difficulty && (
            <span 
              className="px-2.5 py-1 rounded-2xl text-[0.6875rem] font-medium uppercase text-text-primary leading-[1.4] tracking-[0.5px]"
              style={{ backgroundColor: getDifficultyColor(card.difficulty) }}
            >
              {card.difficulty}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        <div className="text-text-secondary leading-6 text-sm font-normal">
          <p className="m-0">{truncateText(card.explanation)}</p>
        </div>
        {(card.timeComplexity || card.spaceComplexity) && (
          <div className="flex gap-3 flex-wrap text-[0.7rem] text-[#8a8a8a]">
            {card.timeComplexity && (
              <span className="px-1.5 py-0.5 bg-dark-surface border border-dark-border rounded text-[#b5b5b5]">
                {card.timeComplexity}
              </span>
            )}
            {card.spaceComplexity && (
              <span className="px-1.5 py-0.5 bg-dark-surface border border-dark-border rounded text-[#b5b5b5]">
                {card.spaceComplexity}
              </span>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          {card.tags.map(tag => (
            <span 
              key={tag} 
              className="px-2 py-1 bg-[#3c4043] border-none rounded text-[0.6875rem] text-text-secondary font-normal"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="text-xs text-text-tertiary text-center pt-3 mt-auto font-normal">
          Click to view details
        </div>
      </div>
    </div>
  );
}

