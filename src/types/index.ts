/**
 * Represents a TV show in the application domain model
 */
export interface Show {
  id: number;
  title: string;
  description: string;
  coverImage: string | null;
}

/**
 * Represents an episode in the application domain model
 */
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

/**
 * Represents an image object from the TVMaze API
 */
export interface TVMazeImage {
  medium: string;
  original: string;
}

/**
 * Represents a show object from the TVMaze API
 */
export interface TVMazeShow {
  id: number;
  name: string;
  summary: string;
  image: TVMazeImage | null;
}

/**
 * Represents an episode object from the TVMaze API
 */
export interface TVMazeEpisode {
  id: number;
  season: number;
  number: number;
  name: string;
  summary: string;
  image: TVMazeImage | null;
  airdate: string;
  _embedded?: {
    show?: {
      id: number;
    };
  };
}

/**
 * Represents a search response from the TVMaze API
 */
export interface TVMazeSearchResponse {
  score: number;
  show: TVMazeShow;
}

/**
 * Transforms a TVMaze show object into the application's Show model
 * @param show - The TVMaze show object to transform
 * @returns The transformed Show object
 */
export function transformShow(show: TVMazeShow): Show {
  return {
    id: show.id,
    title: show.name,
    description: show.summary || 'No description available.',
    coverImage: show.image?.original || null,
  };
}

/**
 * Transforms a TVMaze episode object into the application's Episode model
 * @param episode - The TVMaze episode object to transform
 * @param showId - The ID of the show this episode belongs to
 * @returns The transformed Episode object
 */
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
