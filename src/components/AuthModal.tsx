import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Don't close modal immediately - wait for redirect
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-surface border-none rounded-lg w-full max-w-md flex flex-col shadow-modal" onClick={(e) => e.stopPropagation()}>
          <div className="p-8">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface border-none rounded-lg w-full max-w-md flex flex-col shadow-modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center px-8 py-6 border-b border-border">
          <h2 className="m-0 text-2xl font-normal text-text-primary">{user ? 'Account' : 'Sign In'}</h2>
          <button className="bg-transparent border-none text-text-tertiary text-[2rem] cursor-pointer leading-none p-0 w-8 h-8 flex items-center justify-center transition-colors duration-200 hover:text-text-primary" onClick={onClose}>×</button>
        </div>

        <div className="p-8">
          {user ? (
            <>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.email || 'User'}
                    className="w-12 h-12 rounded-full border-2 border-border"
                  />
                )}
                <div className="flex-1">
                  <p className="m-0 mb-1 text-text-primary text-base font-medium">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="m-0 text-text-tertiary text-sm">{user.email}</p>
                </div>
              </div>
              <button
                className="w-full px-6 py-3 border-none rounded text-sm font-medium cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 bg-error text-text-primary hover:bg-error-hover"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <p className="text-text-secondary mb-6 text-sm leading-6">
                Sign in with Google to create, edit, and delete cards.
              </p>
              <button
                className="w-full px-6 py-3 border-none rounded text-sm font-medium cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 bg-white text-background hover:bg-[#f8f9fa] hover:shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                onClick={handleSignIn}
              >
                <svg
                  className="flex-shrink-0"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

