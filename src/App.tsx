import { useMemo, useState } from 'react';

import { useCards } from './hooks/useCards';
import { useFilters } from './hooks/useFilters';
import { useAuth } from './hooks/useAuth';

import { FilterBar } from './components/FilterBar';
import { CardGrid, CardGridSkeleton } from './components/CardGrid';
import { Pagination } from './components/Pagination';
import { CardDetail } from './components/CardDetail';
import { CardFormModal } from './components/CardFormModal';
import { AuthModal } from './components/AuthModal';
import { Hero } from './components/Hero';
import { SiteHeader } from './components/SiteHeader';
import { ArrowUpRightIcon, RefreshIcon } from './components/ui/Icons';
import { CLASSIFICATIONS, LANGUAGES } from './utils/constants';

function App() {
  const { cards, allTags, loading, error, refetch } = useCards();
  const { filters, filteredAndSortedCards, updateFilters, resetFilters } = useFilters(cards);
  const { user, isAuthenticated } = useAuth();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const selectedCard = useMemo(
    () => cards.find(card => card.id === selectedCardId) || null,
    [cards, selectedCardId],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedCards.length / itemsPerPage),
  );
  const activePage = Math.min(currentPage, totalPages);

  const paginatedCards = useMemo(() => {
    const startIndex = (activePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedCards.slice(startIndex, endIndex);
  }, [activePage, filteredAndSortedCards, itemsPerPage]);

  const handleFiltersChange = (updates: Parameters<typeof updateFilters>[0]) => {
    updateFilters(updates);
    setCurrentPage(1);
  };

  const handleReset = () => {
    resetFilters();
    setCurrentPage(1);
  };

  const handleCardCreated = async () => {
    await refetch();
  };

  const handleCreate = () => {
    if (isAuthenticated) {
      setShowCreateModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleExplore = () => {
    document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRandomCard = () => {
    if (cards.length === 0) return;
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    setSelectedCardId(randomCard.id);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <a
        href="#library"
        className="fixed left-4 top-4 z-[1100] -translate-y-24 bg-accent px-4 py-3 font-mono text-xs font-medium uppercase text-background transition-transform focus:translate-y-0"
      >
        Skip to library
      </a>

      <SiteHeader
        user={user}
        isAuthenticated={isAuthenticated}
        onCreate={handleCreate}
        onAccount={() => setShowAuthModal(true)}
      />

      <Hero
        cardCount={cards.length}
        languageCount={LANGUAGES.length}
        classificationCount={CLASSIFICATIONS.length}
        onExplore={handleExplore}
        onRandom={handleRandomCard}
      />

      <main id="library" className="site-container scroll-mt-24 py-16 sm:py-24">
        <div className="mb-10 grid gap-5 border-b border-border pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="spec-label mb-4 block text-accent">Knowledge index / 001</span>
            <h2 className="m-0 max-w-3xl font-display text-4xl font-medium uppercase leading-none tracking-[-0.04em] text-text-primary sm:text-5xl">
              Concept library
            </h2>
            <p className="mb-0 mt-4 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
              Search the collection by domain, difficulty, or implementation detail.
              Every entry is built to move from theory to executable code.
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-text-tertiary">
            <span className="h-px w-10 bg-border-bright" />
            {filteredAndSortedCards.length} indexed
          </div>
        </div>

        {loading && (
          <CardGridSkeleton />
        )}

        {error && (
          <div className="panel flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
            <span className="spec-label mb-4 text-error">Connection interrupted</span>
            <h3 className="m-0 font-display text-2xl font-medium text-text-primary">
              The library could not be loaded
            </h3>
            <p className="mb-0 mt-3 max-w-lg text-sm leading-6 text-text-secondary">
              {error}
            </p>
            <button
              type="button"
              className="button-secondary mt-7"
              onClick={() => refetch()}
            >
              <RefreshIcon className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <FilterBar
              filters={filters}
              allTags={allTags}
              resultCount={filteredAndSortedCards.length}
              totalCount={cards.length}
              onFiltersChange={handleFiltersChange}
              onReset={handleReset}
            />

            <CardGrid
              cards={paginatedCards}
              startIndex={(activePage - 1) * itemsPerPage}
              onCardClick={(card) => setSelectedCardId(card.id)}
              onReset={handleReset}
            />

            <Pagination
              totalItems={filteredAndSortedCards.length}
              itemsPerPage={itemsPerPage}
              currentPage={activePage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newItemsPerPage) => {
                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </main>

      <footer className="border-t border-border">
        <div className="site-container grid gap-8 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <a
              href="#top"
              className="font-display text-lg font-semibold uppercase tracking-[0.12em] text-text-primary no-underline"
            >
              Toolbox
            </a>
            <p className="mb-0 mt-2 max-w-lg text-xs leading-5 text-text-tertiary">
              An interactive DSA codex designed and built by Charles Bai. Concepts are
              meant to be read, changed, and run.
            </p>
          </div>
          <a
            href="https://github.com/CharlesBai-blc/toolbox"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-text-secondary no-underline transition-colors hover:text-accent"
          >
            View source
            <ArrowUpRightIcon className="h-4 w-4" />
          </a>
        </div>
      </footer>

      {selectedCard && (
        <CardDetail
          card={selectedCard}
          onClose={() => setSelectedCardId(null)}
          onCardUpdated={handleCardCreated}
        />
      )}

      {showCreateModal && (
        <CardFormModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCardCreated}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

export default App;
