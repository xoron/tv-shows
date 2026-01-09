import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useFocusManagement } from './hooks/useFocusManagement';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load page components for code splitting
const ShowDetailsPage = lazy(() => import('./pages/ShowDetailsPage'));
const EpisodeDetailsPage = lazy(() => import('./pages/EpisodeDetailsPage'));

function App() {
  useFocusManagement();

  return (
    <>
      <nav aria-label="Skip navigation">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Skip to main content
        </a>
      </nav>
      <main id="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
              <LoadingSpinner ariaLabel="Loading page" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Navigate to="/show" replace />} />
            <Route path="/show" element={<ShowDetailsPage />} />
            <Route path="/show/episode/:episodeId" element={<EpisodeDetailsPage />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

export default App;
