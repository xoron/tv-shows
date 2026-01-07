import { Link } from 'react-router-dom';
import { Episode } from '../types';

interface EpisodeCardProps {
  episode: Episode;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Link
      to={`/show/episode/${episode.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <img
        src={episode.coverImage}
        alt={episode.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
            S{episode.season} E{episode.episodeNumber}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {episode.title}
        </h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {episode.summary}
        </p>
      </div>
    </Link>
  );
}
