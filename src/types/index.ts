export interface Show {
  id: string;
  title: string;
  description: string;
  coverImage: string;
}

export interface Episode {
  id: string;
  showId: string;
  season: number;
  episodeNumber: number;
  title: string;
  summary: string;
  coverImage: string;
}
