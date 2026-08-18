import { useState } from 'react';
import type { Card } from '../types/card';
import { useAuth } from '../hooks/useAuth';
import { deleteCard } from '../services/cardService';
import {
  formatClassification,
  formatLanguage,
  getDifficultyColor,
} from '../utils/constants';
import { AuthModal } from './AuthModal';
import { CardFormModal } from './CardFormModal';
import { CodeEditor } from './CodeEditor';
import {
  ArrowUpRightIcon,
  CodeIcon,
  EditIcon,
  LayersIcon,
  TrashIcon,
  XIcon,
} from './ui/Icons';
import { Modal } from './ui/Modal';

interface CardDetailProps {
  card: Card;
  onClose: () => void;
  onCardUpdated?: () => void | Promise<void>;
}

type Section = 'briefing' | 'code' | 'applications' | 'related';

const SECTIONS: readonly { id: Section; label: string; number: string }[] = [
  { id: 'briefing', label: 'Briefing', number: '01' },
  { id: 'code', label: 'Code lab', number: '02' },
  { id: 'applications', label: 'Applications', number: '03' },
  { id: 'related', label: 'Related', number: '04' },
] as const;

function EmptySection({ children }: { children: string }) {
  return (
    <div className="border border-dashed border-border p-8 text-sm leading-6 text-text-tertiary">
      {children}
    </div>
  );
}

