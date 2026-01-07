import { Routes, Route, Navigate } from 'react-router-dom';
import ShowDetailsPage from './pages/ShowDetailsPage';
import EpisodeDetailsPage from './pages/EpisodeDetailsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/show" replace />} />
      <Route path="/show" element={<ShowDetailsPage />} />
      <Route path="/show/episode/:episodeId" element={<EpisodeDetailsPage />} />
    </Routes>
  );
}

export default App;
