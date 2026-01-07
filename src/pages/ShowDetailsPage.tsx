import { showData, episodesData } from '../data/mockData';
import EpisodeCard from '../components/EpisodeCard';

export default function ShowDetailsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img
                src={showData.coverImage}
                alt={showData.title}
                className="w-full h-auto object-cover md:h-full"
              />
            </div>
            <div className="md:w-2/3 p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {showData.title}
              </h1>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                {showData.description}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Episodes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodesData.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      </div>
    </div>
  );
}
