import type { User } from '@supabase/supabase-js';
import { PlusIcon, UserIcon } from './ui/Icons';

interface SiteHeaderProps {
  user: User | null;
  isAuthenticated: boolean;
  onCreate: () => void;
  onAccount: () => void;
}

export function SiteHeader({
  user,
  isAuthenticated,
  onCreate,
  onAccount,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="site-container flex h-[72px] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <a
            href="#top"
            aria-label="Return to Toolbox home"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-border-bright bg-[#f1eee7] transition-colors hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <img
              src="/cblogo.png"
              alt=""
              className="h-full w-full scale-[1.75] object-cover"
            />
          </a>
          <div className="min-w-0">
            <a
              href="#top"
              className="block truncate font-display text-base font-semibold uppercase tracking-[0.12em] text-text-primary no-underline"
            >
              Toolbox
            </a>
            <span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.14em] text-text-tertiary sm:block">
              Charles Bai / Systems Library
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          <a
            href="#library"
            className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-text-secondary no-underline transition-colors hover:text-accent"
          >
            Library
          </a>
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-text-tertiary">
            DSA / 001
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="button-primary hidden sm:inline-flex"
            onClick={onCreate}
          >
            <PlusIcon className="h-4 w-4" />
            New concept
          </button>
          <button
            type="button"
            className="icon-button overflow-hidden"
            onClick={onAccount}
            title={user?.email || 'Sign in'}
            aria-label={isAuthenticated ? 'Open account' : 'Sign in'}
          >
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon className="h-[18px] w-[18px]" />
            )}
          </button>
          <button
            type="button"
            className="button-primary h-11 w-11 px-0 sm:hidden"
            onClick={onCreate}
            aria-label="Create a concept card"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
