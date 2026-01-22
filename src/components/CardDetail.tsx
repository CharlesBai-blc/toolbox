import { useState } from 'react';
import type { Card } from '../types/card';
import { useAuth } from '../hooks/useAuth';
import { CardFormModal } from './CardFormModal';
import { AuthModal } from './AuthModal';
import { deleteCard } from '../services/cardService';
import { CodeEditor } from './CodeEditor';
import { formatClassification, getDifficultyColor } from '../utils/constants';

interface CardDetailProps {
  card: Card;
  onClose: () => void;
  onCardUpdated?: () => void;
}

type Section = 'code' | 'explanation' | 'leetcode' | 'examples' | 'related';

const SECTIONS: readonly { id: Section; label: string }[] = [
  { id: 'code', label: 'Code Snippet' },
  { id: 'explanation', label: 'Explanation' },
  { id: 'leetcode', label: 'LeetCode Links' },
  { id: 'examples', label: 'Examples' },
  { id: 'related', label: 'Related Topics' },
] as const;

export function CardDetail({ card, onClose, onCardUpdated }: CardDetailProps) {
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('code');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleEdit = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCard(card.id);
      onClose();
      onCardUpdated?.();
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete card. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCardUpdated = () => {
    setShowEditModal(false);
    onCardUpdated?.();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'code':
        return (
          <div className="w-full max-w-[800px] text-left">
            <h2 className="m-0 mb-6 text-2xl font-normal text-text-primary text-left tracking-normal">
              Code Implementation
            </h2>
            <div className="bg-code-bg border-none rounded p-6 overflow-x-auto mb-6 text-left">
              <div className="mt-4">
                <CodeEditor 
                  initialCode={card.code} 
                  language={card.language || 'python'} 
                />
              </div>
            </div>
            {card.classification === 'data-structures' && card.methods && card.methods.length > 0 ? (
              <div className="flex flex-col gap-3 text-left">
                <h3 className="mb-3 text-[1.1em]">Common Methods</h3>
                <div>
                  {card.methods.map((method, idx) => (
                    <div key={idx} className="text-text-secondary text-sm font-normal mb-2">
                      <strong className="text-text-primary mr-2 font-medium">{method.name}:</strong> {method.timeComplexity}
                    </div>
                  ))}
                </div>
                {card.spaceComplexity && (
                  <div className="text-text-secondary text-sm font-normal mt-3">
                    <strong className="text-text-primary mr-2 font-medium">Space Complexity:</strong> {card.spaceComplexity}
                  </div>
                )}
              </div>
            ) : (
              (card.timeComplexity || card.spaceComplexity) && (
                <div className="flex flex-col gap-3 text-left">
                  {card.timeComplexity && (
                    <div className="text-text-secondary text-sm font-normal">
                      <strong className="text-text-primary mr-2 font-medium">Time Complexity:</strong> {card.timeComplexity}
                    </div>
                  )}
                  {card.spaceComplexity && (
                    <div className="text-text-secondary text-sm font-normal">
                      <strong className="text-text-primary mr-2 font-medium">Space Complexity:</strong> {card.spaceComplexity}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        );

      case 'explanation':
        return (
          <div className="w-full max-w-[800px] text-left">
            <h2 className="m-0 mb-6 text-2xl font-normal text-text-primary text-left tracking-normal">
              Explanation
            </h2>
            <div className="text-text-secondary leading-[1.75] text-base text-left font-normal">
              <p className="m-0">{card.explanation}</p>
            </div>
          </div>
        );

      case 'leetcode':
        return (
          <div className="w-full max-w-[800px] text-left">
            <h2 className="m-0 mb-6 text-2xl font-normal text-text-primary text-left tracking-normal">
              LeetCode Problems
            </h2>
            {card.relatedProblems && card.relatedProblems.length > 0 ? (
              <div className="text-left">
                <ul className="list-none p-0 m-0 text-left">
                  {card.relatedProblems.map((problem, idx) => (
                    <li key={idx} className="py-2 text-text-secondary text-sm border-b border-border font-normal last:border-b-0">
                      {problem}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-[#6a6a6a] italic text-left">No LeetCode problems linked yet.</p>
            )}
          </div>
        );

      case 'examples':
        return (
          <div className="w-full max-w-[800px] text-left">
            <h2 className="m-0 mb-6 text-2xl font-normal text-text-primary text-left tracking-normal">
              Use Cases & Examples
            </h2>
            {card.useCases && card.useCases.length > 0 ? (
              <div className="text-left">
                <ul className="list-none p-0 m-0 text-left">
                  {card.useCases.map((useCase, idx) => (
                    <li key={idx} className="py-2 text-text-secondary text-sm border-b border-border font-normal last:border-b-0">
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-[#6a6a6a] italic text-left">No examples provided yet.</p>
            )}
          </div>
        );

      case 'related':
        return (
          <div className="w-full max-w-[800px] text-left">
            <h2 className="m-0 mb-6 text-2xl font-normal text-text-primary text-left tracking-normal">
              Related Topics
            </h2>
            <div className="flex flex-wrap gap-2 justify-start">
              {card.tags.map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-[#3c4043] border-none rounded text-xs text-text-secondary font-normal">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4 md:p-0" onClick={onClose}>
      <div className="bg-surface border-none rounded-lg w-full max-w-[1400px] h-[90vh] max-h-[900px] flex flex-col shadow-modal md:rounded-lg md:h-[90vh] md:max-h-[900px]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center px-8 py-6 border-b border-border">
          <div className="flex items-center gap-4 flex-1 flex-col md:flex-row md:items-center md:gap-4">
            <h1 className="m-0 text-2xl md:text-2xl font-normal text-text-primary tracking-normal">
              {card.title}
            </h1>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-2xl text-xs font-medium uppercase text-text-primary tracking-[0.5px] bg-[#5b8fb8] border border-[#6b9fc8]">
                {formatClassification(card.classification)}
              </span>
              {card.difficulty && (
                <span
                  className="px-3 py-1 rounded-2xl text-xs font-medium uppercase text-text-primary tracking-[0.5px]"
                  style={{ backgroundColor: getDifficultyColor(card.difficulty) }}
                >
                  {card.difficulty}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                <button
                  className="px-4 py-2 border-none rounded text-sm font-medium cursor-pointer transition-all duration-200 bg-accent text-background hover:bg-accent-hover"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 border-none rounded text-sm font-medium cursor-pointer transition-all duration-200 bg-error text-text-primary hover:bg-error-hover disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {showDeleteConfirm ? (isDeleting ? 'Deleting...' : 'Confirm Delete') : 'Delete'}
                </button>
              </>
            )}
            <button 
              className="bg-transparent border-none text-text-tertiary text-[2rem] w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 leading-none p-0 hover:bg-[#3c4043] hover:text-text-primary" 
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          <nav className="w-full md:w-[200px] border-r-0 md:border-r border-border py-2 md:py-4 flex flex-row md:flex-col gap-1 md:gap-1 overflow-x-auto md:overflow-y-auto flex-shrink-0 bg-background md:border-b-0 border-b border-dark-border px-2 md:px-0">
            {SECTIONS.map(section => (
              <button
                key={section.id}
                className={`px-3 md:px-4 py-2 md:py-3 bg-transparent border-none text-text-secondary text-left cursor-pointer text-sm transition-all duration-200 border-l-0 md:border-l-3 border-b-3 md:border-b-0 border-transparent font-normal whitespace-nowrap md:whitespace-normal hover:bg-[#3c4043] hover:text-text-primary ${
                  activeSection === section.id
                    ? 'bg-[#3c4043] text-accent border-l-accent md:border-l-accent border-b-accent md:border-b-transparent font-medium'
                    : ''
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 p-8 md:p-8 overflow-y-auto flex flex-col items-start">
            {renderContent()}
          </div>
        </div>
      </div>

      {showEditModal && (
        <CardFormModal
          card={card}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleCardUpdated}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

