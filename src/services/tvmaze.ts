import { Show, Episode, transformShow, transformEpisode } from '../types';

const API_BASE_URL = 'https://api.tvmaze.com';

interface TVMazeShow {
  id: number;
  name: string;
  summary: string;
  image: { medium: string; original: string } | null;
}

interface TVMazeEpisode {
  id: number;
  season: number;
  number: number;
  name: string;
  summary: string;
  image: { medium: string; original: string } | null;
  airdate: string;
}

interface TVMazeSearchResponse {
  score: number;
  show: TVMazeShow;
}

export async function searchShow(query: string): Promise<Show | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data: TVMazeSearchResponse[] = await response.json();
    
    if (data.length === 0) {
      return null;
    }
    
    return transformShow(data[0].show);
  } catch (error) {
    console.error('Error searching for show:', error);
    throw error;
  }
}

export async function getShowEpisodes(showId: number): Promise<Episode[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/shows/${showId}/episodes`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data: TVMazeEpisode[] = await response.json();
    
    return data.map((episode) => transformEpisode(episode, showId));
  } catch (error) {
    console.error('Error fetching episodes:', error);
    throw error;
  }
}

export async function getShowDetails(showId: number): Promise<Show> {
  try {
    const response = await fetch(`${API_BASE_URL}/shows/${showId}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data: TVMazeShow = await response.json();
    
    return transformShow(data);
  } catch (error) {
    console.error('Error fetching show details:', error);
    throw error;
  }
}

export async function getEpisodeDetails(episodeId: number): Promise<Episode | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/episodes/${episodeId}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data: TVMazeEpisode = await response.json();
    
    return transformEpisode(data, 0);
  } catch (error) {
    console.error('Error fetching episode details:', error);
    throw error;
  }
}
