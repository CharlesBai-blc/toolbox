import { useState } from 'react';
import type { Card } from '../types/card';
import './CardDetail.css';

interface CardDetailProps {
  card: Card;
  onClose: () => void;
}

type Section = 'code' | 'explanation' | 'leetcode' | 'examples' | 'related';

export function CardDetail({ card, onClose }: CardDetailProps) {
  const [activeSection, setActiveSection] = useState<Section>('code');

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

  const sections: { id: Section; label: string }[] = [
    { id: 'code', label: 'Code Snippet' },
    { id: 'explanation', label: 'Explanation' },
    { id: 'leetcode', label: 'LeetCode Links' },
    { id: 'examples', label: 'Examples' },
    { id: 'related', label: 'Related Topics' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'code':
        return (
          <div className="card-detail-content-section">
            <h2>Code Implementation</h2>
            <div className="card-detail-code">
              <pre><code>{card.code}</code></pre>
            </div>
            {(card.timeComplexity || card.spaceComplexity) && (
              <div className="card-detail-complexity">
                {card.timeComplexity && (
                  <div className="complexity-item">
                    <strong>Time Complexity:</strong> {card.timeComplexity}
                  </div>
                )}
                {card.spaceComplexity && (
                  <div className="complexity-item">
                    <strong>Space Complexity:</strong> {card.spaceComplexity}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'explanation':
        return (
          <div className="card-detail-content-section">
            <h2>Explanation</h2>
            <div className="card-detail-explanation">
              <p>{card.explanation}</p>
            </div>
          </div>
        );

      case 'leetcode':
        return (
          <div className="card-detail-content-section">
            <h2>LeetCode Problems</h2>
            {card.relatedProblems && card.relatedProblems.length > 0 ? (
              <div className="card-detail-leetcode">
                <ul>
                  {card.relatedProblems.map((problem, idx) => (
                    <li key={idx}>{problem}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="card-detail-empty">No LeetCode problems linked yet.</p>
            )}
          </div>
        );

      case 'examples':
        return (
          <div className="card-detail-content-section">
            <h2>Use Cases & Examples</h2>
            {card.useCases && card.useCases.length > 0 ? (
              <div className="card-detail-examples">
                <ul>
                  {card.useCases.map((useCase, idx) => (
                    <li key={idx}>{useCase}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="card-detail-empty">No examples provided yet.</p>
            )}
          </div>
        );

      case 'related':
        return (
          <div className="card-detail-content-section">
            <h2>Related Topics</h2>
            <div className="card-detail-tags">
              {card.tags.map(tag => (
                <span key={tag} className="card-detail-tag">{tag}</span>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="card-detail-overlay" onClick={onClose}>
      <div className="card-detail-container" onClick={(e) => e.stopPropagation()}>
        <div className="card-detail-header">
          <div className="card-detail-title-section">
            <h1>{card.title}</h1>
            <div className="card-detail-badges">
              <span className="card-detail-classification">
                {getClassificationLabel(card.classification)}
              </span>
              {card.difficulty && (
                <span
                  className="card-detail-difficulty"
                  style={{ backgroundColor: getDifficultyColor(card.difficulty) }}
                >
                  {card.difficulty}
                </span>
              )}
            </div>
          </div>
          <button className="card-detail-close" onClick={onClose}>×</button>
        </div>

        <div className="card-detail-body">
          <nav className="card-detail-sidebar">
            {sections.map(section => (
              <button
                key={section.id}
                className={`card-detail-nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>

          <div className="card-detail-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

