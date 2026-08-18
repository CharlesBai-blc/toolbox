import { useMemo, useState } from 'react';
import type {
  Card,
  CardImplementation,
  CardLanguage,
} from '../types/card';
import {
  createCardImplementation,
  deleteCardImplementation,
  updateCardImplementation,
} from '../services/cardService';
import { getBoilerplate, isBoilerplateOnly } from '../utils/codeBoilerplate';
import { LANGUAGES, formatLanguage } from '../utils/constants';
import { CodeEditor } from './CodeEditor';
import { TrashIcon, XIcon } from './ui/Icons';
import { Modal } from './ui/Modal';

interface ImplementationFormModalProps {
  card: Card;
  implementation?: CardImplementation;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export function ImplementationFormModal({
  card,
  implementation,
  onClose,
  onSuccess,
}: ImplementationFormModalProps) {
  const isEditing = Boolean(implementation);
  const languageOptions = useMemo(() => {
    const existingLanguages = new Set(
      card.implementations
        .filter(item => item.id !== implementation?.id)
        .map(item => item.language),
    );
    return LANGUAGES.filter(language => !existingLanguages.has(language));
  }, [card.implementations, implementation?.id]);

  const initialLanguage =
    implementation?.language || languageOptions[0] || ('python' as CardLanguage);
  const [language, setLanguage] = useState<CardLanguage>(initialLanguage);
  const [code, setCode] = useState(
    implementation?.code || getBoilerplate(initialLanguage),
  );
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = (nextLanguage: CardLanguage) => {
    const shouldReplaceCode = !code.trim() || isBoilerplateOnly(code, language);
    setLanguage(nextLanguage);
    if (shouldReplaceCode) {
      setCode(getBoilerplate(nextLanguage));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (implementation) {
        await updateCardImplementation(implementation.id, {
          language,
          code: code.trim(),
        });
      } else {
        await createCardImplementation(card.id, {
          language,
          code: code.trim(),
        });
      }
      await onSuccess();
      onClose();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to save implementation.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!implementation) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await deleteCardImplementation(implementation.id, card.id);
      await onSuccess();
      onClose();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to delete implementation.',
      );
      setConfirmDelete(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      labelledBy="implementation-form-title"
      closeOnBackdrop={!loading}
      className="flex h-[calc(100vh-1.5rem)] w-full max-w-[980px] flex-col overflow-hidden sm:h-[min(88vh,820px)]"
    >
      <header className="flex shrink-0 items-start justify-between gap-5 border-b border-border px-5 py-5 sm:items-center sm:px-7">
        <div>
          <span className="spec-label mb-2 block text-accent">
            {isEditing ? 'Implementation maintenance' : 'Runtime expansion'}
          </span>
          <h2
            id="implementation-form-title"
            className="m-0 font-display text-2xl font-medium tracking-[-0.035em] text-text-primary"
          >
            {isEditing ? 'Edit implementation' : 'Add implementation'}
          </h2>
          <p className="mb-0 mt-2 text-xs text-text-tertiary">{card.title}</p>
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close implementation editor"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </header>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          {error && (
            <div className="mb-5 border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          <div className="overflow-hidden border border-border">
            <div className="flex min-h-[58px] items-center justify-between gap-4 border-b border-border bg-surface-soft px-4">
              <div>
                <span className="spec-label block">Implementation</span>
                <span className="mt-1 block font-mono text-[0.625rem] text-text-tertiary">
                  One language per concept
                </span>
              </div>
              <label className="flex items-center gap-3">
                <span className="spec-label hidden sm:inline">Language</span>
                <select
                  value={language}
                  onChange={event =>
                    handleLanguageChange(event.target.value as CardLanguage)
                  }
                  className="h-9 cursor-pointer border border-border-bright bg-background px-3 font-mono text-xs text-text-primary outline-none focus:border-accent"
                  aria-label="Implementation language"
                >
                  {languageOptions.map(option => (
                    <option key={option} value={option}>
                      {formatLanguage(option)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <CodeEditor
              initialCode={code}
              language={language}
              onChange={setCode}
              showToolbar={false}
              showRunButton={false}
              showOutput={false}
              height="470px"
            />
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-surface/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            {implementation && (
              <button
                type="button"
                className={confirmDelete ? 'button-danger' : 'button-ghost'}
                onClick={handleDelete}
                disabled={loading || card.implementations.length <= 1}
                title={
                  card.implementations.length <= 1
                    ? 'Every card must keep one implementation'
                    : undefined
                }
              >
                <TrashIcon className="h-4 w-4" />
                {confirmDelete ? 'Confirm delete' : 'Delete'}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="button-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button-primary"
              disabled={loading || !code.trim()}
            >
              {loading ? 'Saving' : isEditing ? 'Save changes' : 'Add language'}
            </button>
          </div>
        </footer>
      </form>
    </Modal>
  );
}
