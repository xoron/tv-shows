import {
  Show,
  Episode,
  transformShow,
  transformEpisode,
  TVMazeShow,
  TVMazeEpisode,
  TVMazeSearchResponse,
} from '../types';
import {
  isTVMazeSearchResponseArray,
  isTVMazeEpisodeArray,
  isTVMazeShow,
  isTVMazeEpisode,
} from '../utils/typeGuards';

const API_BASE_URL = 'https://api.tvmaze.com';

/**
 * Searches for a TV show by query string.
 * @param query - The search query string
 * @returns The first matching show or null if no results found
 * @throws Error if the API request fails or response is invalid
 */
export async function searchShow(query: string): Promise<Show | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data: unknown = await response.json();
    
    if (!isTVMazeSearchResponseArray(data)) {
      throw new Error('Invalid API response: expected array of search results');
    }
    
    if (data.length === 0) {
      return null;
    }
    
    if (!isTVMazeShow(data[0].show)) {
      throw new Error('Invalid API response: show data is invalid');
    }
    
    return transformShow(data[0].show);
  } catch (error) {
    console.error('Error searching for show:', error);
    throw error;
  }
}

/**
 * Fetches all episodes for a given show.
 * @param showId - The ID of the show
 * @returns Array of episodes for the show
 * @throws Error if the API request fails or response is invalid
 */
export async function getShowEpisodes(showId: number): Promise<Episode[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/shows/${showId}/episodes`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data: unknown = await response.json();
    
    if (!isTVMazeEpisodeArray(data)) {
      throw new Error('Invalid API response: expected array of episodes');
    }
    
    return data.map((episode) => transformEpisode(episode, showId));
  } catch (error) {
    console.error('Error fetching episodes:', error);
    throw error;
  }
}

/**
 * Fetches show details by show ID.
 * @param showId - The ID of the show
 * @returns The show details
 * @throws Error if the API request fails or response is invalid
 */
export async function getShowDetails(showId: number): Promise<Show> {
  try {
    const response = await fetch(`${API_BASE_URL}/shows/${showId}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data: unknown = await response.json();
    
    if (!isTVMazeShow(data)) {
      throw new Error('Invalid API response: show data is invalid');
    }
    
    return transformShow(data);
  } catch (error) {
    console.error('Error fetching show details:', error);
    throw error;
  }
}

/**
 * Fetches episode details by episode ID.
 * @param episodeId - The ID of the episode to fetch
 * @param showId - The ID of the show this episode belongs to
 * @returns The episode details or null if not found
 * @throws Error if the API request fails or response is invalid
 */
export async function getEpisodeDetails(episodeId: number, showId: number): Promise<Episode | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/episodes/${episodeId}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data: unknown = await response.json();
    
    if (!isTVMazeEpisode(data)) {
      throw new Error('Invalid API response: episode data is invalid');
    }
    
    return transformEpisode(data, showId);
  } catch (error) {
    console.error('Error fetching episode details:', error);
    throw error;
  }
}
