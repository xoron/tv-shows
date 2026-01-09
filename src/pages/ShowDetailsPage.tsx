import { useQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';
import { searchShow, getShowEpisodes } from '../services/tvmaze';
import { Show, Episode } from '../types';
import EpisodeCard from '../components/EpisodeCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { SHOW_NAME, STALE_TIME_SHOW, STALE_TIME_EPISODE, FALLBACK_IMAGE_SHOW } from '../lib/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import ImageWithFallback from '../components/ImageWithFallback';
import { useFocusOnLoad } from '../hooks/useFocusManagement';

/**
 * Page component that displays show details and a list of episodes
 * Fetches show information and episodes from the TVMaze API
 * @returns The show details page with episodes grid
 */
export default function ShowDetailsPage() {
  const episodesListRef = useRef<HTMLUListElement>(null);
  const { data: show, isLoading: isLoadingShow, error: showError } = useQuery<Show | null, Error>({
    queryKey: ['show', SHOW_NAME],
    queryFn: () => searchShow(SHOW_NAME),
    staleTime: STALE_TIME_SHOW,
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
    staleTime: STALE_TIME_EPISODE,
  });

  useDocumentTitle(show?.title);

  // Focus episodes list when episodes load
  useFocusOnLoad(episodesListRef, !isLoadingEpisodes && episodes.length > 0);

  if (showError) {
    return <ErrorAlert title="Error Loading Show" message={showError.message} />;
  }

  if (isLoadingShow) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner ariaLabel="Loading show information" />
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <ImageWithFallback
                src={show.coverImage}
                alt={`Cover image for ${show.title}`}
                fallback={FALLBACK_IMAGE_SHOW}
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
        </article>

        <section aria-labelledby="episodes-heading">
          <h2 id="episodes-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Episodes
          </h2>

        <div aria-live="polite" aria-atomic="true">
          {episodesError ? (
            <ErrorAlert title="Error loading episodes" message={episodesError.message} variant="inline" />
        ) : isLoadingEpisodes ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner ariaLabel="Loading episodes" />
          </div>
        ) : episodes.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-600 p-8 rounded-lg text-center" role="status" aria-live="polite">
            <p className="text-lg">No episodes available</p>
          </div>
        ) : (
          <>
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {episodes.length} {episodes.length === 1 ? 'episode' : 'episodes'} loaded
            </div>
            <ul
              ref={episodesListRef}
              role="list"
              aria-label={`List of ${episodes.length} ${episodes.length === 1 ? 'episode' : 'episodes'}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              tabIndex={-1}
            >
              {episodes.map((episode) => (
                <li key={episode.id} role="listitem">
                  <EpisodeCard episode={episode} />
                </li>
              ))}
            </ul>
          </>
        )}
        </div>
        </section>
      </div>
    </div>
  );
}