import { useState, useMemo } from 'react';
import { useCards } from './hooks/useCards';
import { useFilters } from './hooks/useFilters';
import { useAuth } from './hooks/useAuth';
import { FilterBar } from './components/FilterBar';
import { CardGrid } from './components/CardGrid';
import { Pagination } from './components/Pagination';
import { CardDetail } from './components/CardDetail';
import { CardFormModal } from './components/CardFormModal';
import { AuthModal } from './components/AuthModal';
import type { Card } from './types/card';
import './App.css';

function App() {
  const { cards, allTags, loading, error, refetch } = useCards();
  const { filters, filteredAndSortedCards, updateFilters, resetFilters } = useFilters(cards);
  const { user, isAuthenticated } = useAuth();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Calculate pagination
  const paginatedCards = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedCards.slice(startIndex, endIndex);
  }, [filteredAndSortedCards, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
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

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-content">
          <div>
            <h1>Chuck's Programming Toolbox</h1>
            <p className="app-subtitle">A collection of algorithms, patterns, and techniques for LeetCode-style problems</p>
          </div>
          <div className="app-header-actions">
            {isAuthenticated ? (
              <>
                <button
                  className="app-create-button"
                  onClick={() => setShowCreateModal(true)}
                >
                  + Create Card
                </button>
                <button
                  className="app-auth-button"
                  onClick={() => setShowAuthModal(true)}
                  title={user?.email || 'Account'}
                >
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.email || 'User'}
                      className="app-user-avatar"
                    />
                  ) : (
                    <span className="app-user-icon">👤</span>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  className="app-create-button app-create-button-disabled"
                  onClick={() => setShowAuthModal(true)}
                  title="Sign in to create cards"
                >
                  + Create Card
                </button>
                <button
                  className="app-auth-button app-auth-button-signin"
                  onClick={() => setShowAuthModal(true)}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {loading && (
          <div className="app-loading">
            <p>Loading cards...</p>
          </div>
        )}

        {error && (
          <div className="app-error">
            <p>Error: {error}</p>
            <button onClick={() => refetch()}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <FilterBar
              filters={filters}
              allTags={allTags}
              onFiltersChange={handleFiltersChange}
              onReset={handleReset}
            />

            <CardGrid cards={paginatedCards} onCardClick={setSelectedCard} />

            <Pagination
              totalItems={filteredAndSortedCards.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newItemsPerPage) => {
                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </main>

      {selectedCard && (
        <CardDetail
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
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
