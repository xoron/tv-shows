import { useParams, Link, Navigate } from 'react-router-dom';
import { episodesData } from '../data/mockData';

export default function EpisodeDetailsPage() {
  const { episodeId } = useParams<{ episodeId: string }>();
  
  const episode = episodesData.find((ep) => ep.id === episodeId);

  if (!episode) {
    return <Navigate to="/show" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/show"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Show
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <img
                src={episode.coverImage}
                alt={episode.title}
                className="w-full h-auto object-cover md:h-full"
              />
            </div>
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded">
                  Season {episode.season}
                </span>
                <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded">
                  Episode {episode.episodeNumber}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {episode.title}
              </h1>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Summary
              </h2>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                {episode.summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
