import { useQuery } from '@tanstack/react-query';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import { useRef, useMemo } from 'react';
import { getEpisodeDetails } from '../services/tvmaze';
import { Episode } from '../types';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { STALE_TIME_EPISODE, FALLBACK_IMAGE_EPISODE } from '../lib/constants';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorAlert from '../components/ErrorAlert';
import ImageWithFallback from '../components/ImageWithFallback';
import { useFocusOnLoad } from '../hooks/useFocusManagement';
import { sanitizeHtml } from '../utils/sanitizeHtml';

/**
 * Page component that displays detailed information about a specific episode
 * Fetches episode details from the TVMaze API using the episodeId from route params
 * @returns The episode details page
 */
export default function EpisodeDetailsPage() {
  const { episodeId } = useParams<{ episodeId: string }>();
  const location = useLocation();
  const showId = (location.state as { showId?: number })?.showId;

  const {
    data: episode,
    isLoading,
    error,
  } = useQuery<Episode | null, Error>({
    queryKey: ['episode', episodeId, showId],
    queryFn: () => {
      if (!episodeId || !showId) {
        return Promise.resolve(null);
      }
      return getEpisodeDetails(Number(episodeId), showId);
    },
    enabled: !!episodeId && !!showId,
    staleTime: STALE_TIME_EPISODE,
  });

  useDocumentTitle(episode?.title);

  // Memoize aria-label strings to prevent recalculation on every render
  const episodeImageAlt = useMemo(
    () =>
      episode
        ? `Cover image for ${episode.title} - Season ${episode.season}, Episode ${episode.episodeNumber}`
        : '',
    [episode]
  );

  const episodeSummaryAriaLabel = useMemo(
    () => (episode ? `Summary for ${episode.title}` : ''),
    [episode]
  );

  const episodeLoadedAnnouncement = useMemo(
    () =>
      episode
        ? `Episode details loaded: ${episode.title}, Season ${episode.season}, Episode ${episode.episodeNumber}`
        : '',
    [episode]
  );

  const episodeDetailsRef = useRef<HTMLDivElement>(null);
  // Focus episode details when loaded
  useFocusOnLoad(episodeDetailsRef, !isLoading && !!episode);

  if (!episodeId) {
    return <Navigate to="/show" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonLoader variant="show-details" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorAlert title="Error Loading Episode" message={error.message} />;
  }

  if (!episode) {
    return <Navigate to="/show" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb navigation">
          <Link
            to="/show"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors min-h-[44px] min-w-[44px] p-2"
            aria-label="Back to show details"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
        </nav>

        <article
          ref={episodeDetailsRef}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          aria-live="polite"
          aria-atomic="true"
          tabIndex={-1}
        >
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {episodeLoadedAnnouncement}
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <ImageWithFallback
                src={episode.coverImage}
                alt={episodeImageAlt}
                fallback={FALLBACK_IMAGE_EPISODE}
                className="w-full h-48 object-cover md:h-auto md:w-full"
              />
            </div>
            <div className="md:w-1/2 p-6 md:p-8">
              <div
                className="flex items-center gap-2 mb-4"
                role="group"
                aria-label="Episode metadata"
              >
                <span
                  className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded"
                  aria-label={`Season ${episode.season}`}
                >
                  Season {episode.season}
                </span>
                <span
                  className="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded"
                  aria-label={`Episode ${episode.episodeNumber}`}
                >
                  Episode {episode.episodeNumber}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{episode.title}</h1>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Summary</h2>
              <div
                className="text-gray-700 leading-relaxed text-base md:text-lg prose"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(episode.summary) }}
                aria-label={episodeSummaryAriaLabel}
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
