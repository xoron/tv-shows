import { Link } from 'react-router-dom';
import { Episode } from '../types';

interface EpisodeCardProps {
  episode: Episode;
}

const fallbackImage = 'https://placehold.co/600x400/666/white?text=No+Image';

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Link
      to={`/show/episode/${episode.id}`}
      state={{ showId: episode.showId }}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 min-h-[200px]"
      aria-label={`View details for ${episode.title} - Season ${episode.season}, Episode ${episode.episodeNumber}`}
    >
      <img
        src={episode.coverImage || fallbackImage}
        alt={`Cover image for ${episode.title}`}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
            S{episode.season} E{episode.episodeNumber}
          </span>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1" aria-level={3}>
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
