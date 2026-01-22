import { useState } from 'react';
import type { Card, CardClassification, CardDifficulty, CardLanguage, Method } from '../types/card';
import { useAuth } from '../hooks/useAuth';
import { createCard, updateCard } from '../services/cardService';
import { AuthModal } from './AuthModal';
import { getBoilerplate, isBoilerplateOnly } from '../utils/codeBoilerplate';
import { CLASSIFICATIONS, DIFFICULTIES, LANGUAGES, formatLanguage } from '../utils/constants';

interface CardFormModalProps {
  card?: Card;
  onClose: () => void;
  onSuccess: () => void;
}

export function CardFormModal({ card, onClose, onSuccess }: CardFormModalProps) {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const isEditing = !!card;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialLanguage: CardLanguage = card?.language || 'python';
  const [formData, setFormData] = useState({
    title: card?.title || '',
    classification: card?.classification || 'algorithms' as CardClassification,
    difficulty: card?.difficulty || '' as CardDifficulty | '',
    language: initialLanguage,
    code: card?.code || (isEditing ? '' : getBoilerplate(initialLanguage)),
    explanation: card?.explanation || '',
    timeComplexity: card?.timeComplexity || '',
    spaceComplexity: card?.spaceComplexity || '',
    methods: card?.methods || [] as Method[],
    tags: card?.tags.join(', ') || '',
    useCases: card?.useCases?.join('\n') || '',
    relatedProblems: card?.relatedProblems?.join('\n') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Parse tags, useCases, and relatedProblems
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const useCases = formData.useCases
        .split('\n')
        .map(uc => uc.trim())
        .filter(uc => uc.length > 0);
      
      const relatedProblems = formData.relatedProblems
        .split('\n')
        .map(rp => rp.trim())
        .filter(rp => rp.length > 0);

      const cardData: Omit<Card, 'id' | 'dateAdded'> = {
        title: formData.title.trim(),
        classification: formData.classification,
        difficulty: formData.difficulty || undefined,
        language: formData.language,
        code: formData.code.trim(),
        explanation: formData.explanation.trim(),
        timeComplexity: formData.classification === 'data-structures' ? undefined : (formData.timeComplexity.trim() || undefined),
        spaceComplexity: formData.spaceComplexity.trim() || undefined,
        methods: formData.classification === 'data-structures' && formData.methods.length > 0 ? formData.methods : undefined,
        tags,
        useCases: useCases.length > 0 ? useCases : undefined,
        relatedProblems: relatedProblems.length > 0 ? relatedProblems : undefined,
      };

      if (isEditing && card) {
        await updateCard(card.id, cardData);
      } else {
        await createCard(cardData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save card');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClassificationChange = (classification: CardClassification) => {
    setFormData(prev => {
      const newData = { ...prev, classification };
      // Clear methods if switching away from data-structures
      if (classification !== 'data-structures') {
        newData.methods = [];
      }
      return newData;
    });
  };

  const handleLanguageChange = (language: CardLanguage) => {
    setFormData(prev => {
      // If code is empty or just boilerplate, replace with new boilerplate
      if (!prev.code.trim() || isBoilerplateOnly(prev.code, prev.language)) {
        return { ...prev, language, code: getBoilerplate(language) };
      }
      // Otherwise, just update the language
      return { ...prev, language };
    });
  };

  const addMethod = () => {
    setFormData(prev => ({
      ...prev,
      methods: [...prev.methods, { name: '', timeComplexity: '' }]
    }));
  };

  const updateMethod = (index: number, field: 'name' | 'timeComplexity', value: string) => {
    setFormData(prev => ({
      ...prev,
      methods: prev.methods.map((method, i) => 
        i === index ? { ...method, [field]: value } : method
      )
    }));
  };

  const removeMethod = (index: number) => {
    setFormData(prev => ({
      ...prev,
      methods: prev.methods.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface border-none rounded-lg w-full max-w-[900px] max-h-[90vh] flex flex-col shadow-modal md:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center px-8 py-6 border-b border-border">
          <h2 className="m-0 text-2xl font-normal text-text-primary">{isEditing ? 'Edit Card' : 'Create New Card'}</h2>
          <button className="bg-transparent border-none text-text-tertiary text-[2rem] cursor-pointer leading-none p-0 w-8 h-8 flex items-center justify-center transition-colors duration-200 hover:text-text-primary" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1 md:p-8">
          {!isAuthenticated && (
            <div className="bg-[#1e3a5f] border border-[#5b8fb8] text-text-secondary p-4 rounded mb-6 text-center">
              <p className="m-0 mb-3 text-sm">You must be signed in to {isEditing ? 'edit' : 'create'} cards.</p>
              <button
                type="button"
                className="px-4 py-2 bg-accent text-background border-none rounded text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-accent-hover"
                onClick={() => setShowAuthModal(true)}
              >
                Sign In with Google
              </button>
            </div>
          )}

          {error && (
            <div className="bg-[#5c2b29] text-[#f28b82] px-4 py-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block font-medium text-text-secondary mb-2 text-sm">
              Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              className="w-full px-3 py-3 border border-border rounded text-sm bg-background text-text-primary font-mono transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[0_0_0_1px_#8ab4f8] focus:bg-surface"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="mb-6 md:mb-0">
              <label className="block font-medium text-text-secondary mb-2 text-sm">
                Classification <span className="text-error">*</span>
              </label>
              <select
                value={formData.classification}
                onChange={(e) => handleClassificationChange(e.target.value as CardClassification)}
                required
                className="w-full px-3 py-3 border border-border rounded text-sm bg-background text-text-primary font-mono transition-all duration-200 cursor-pointer focus:outline-none focus:border-accent focus:shadow-[0_0_0_1px_#8ab4f8] focus:bg-surface"
              >
                {CLASSIFICATIONS.map(cls => (
                  <option key={cls} value={cls}>
                    {cls === 'data-structures' ? 'Data Structures' : cls.charAt(0).toUpperCase() + cls.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6 md:mb-0">
              <label className="block font-medium text-text-secondary mb-2 text-sm">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="w-full px-3 py-3 border border-border rounded text-sm bg-background text-text-primary font-mono transition-all duration-200 cursor-pointer focus:outline-none focus:border-accent focus:shadow-[0_0_0_1px_#8ab4f8] focus:bg-surface"
              >
                <option value="">None</option>
                {DIFFICULTIES.map(diff => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6 md:mb-0">
              <label className="block font-medium text-text-secondary mb-2 text-sm">
                Language <span className="text-error">*</span>
              </label>
              <select
                value={formData.language}
                onChange={(e) => handleLanguageChange(e.target.value as CardLanguage)}
                required
                className="w-full px-3 py-3 border border-border rounded text-sm bg-background text-text-primary font-mono transition-all duration-200 cursor-pointer focus:outline-none focus:border-accent focus:shadow-[0_0_0_1px_#8ab4f8] focus:bg-surface"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>
                    {formatLanguage(lang)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-medium text-text-secondary mb-2 text-sm">
              Code <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              required
              rows={10}
              className="w-full px-3 py-3 border border-border rounded text-sm bg-background text-text-primary font-mono transition-all duration-200 resize-y min-h-[100px] focus:outline-none focus:border-accent focus:shadow-[0_0_0_1px_#8ab4f8] focus:bg-surface"
              placeholder="Enter your code here..."
            />
          </div>

          <div className="mb-6">
            <label className="block font-medium text-text-secondary mb-2 text-sm">
              Explanation <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.explanation}
              onChange={(e) => handleChange('explanation', e.target.value)}
              required
              rows={5}
              className="w-full px-3 py-3 border border-border rounded text-sm bg-background text-text-primary font-mono transition-all duration-200 resize-y min-h-[100px] focus:outline-none focus:border-accent focus:shadow-[0_0_0_1px_#8ab4f8] focus:bg-surface"
              placeholder="Explain the algorithm, pattern, or concept..."
            />
          </div>

          {formData.classification === 'data-structures' ? (
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-2">
                <label className="block font-medium text-text-secondary mb-0 text-sm">
                  Common Methods
                </label>
                <button
                  type="button"
                  onClick={addMethod}
                  className="px-3 py-1 text-[0.9em] bg-[#3b82f6] text-white border-none rounded cursor-pointer"
                >
                  + Add Method
                </button>
              </div>
              {formData.methods.length === 0 ? (
                <p className="text-[#6b7280] text-[0.9em] mt-2">
                  Click "+ Add Method" to add common methods (e.g., get, put, set) with their time complexities.
                </p>
              ) : (
                <div className="mt-2">
                  {formData.methods.map((method, index) => (
                    <div key={index} className="flex gap-2.5 mb-2.5 items-center">
                      <input
                        type="text"
                        value={method.name}
                        onChange={(e) => updateMethod(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-3 border border-border rounded text-sm bg-background text-text-primary font-mono transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[0_0_0_1px_#8ab4f8] focus:bg-surface"
                        placeholder="Method name (e.g., get)"
                      />
                      <input
                        type="text"
                        value={method.timeComplexity}
                        onChange={(e) => updateMethod(index, 'timeComplexity', e.target.value)}
                        className="flex-1 px-3 py-3 border border-border rounded text-sm bg-background text-text-primary font-mono transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[0_0_0_1px_#8ab4f8] focus:bg-surface"
                        placeholder="Time complexity (e.g., O(1))"
                      />
                      <button
                        type="button"
                        onClick={() => removeMethod(index)}
                        className="px-3 py-2 bg-[#ef4444] text-white border-none rounded cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <label className="block font-medium text-text-secondary mb-2 text-sm">Space Complexity</label>
                <input
                  type="text"
                  value={formData.spaceComplexity}
                  onChange={(e) => handleChange('spaceComplexity', e.target.value)}
                  className="w-full px-3 py-3 border border-border rounded text-sm bg-background text-text-primary font-mono transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[0_0_0_1px_#8ab4f8] focus:bg-surface"
                  placeholder="e.g., O(n)"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="mb-6 md:mb-0">
                <label className="block font-medium text-text-secondary mb-2 text-sm">Time Complexity</label>
                <input
                  type="text"
                  value={formData.timeComplexity}
                  onChange={(e) => handleChange('timeComplexity', e.target.value)}
                  className="w-full px-3 py-3 border border-border rounded text-sm bg-background text-text-primary font-mono transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[0_0_0_1px_#8ab4f8] focus:bg-surface"
                  placeholder="e.g., O(n log n)"
                />
              </div>

              <div className="mb-6 md:mb-0">
                <label className="block font-medium text-text-secondary mb-2 text-sm">Space Complexity</label>
                <input
                  type="text"
                  value={formData.spaceComplexity}
                  onChange={(e) => handleChange('spaceComplexity', e.target.value)}
                  className="w-full px-3 py-3 border border-border rounded text-sm bg-background text-text-primary font-mono transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[0_0_0_1px_#8ab4f8] focus:bg-surface"
                  placeholder="e.g., O(1)"
                />
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block font-medium text-text-secondary mb-2 text-sm">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              className="w-full px-3 py-3 border border-border rounded text-sm bg-background text-text-primary font-mono transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[0_0_0_1px_#8ab4f8] focus:bg-surface"
              placeholder="Comma-separated tags (e.g., array, search, divide-conquer)"
            />
          </div>

          <div className="mb-6">
            <label className="block font-medium text-text-secondary mb-2 text-sm">Use Cases</label>
            <textarea
              value={formData.useCases}
              onChange={(e) => handleChange('useCases', e.target.value)}
              rows={3}
              className="w-full px-3 py-3 border border-border rounded text-sm bg-background text-text-primary font-mono transition-all duration-200 resize-y min-h-[100px] focus:outline-none focus:border-accent focus:shadow-[0_0_0_1px_#8ab4f8] focus:bg-surface"
              placeholder="One use case per line..."
            />
          </div>

          <div className="mb-6">
            <label className="block font-medium text-text-secondary mb-2 text-sm">Related Problems</label>
            <textarea
              value={formData.relatedProblems}
              onChange={(e) => handleChange('relatedProblems', e.target.value)}
              rows={3}
              className="w-full px-3 py-3 border border-border rounded text-sm bg-background text-text-primary font-mono transition-all duration-200 resize-y min-h-[100px] focus:outline-none focus:border-accent focus:shadow-[0_0_0_1px_#8ab4f8] focus:bg-surface"
              placeholder="One problem per line (e.g., LeetCode 704: Binary Search)..."
            />
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-none rounded text-sm font-medium cursor-pointer transition-all duration-200 bg-[#5f6368] text-text-primary hover:bg-[#70757a] disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 border-none rounded text-sm font-medium cursor-pointer transition-all duration-200 bg-accent text-background hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading || !isAuthenticated}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Card' : 'Create Card'}
            </button>
          </div>
        </form>
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

