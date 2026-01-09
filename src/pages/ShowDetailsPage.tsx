import { useQuery } from '@tanstack/react-query';
import { searchShow, getShowEpisodes } from '../services/tvmaze';
import { Show, Episode } from '../types';
import EpisodeCard from '../components/EpisodeCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const SHOW_NAME = 'Powerpuff Girls';

export default function ShowDetailsPage() {
  const { data: show, isLoading: isLoadingShow, error: showError } = useQuery<Show | null, Error>({
    queryKey: ['show', SHOW_NAME],
    queryFn: () => searchShow(SHOW_NAME),
    staleTime: 1000 * 60 * 30,
  });

  const { data: episodes = [], isLoading: isLoadingEpisodes, error: episodesError } = useQuery<Episode[], Error>({
    queryKey: ['episodes', show?.id],
    queryFn: () => {
      if (!show?.id) {
        return Promise.resolve([]);
      }
      return getShowEpisodes(show.id);
    },
    enabled: !!show?.id,
    staleTime: 1000 * 60 * 60,
  });

  useDocumentTitle(show?.title);

  if (showError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md" role="alert" aria-live="assertive">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Show</h2>
          <p className="text-gray-700">{showError.message}</p>
        </div>
      </div>
    );
  }

  if (isLoadingShow) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          role="status"
          aria-label="Loading show information"
          aria-busy="true"
        >
          <span className="sr-only">Loading show information</span>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md" role="status">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Show Not Found</h2>
          <p className="text-gray-700">Could not find "{SHOW_NAME}" in the TVMaze database.</p>
        </div>
      </div>
    );
  }

  const fallbackImage = 'https://placehold.co/600x900/666/white?text=No+Image';

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img
                src={show.coverImage || fallbackImage}
                alt={`Cover image for ${show.title}`}
                className="w-full h-64 object-cover md:h-auto md:w-full"
              />
            </div>
            <div className="md:w-2/3 p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {show.title}
              </h1>
              <div
                className="text-gray-700 leading-relaxed text-base md:text-lg prose"
                dangerouslySetInnerHTML={{ __html: show.description }}
              />
            </div>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Episodes
        </h2>

        <div aria-live="polite" aria-atomic="true">
          {episodesError ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6" role="alert" aria-live="assertive">
            <p className="font-semibold">Error loading episodes</p>
            <p className="text-sm">{episodesError.message}</p>
          </div>
        ) : isLoadingEpisodes ? (
          <div className="flex justify-center py-12">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
              role="status"
              aria-label="Loading episodes"
              aria-busy="true"
            >
              <span className="sr-only">Loading episodes</span>
            </div>
          </div>
        ) : episodes.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-600 p-8 rounded-lg text-center" role="status">
            <p className="text-lg">No episodes available</p>
          </div>
        ) : (
          <ul role="list" aria-label="List of episodes" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodes.map((episode) => (
              <li key={episode.id} role="listitem">
                <EpisodeCard episode={episode} />
              </li>
            ))}
          </ul>
        )}
        </div>
      </div>
    </div>
  );
}