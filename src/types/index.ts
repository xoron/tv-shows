export interface Show {
  id: number;
  title: string;
  description: string;
  coverImage: string | null;
}

export interface Episode {
  id: number;
  showId: number;
  season: number;
  episodeNumber: number;
  title: string;
  summary: string;
  coverImage: string | null;
  airdate: string;
}

interface TVMazeImage {
  medium: string;
  original: string;
}

interface TVMazeShow {
  id: number;
  name: string;
  summary: string;
  image: TVMazeImage | null;
}

interface TVMazeEpisode {
  id: number;
  season: number;
  number: number;
  name: string;
  summary: string;
  image: TVMazeImage | null;
  airdate: string;
}

export function transformShow(show: TVMazeShow): Show {
  return {
    id: show.id,
    title: show.name,
    description: show.summary || 'No description available.',
    coverImage: show.image?.original || null,
  };
}

export function transformEpisode(episode: TVMazeEpisode, showId: number): Episode {
  return {
    id: episode.id,
    showId,
    season: episode.season,
    episodeNumber: episode.number,
    title: episode.name,
    summary: episode.summary || 'No summary available.',
    coverImage: episode.image?.original || null,
    airdate: episode.airdate,
  };
}
