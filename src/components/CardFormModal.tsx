import { useState } from 'react';
import type {
  Card,
  CardClassification,
  CardDifficulty,
  CardInput,
  CardLanguage,
  Method,
} from '../types/card';
import { useAuth } from '../hooks/useAuth';
import { createCard, updateCard } from '../services/cardService';
import { getBoilerplate } from '../utils/codeBoilerplate';
import {
  CLASSIFICATIONS,
  DIFFICULTIES,
  LANGUAGES,
  formatClassification,
  formatLanguage,
} from '../utils/constants';
import { AuthModal } from './AuthModal';
import { CodeEditor } from './CodeEditor';
import { LockIcon, PlusIcon, TrashIcon, XIcon } from './ui/Icons';
import { Modal } from './ui/Modal';

interface CardFormModalProps {
  card?: Card;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

interface FormSectionProps {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

interface ImplementationDraft {
  code: string;
}

type ImplementationDrafts = Partial<
  Record<CardLanguage, ImplementationDraft>
>;

function FormSection({
  number,
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="grid gap-6 border-t border-border py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
      <div>
        <span className="spec-label text-accent">{number}</span>
        <h3 className="mb-0 mt-2 font-display text-xl font-medium text-text-primary">
          {title}
        </h3>
        <p className="mb-0 mt-2 max-w-xs text-xs leading-5 text-text-tertiary">
          {description}
        </p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

const parseLines = (value: string) =>
  value
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean);

const parseTags = (value: string) =>
  value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

function createImplementationDrafts(
  card: Card | undefined,
  initialLanguage: CardLanguage,
): ImplementationDrafts {
  if (!card || card.implementations.length === 0) {
    return {
      [initialLanguage]: {
        code: getBoilerplate(initialLanguage),
      },
    };
  }

  return Object.fromEntries(
    card.implementations.map(implementation => [
      implementation.language,
      {
        code: implementation.code,
      },
    ]),
  ) as ImplementationDrafts;
}

export function CardFormModal({ card, onClose, onSuccess }: CardFormModalProps) {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(card);

  const initialImplementation = card?.implementations[0];
  const initialLanguage: CardLanguage =
    initialImplementation?.language || 'python';
  const [selectedLanguage, setSelectedLanguage] =
    useState<CardLanguage>(initialLanguage);
  const [implementationDrafts, setImplementationDrafts] =
    useState<ImplementationDrafts>(() =>
      createImplementationDrafts(card, initialLanguage),
    );
  const [formData, setFormData] = useState({
    title: card?.title || '',
    classification: card?.classification || ('algorithms' as CardClassification),
    difficulty: card?.difficulty || ('' as CardDifficulty | ''),
    explanation: card?.explanation || '',
    timeComplexity: card?.timeComplexity || '',
    spaceComplexity: card?.spaceComplexity || '',
    methods: card?.methods || ([] as Method[]),
    tags: card?.tags.join(', ') || '',
    useCases: card?.useCases?.join('\n') || '',
    relatedProblems: card?.relatedProblems?.join('\n') || '',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cardData: CardInput = {
        title: formData.title.trim(),
        classification: formData.classification,
        difficulty: formData.difficulty || undefined,
        explanation: formData.explanation.trim(),
        timeComplexity:
          formData.classification === 'data-structures'
            ? undefined
            : formData.timeComplexity.trim() || undefined,
        spaceComplexity: formData.spaceComplexity.trim() || undefined,
        methods:
          formData.classification === 'data-structures' && formData.methods.length > 0
            ? formData.methods
            : undefined,
        tags: parseTags(formData.tags),
        useCases: parseLines(formData.useCases),
        relatedProblems: parseLines(formData.relatedProblems),
      };

      const implementations = LANGUAGES.flatMap(language => {
        const draft = implementationDrafts[language];
        if (!draft?.code.trim()) return [];
        return [{ language, code: draft.code.trim() }];
      });

      if (implementations.length === 0) {
        throw new Error('Add at least one code implementation before saving.');
      }

      if (isEditing && card) {
        await updateCard(
          card.id,
          cardData,
          implementations.map(implementation => ({
            language: implementation.language,
            code: implementation.code,
          })),
        );
      } else {
        await createCard(
          cardData,
          implementations.map(implementation => ({
            language: implementation.language,
            code: implementation.code,
          })),
        );
      }

      await onSuccess();
      onClose();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : 'Failed to save card',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(previous => ({ ...previous, [field]: value }));
  };

  const handleClassificationChange = (classification: CardClassification) => {
    setFormData(previous => ({
      ...previous,
      classification,
      methods: classification === 'data-structures' ? previous.methods : [],
    }));
  };

  const handleLanguageChange = (language: CardLanguage) => {
    setImplementationDrafts(previous => {
      if (previous[language]) return previous;
      return {
        ...previous,
        [language]: {
          code: getBoilerplate(language),
        },
      };
    });
    setSelectedLanguage(language);
  };

  const handleCodeChange = (code: string) => {
    setImplementationDrafts(previous => ({
      ...previous,
      [selectedLanguage]: {
        ...previous[selectedLanguage],
        code,
      },
    }));
  };

  const addMethod = () => {
    setFormData(previous => ({
      ...previous,
      methods: [...previous.methods, { name: '', timeComplexity: '' }],
    }));
  };

  const updateMethod = (
    index: number,
    field: keyof Method,
    value: string,
  ) => {
    setFormData(previous => ({
      ...previous,
      methods: previous.methods.map((method, methodIndex) =>
        methodIndex === index ? { ...method, [field]: value } : method,
      ),
    }));
  };

  const removeMethod = (index: number) => {
    setFormData(previous => ({
      ...previous,
      methods: previous.methods.filter((_, methodIndex) => methodIndex !== index),
    }));
  };

  const selectedDraft = implementationDrafts[selectedLanguage];
  const draftedLanguages = LANGUAGES.filter(
    language => implementationDrafts[language],
  );

  return (
    <>
      <Modal
        onClose={onClose}
        labelledBy="card-form-title"
        closeOnBackdrop={!loading}
        className="flex h-[calc(100vh-1.5rem)] w-full max-w-[1180px] flex-col overflow-hidden sm:h-[min(94vh,980px)]"
      >
        <header className="flex shrink-0 items-start justify-between gap-5 border-b border-border px-5 py-5 sm:items-center sm:px-7">
          <div>
            <span className="spec-label mb-2 block text-accent">
              {isEditing ? 'Library maintenance' : 'Knowledge capture'}
            </span>
            <h2
              id="card-form-title"
              className="m-0 font-display text-2xl font-medium tracking-[-0.035em] text-text-primary sm:text-3xl"
            >
              {isEditing ? 'Edit concept' : 'Create concept'}
            </h2>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close card editor"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-8 lg:px-10">
            {!isAuthenticated && (
              <div className="mt-8 flex flex-col gap-4 border border-accent/40 bg-accent/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <LockIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <strong className="block text-sm font-medium text-text-primary">
                      Editor access required
                    </strong>
                    <span className="mt-1 block text-xs leading-5 text-text-secondary">
                      Sign in before publishing changes to the shared library.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="button-primary shrink-0"
                  onClick={() => setShowAuthModal(true)}
                >
                  Sign in
                </button>
              </div>
            )}

            {error && (
              <div className="mt-8 border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                {error}
              </div>
            )}

            <FormSection
              number="01 / 04"
              title="Identity"
              description="Define how this concept is named, grouped, and calibrated."
            >
              <div className="space-y-5">
                <div>
                  <label className="field-label" htmlFor="card-title">
                    Concept title <span className="text-error">*</span>
                  </label>
                  <input
                    id="card-title"
                    type="text"
                    value={formData.title}
                    onChange={(event) => handleChange('title', event.target.value)}
                    required
                    className="field-control font-display text-base"
                    placeholder="e.g. Breadth-first search"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="card-classification">
                      Classification <span className="text-error">*</span>
                    </label>
                    <select
                      id="card-classification"
                      value={formData.classification}
                      onChange={(event) =>
                        handleClassificationChange(
                          event.target.value as CardClassification,
                        )
                      }
                      required
                      className="field-control cursor-pointer"
                    >
                      {CLASSIFICATIONS.map(classification => (
                        <option key={classification} value={classification}>
                          {formatClassification(classification)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="card-difficulty">
                      Difficulty
                    </label>
                    <select
                      id="card-difficulty"
                      value={formData.difficulty}
                      onChange={(event) =>
                        handleChange('difficulty', event.target.value)
                      }
                      className="field-control cursor-pointer"
                    >
                      <option value="">Unrated</option>
                      {DIFFICULTIES.map(difficulty => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </FormSection>

            <FormSection
              number="02 / 04"
              title="Implementations"
              description="Each language has its own draft. Switching languages preserves the code you entered."
            >
              <div className="overflow-hidden border border-border">
                <div className="flex min-h-[54px] items-center justify-between gap-4 border-b border-border bg-surface-soft px-4">
                  <div>
                    <span className="spec-label block">Source buffer</span>
                    <span className="mt-1 block font-mono text-[0.625rem] text-text-tertiary">
                      main.{selectedLanguage}
                    </span>
                  </div>
                  <label className="flex items-center gap-3">
                    <span className="spec-label hidden sm:inline">Language</span>
                    <select
                      value={selectedLanguage}
                      onChange={(event) =>
                        handleLanguageChange(event.target.value as CardLanguage)
                      }
                      required
                      aria-label="Implementation language"
                      className="h-9 cursor-pointer border border-border-bright bg-background px-3 font-mono text-xs text-text-primary outline-none focus:border-accent"
                    >
                      {LANGUAGES.map(language => (
                        <option key={language} value={language}>
                          {formatLanguage(language)}
                          {implementationDrafts[language] ? ' • drafted' : ''}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-b border-border bg-background px-4 py-3">
                  <span className="spec-label mr-1">Drafts</span>
                  {draftedLanguages.map(language => (
                    <button
                      type="button"
                      key={language}
                      onClick={() => setSelectedLanguage(language)}
                      className={`filter-chip min-h-7 px-2 ${
                        language === selectedLanguage ? 'filter-chip-active' : ''
                      }`}
                    >
                      {formatLanguage(language)}
                    </button>
                  ))}
                </div>

                <CodeEditor
                  key={selectedLanguage}
                  initialCode={
                    selectedDraft?.code || getBoilerplate(selectedLanguage)
                  }
                  language={selectedLanguage}
                  onChange={handleCodeChange}
                  showToolbar={false}
                  showRunButton={false}
                  showOutput={false}
                  height="420px"
                />
              </div>
            </FormSection>

            <FormSection
              number="03 / 04"
              title="Analysis"
              description="Capture a language-agnostic mental model shared by every implementation."
            >
              <div className="space-y-5">
                <div>
                  <label className="field-label" htmlFor="card-explanation">
                    Explanation <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="card-explanation"
                    value={formData.explanation}
                    onChange={(event) =>
                      handleChange('explanation', event.target.value)
                    }
                    required
                    rows={7}
                    className="field-control min-h-[170px] resize-y leading-7"
                    placeholder="Explain the intuition and invariants without tying them to one programming language..."
                  />
                </div>

                {formData.classification === 'data-structures' ? (
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <span className="field-label mb-0">Method complexity</span>
                      <button
                        type="button"
                        onClick={addMethod}
                        className="button-secondary min-h-9 px-3"
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                        Add method
                      </button>
                    </div>

                    {formData.methods.length === 0 ? (
                      <div className="border border-dashed border-border p-5 text-xs leading-5 text-text-tertiary">
                        Add operations such as get, put, push, or pop with their expected
                        time complexity.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.methods.map((method, index) => (
                          <div
                            key={index}
                            className="grid gap-2 border border-border bg-background p-2 sm:grid-cols-[1fr_1fr_auto]"
                          >
                            <input
                              type="text"
                              value={method.name}
                              onChange={(event) =>
                                updateMethod(index, 'name', event.target.value)
                              }
                              className="field-control"
                              placeholder="Method"
                            />
                            <input
                              type="text"
                              value={method.timeComplexity}
                              onChange={(event) =>
                                updateMethod(
                                  index,
                                  'timeComplexity',
                                  event.target.value,
                                )
                              }
                              className="field-control font-mono"
                              placeholder="O(1)"
                            />
                            <button
                              type="button"
                              onClick={() => removeMethod(index)}
                              className="icon-button"
                              aria-label={`Remove method ${index + 1}`}
                            >
                              <TrashIcon className="h-4 w-4 text-error" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-5">
                      <label className="field-label" htmlFor="card-space-complexity">
                        Space complexity
                      </label>
                      <input
                        id="card-space-complexity"
                        type="text"
                        value={formData.spaceComplexity}
                        onChange={(event) =>
                          handleChange('spaceComplexity', event.target.value)
                        }
                        className="field-control font-mono"
                        placeholder="e.g. O(n)"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="field-label" htmlFor="card-time-complexity">
                        Time complexity
                      </label>
                      <input
                        id="card-time-complexity"
                        type="text"
                        value={formData.timeComplexity}
                        onChange={(event) =>
                          handleChange('timeComplexity', event.target.value)
                        }
                        className="field-control font-mono"
                        placeholder="e.g. O(n log n)"
                      />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="card-space-complexity">
                        Space complexity
                      </label>
                      <input
                        id="card-space-complexity"
                        type="text"
                        value={formData.spaceComplexity}
                        onChange={(event) =>
                          handleChange('spaceComplexity', event.target.value)
                        }
                        className="field-control font-mono"
                        placeholder="e.g. O(n)"
                      />
                    </div>
                  </div>
                )}
              </div>
            </FormSection>

            <FormSection
              number="04 / 04"
              title="Retrieval"
              description="Add search signals, practical uses, and practice vectors."
            >
              <div className="space-y-5">
                <div>
                  <label className="field-label" htmlFor="card-tags">
                    Tags
                  </label>
                  <input
                    id="card-tags"
                    type="text"
                    value={formData.tags}
                    onChange={(event) => handleChange('tags', event.target.value)}
                    className="field-control"
                    placeholder="array, graph, divide-and-conquer"
                  />
                  <span className="mt-2 block text-[0.6875rem] text-text-tertiary">
                    Separate tags with commas.
                  </span>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="card-use-cases">
                      Use cases
                    </label>
                    <textarea
                      id="card-use-cases"
                      value={formData.useCases}
                      onChange={(event) =>
                        handleChange('useCases', event.target.value)
                      }
                      rows={5}
                      className="field-control min-h-[140px] resize-y leading-6"
                      placeholder="One use case per line..."
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="card-related-problems">
                      Related problems
                    </label>
                    <textarea
                      id="card-related-problems"
                      value={formData.relatedProblems}
                      onChange={(event) =>
                        handleChange('relatedProblems', event.target.value)
                      }
                      rows={5}
                      className="field-control min-h-[140px] resize-y leading-6"
                      placeholder="One problem or URL per line..."
                    />
                  </div>
                </div>
              </div>
            </FormSection>
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-border bg-surface/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.08em] text-text-tertiary sm:block">
              Fields marked * are required
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="button-secondary flex-1 sm:flex-none"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button-primary flex-1 sm:flex-none"
                disabled={loading || !isAuthenticated}
              >
                {loading
                  ? 'Publishing'
                  : isEditing
                    ? 'Update concept'
                    : 'Publish concept'}
              </button>
            </div>
          </footer>
        </form>
      </Modal>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}
