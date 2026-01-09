import { Routes, Route, Navigate } from 'react-router-dom';
import ShowDetailsPage from './pages/ShowDetailsPage';
import EpisodeDetailsPage from './pages/EpisodeDetailsPage';
import { useFocusManagement } from './hooks/useFocusManagement';

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
        <Routes>
          <Route path="/" element={<Navigate to="/show" replace />} />
          <Route path="/show" element={<ShowDetailsPage />} />
          <Route path="/show/episode/:episodeId" element={<EpisodeDetailsPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
