import { Link } from 'react-router-dom';
import { Episode } from '../types';
import { FALLBACK_IMAGE_EPISODE } from '../lib/constants';
import ImageWithFallback from './ImageWithFallback';

interface EpisodeCardProps {
  episode: Episode;
}

/**
 * Component that displays an episode card with episode information
 * @param episode - The episode data to display
 * @returns A clickable card component linking to the episode details page
 */
export default function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Link
      to={`/show/episode/${episode.id}`}
      state={{ showId: episode.showId }}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 min-h-[200px] w-full"
      aria-label={`View details for ${episode.title} - Season ${episode.season}, Episode ${episode.episodeNumber}`}
    >
      <ImageWithFallback
        src={episode.coverImage}
        alt={`Cover image for ${episode.title}`}
        fallback={FALLBACK_IMAGE_EPISODE}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 episode-card-content">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
            S{episode.season} E{episode.episodeNumber}
          </span>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {episode.title}
        </h2>
        <p
          className="text-sm text-gray-600 mt-2 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: episode.summary }}
        />
      </div>
    </Link>
  );
}
