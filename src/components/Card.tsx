import type { Card } from '../types/card';
import './Card.css';

interface CardProps {
  card: Card;
  onCardClick?: (card: Card) => void;
}

export function CardComponent({ card, onCardClick }: CardProps) {

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return '#3eb870';
      case 'medium': return '#c99a1c';
      case 'hard': return '#c65a5a';
      default: return '#6b7280';
    }
  };

  const getClassificationLabel = (classification: string) => {
    return classification.charAt(0).toUpperCase() + classification.slice(1);
  };

  const getPreview = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleClick = () => {
    if (onCardClick) {
      onCardClick(card);
    }
  };

  return (
    <div className="card-container" onClick={handleClick}>
      <div className="card-header">
        <h3 className="card-title">{card.title}</h3>
        <div className="card-badges">
          <span className="card-classification">{getClassificationLabel(card.classification)}</span>
          {card.difficulty && (
            <span 
              className="card-difficulty"
              style={{ backgroundColor: getDifficultyColor(card.difficulty) }}
            >
              {card.difficulty}
            </span>
          )}
        </div>
      </div>

      <div className="card-content">
        <div className="card-preview">
          <p>{getPreview(card.explanation)}</p>
        </div>
        {(card.timeComplexity || card.spaceComplexity) && (
          <div className="card-complexity-compact">
            {card.timeComplexity && <span>{card.timeComplexity}</span>}
            {card.spaceComplexity && <span>{card.spaceComplexity}</span>}
          </div>
        )}
        <div className="card-tags">
          {card.tags.map(tag => (
            <span key={tag} className="card-tag">{tag}</span>
          ))}
        </div>
        <div className="card-expand-hint">Click to view details</div>
      </div>
    </div>
  );
}

