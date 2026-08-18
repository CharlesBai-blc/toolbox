import type { Card } from '../types/card';
import {
  formatClassification,
  formatLanguage,
  getDifficultyColor,
} from '../utils/constants';
import { ArrowUpRightIcon } from './ui/Icons';

interface CardProps {
  card: Card;
  index?: number;
  onCardClick?: (card: Card) => void;
}

export function Card({ card, index = 0, onCardClick }: CardProps) {
  const handleClick = () => {
    onCardClick?.(card);
  };

  const visibleTags = card.tags.slice(0, 3);
  const remainingTags = Math.max(card.tags.length - visibleTags.length, 0);

  return (
    <button
      type="button"
      className="group relative flex min-h-[330px] w-full flex-col overflow-hidden border border-border bg-surface p-5 text-left transition-[border-color,background-color,transform] duration-200 hover:-translate-y-1 hover:border-border-bright hover:bg-surface-soft focus:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent sm:p-6"
      onClick={handleClick}
    >
      <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100" />

      <div className="mb-8 flex items-center justify-between gap-4">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-text-tertiary">
          DSA—{String(index + 1).padStart(3, '0')}
        </span>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-accent">
          {formatClassification(card.classification)}
        </span>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="mb-5 flex items-start justify-between gap-5">
          <h3 className="m-0 font-display text-[1.4rem] font-medium leading-[1.08] tracking-[-0.035em] text-text-primary sm:text-[1.55rem]">
            {card.title}
          </h3>
          <ArrowUpRightIcon className="h-5 w-5 shrink-0 text-text-tertiary transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
        </div>

        <p className="m-0 overflow-hidden text-sm leading-6 text-text-secondary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {card.explanation}
        </p>

        <div className="mt-auto pt-8">
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-border py-3">
            <span className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-text-secondary">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: getDifficultyColor(card.difficulty) }}
              />
              {card.difficulty || 'Unrated'}
            </span>
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-text-secondary">
              {formatLanguage(card.language || 'python')}
            </span>
          </div>

        {(card.timeComplexity || card.spaceComplexity) && (
            <div className="mb-4 flex flex-wrap gap-2">
            {card.timeComplexity && (
                <span className="metadata-chip">
                  <span className="text-text-tertiary">Time</span>
                  {card.timeComplexity}
              </span>
            )}
            {card.spaceComplexity && (
                <span className="metadata-chip">
                  <span className="text-text-tertiary">Space</span>
                  {card.spaceComplexity}
              </span>
            )}
          </div>
        )}

          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {visibleTags.map(tag => (
              <span
                key={tag}
                className="font-mono text-[0.625rem] uppercase tracking-[0.06em] text-text-tertiary"
              >
                #{tag}
              </span>
            ))}
            {remainingTags > 0 && (
              <span className="font-mono text-[0.625rem] text-text-tertiary">
                +{remainingTags}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