export function CardDetail({ card, onClose, onCardUpdated }: CardDetailProps) {
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('briefing');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
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
    setDeleteError(null);
    try {
      await deleteCard(card.id);
      onClose();
      await onCardUpdated?.();
    } catch (error) {
      console.error('Error deleting card:', error);
      setDeleteError(error instanceof Error ? error.message : 'Unable to delete this card.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCardUpdated = async () => {
    await onCardUpdated?.();
    setShowEditModal(false);
  };

  const renderBriefing = () => (
    <div className="mx-auto w-full max-w-[980px]">
      <div className="mb-10">
        <span className="spec-label mb-4 block text-accent">Concept briefing</span>
        <h2 className="m-0 font-display text-4xl font-medium uppercase leading-none tracking-[-0.04em] text-text-primary sm:text-5xl">
          Core idea
        </h2>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <p className="m-0 whitespace-pre-wrap text-base leading-8 text-text-secondary sm:text-lg sm:leading-9">
            {card.explanation}
          </p>

          {card.methods && card.methods.length > 0 && (
            <div className="mt-12">
              <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                <h3 className="m-0 font-display text-xl font-medium text-text-primary">
                  Method profile
                </h3>
                <span className="spec-label">{card.methods.length} operations</span>
              </div>
              <div className="divide-y divide-border border-b border-border">
                {card.methods.map((method, index) => (
                  <div
                    key={`${method.name}-${index}`}
                    className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 py-4"
                  >
                    <span className="font-mono text-[0.625rem] text-text-tertiary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-sm text-text-primary">{method.name}</span>
                    <span className="metadata-chip">{method.timeComplexity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside>
          <span className="spec-label mb-3 block">Performance envelope</span>
          <div className="border border-border">
            <div className="border-b border-border p-5">
              <span className="spec-label block">Time</span>
              <strong className="mt-2 block font-mono text-lg font-medium text-text-primary">
                {card.timeComplexity || 'Variable'}
              </strong>
            </div>
            <div className="p-5">
              <span className="spec-label block">Space</span>
              <strong className="mt-2 block font-mono text-lg font-medium text-text-primary">
                {card.spaceComplexity || 'Variable'}
              </strong>
            </div>
          </div>

          <div className="mt-8">
            <span className="spec-label mb-3 block">Signal tags</span>
            <div className="flex flex-wrap gap-2">
              {card.tags.map(tag => (
                <span key={tag} className="metadata-chip">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );

  const renderCodeLab = () => (
    <div className="mx-auto w-full max-w-[1100px]">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="spec-label mb-3 block text-accent">Remote execution lab</span>
          <h2 className="m-0 font-display text-3xl font-medium uppercase tracking-[-0.035em] text-text-primary sm:text-4xl">
            Inspect. Modify. Run.
          </h2>
        </div>
        <p className="m-0 max-w-sm text-xs leading-5 text-text-tertiary">
          Changes made here are temporary. Reset restores the saved implementation.
        </p>
      </div>
      <CodeEditor
        key={`${card.id}-${card.language}`}
        initialCode={card.code}
        language={card.language || 'python'}
        height="min(620px, 65vh)"
      />
    </div>
  );

  const renderApplications = () => (
    <div className="mx-auto w-full max-w-[900px]">
      <span className="spec-label mb-4 block text-accent">Operational context</span>
      <h2 className="m-0 mb-10 font-display text-4xl font-medium uppercase leading-none tracking-[-0.04em] text-text-primary sm:text-5xl">
        Where it fits
      </h2>

      {card.useCases && card.useCases.length > 0 ? (
        <ol className="m-0 list-none border-t border-border p-0">
          {card.useCases.map((useCase, index) => (
            <li
              key={`${useCase}-${index}`}
              className="grid gap-4 border-b border-border py-6 sm:grid-cols-[4rem_1fr]"
            >
              <span className="font-mono text-xs text-accent">
                / {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-base leading-7 text-text-secondary">{useCase}</span>
            </li>
          ))}
        </ol>
      ) : (
        <EmptySection>No application notes have been added for this concept yet.</EmptySection>
      )}
    </div>
  );

  const renderRelated = () => (
    <div className="mx-auto w-full max-w-[900px]">
      <span className="spec-label mb-4 block text-accent">Practice vectors</span>
      <h2 className="m-0 mb-10 font-display text-4xl font-medium uppercase leading-none tracking-[-0.04em] text-text-primary sm:text-5xl">
        Related problems
      </h2>

      {card.relatedProblems && card.relatedProblems.length > 0 ? (
        <div className="border-t border-border">
          {card.relatedProblems.map((problem, index) => {
            const isLink = /^https?:\/\//i.test(problem);
            const content = (
              <>
                <span className="font-mono text-xs text-text-tertiary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-sm text-text-primary sm:text-base">
                  {problem}
                </span>
                <ArrowUpRightIcon className="h-4 w-4 text-text-tertiary" />
              </>
            );

            return isLink ? (
              <a
                key={`${problem}-${index}`}
                href={problem}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 border-b border-border px-1 py-5 no-underline transition-colors hover:bg-surface-soft sm:px-4"
              >
                {content}
              </a>
            ) : (
              <div
                key={`${problem}-${index}`}
                className="flex items-center gap-4 border-b border-border px-1 py-5 sm:px-4"
              >
                {content}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptySection>No related practice problems have been linked yet.</EmptySection>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'briefing':
        return renderBriefing();
      case 'code':
        return renderCodeLab();
      case 'applications':
        return renderApplications();
      case 'related':
        return renderRelated();
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        onClose={onClose}
        labelledBy="card-detail-title"
        className="flex h-[calc(100vh-1.5rem)] w-full max-w-[1480px] flex-col overflow-hidden sm:h-[min(92vh,960px)]"
      >
        <header className="flex shrink-0 items-start justify-between gap-5 border-b border-border px-5 py-5 sm:items-center sm:px-7">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="spec-label text-accent">
                {formatClassification(card.classification)}
              </span>
              <span className="h-3 w-px bg-border-bright" />
              <span className="spec-label">{formatLanguage(card.language || 'python')}</span>
            </div>
            <h1
              id="card-detail-title"
              className="m-0 truncate font-display text-2xl font-medium tracking-[-0.035em] text-text-primary sm:text-3xl"
            >
              {card.title}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  type="button"
                  className="button-secondary hidden sm:inline-flex"
                  onClick={handleEdit}
                >
                  <EditIcon className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  className={showDeleteConfirm ? 'button-danger' : 'button-ghost'}
                  onClick={handleDelete}
                  disabled={isDeleting}
                  title={showDeleteConfirm ? 'Click again to confirm deletion' : 'Delete card'}
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">
                    {showDeleteConfirm
                      ? isDeleting
                        ? 'Deleting'
                        : 'Confirm'
                      : 'Delete'}
                  </span>
                </button>
              </>
            )}
            <button
              type="button"
              className="icon-button"
              onClick={onClose}
              aria-label="Close concept"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </header>

        {deleteError && (
          <div className="shrink-0 border-b border-error/30 bg-error/10 px-6 py-3 text-sm text-error">
            {deleteError}
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <aside className="shrink-0 border-b border-border bg-background md:w-[230px] md:border-b-0 md:border-r">
            <nav
              className="flex overflow-x-auto p-2 md:flex-col md:p-4"
              aria-label="Concept sections"
            >
              {SECTIONS.map(section => (
                <button
                  type="button"
                  key={section.id}
                  className={`group flex min-w-max items-center gap-3 border px-3 py-3 text-left font-mono text-[0.6875rem] uppercase tracking-[0.08em] transition-colors md:w-full ${
                    activeSection === section.id
                      ? 'border-accent bg-accent text-background'
                      : 'border-transparent text-text-secondary hover:border-border hover:bg-surface hover:text-text-primary'
                  }`}
                  onClick={() => setActiveSection(section.id)}
                  aria-current={activeSection === section.id ? 'page' : undefined}
                >
                  <span
                    className={
                      activeSection === section.id
                        ? 'text-background/60'
                        : 'text-text-tertiary'
                    }
                  >
                    {section.number}
                  </span>
                  {section.label}
                </button>
              ))}
            </nav>

            <div className="hidden border-t border-border p-5 md:block">
              <span className="spec-label mb-4 block">Card telemetry</span>
              <dl className="m-0 space-y-4">
                <div>
                  <dt className="font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary">
                    Difficulty
                  </dt>
                  <dd className="mb-0 mt-1 flex items-center gap-2 font-mono text-xs uppercase text-text-secondary">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: getDifficultyColor(card.difficulty) }}
                    />
                    {card.difficulty || 'Unrated'}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary">
                    Language
                  </dt>
                  <dd className="mb-0 mt-1 font-mono text-xs text-text-secondary">
                    {formatLanguage(card.language || 'python')}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary">
                    Runtime
                  </dt>
                  <dd className="mb-0 mt-1 flex items-center gap-2 font-mono text-xs text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Available
                  </dd>
                </div>
              </dl>
            </div>
          </aside>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-10 sm:px-8 md:px-10 md:py-12">
            <div className="mb-8 flex items-center gap-2 md:hidden">
              {activeSection === 'code' ? (
                <CodeIcon className="h-4 w-4 text-accent" />
              ) : (
                <LayersIcon className="h-4 w-4 text-accent" />
              )}
              <span className="spec-label">{activeSection}</span>
            </div>
            {renderContent()}
          </div>
        </div>
      </Modal>

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
    </>
  );
}
