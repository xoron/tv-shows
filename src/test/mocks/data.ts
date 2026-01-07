export interface TVMazeImage {
  medium: string;
  original: string;
}

export interface TVMazeShow {
  id: number;
  name: string;
  summary: string;
  image: TVMazeImage | null;
}

export interface TVMazeEpisode {
  id: number;
  season: number;
  number: number;
  name: string;
  summary: string;
  image: TVMazeImage | null;
  airdate: string;
}

export const mockTVMazeImage: TVMazeImage = {
  medium: 'https://example.com/image-medium.jpg',
  original: 'https://example.com/image-original.jpg',
};

export const mockTVMazeShow: TVMazeShow = {
  id: 1,
  name: 'Test Show',
  summary: '<p>This is a test show</p>',
  image: mockTVMazeImage,
};

export const mockTVMazeShowWithoutImage: TVMazeShow = {
  id: 2,
  name: 'Show Without Image',
  summary: '',
  image: null,
};

export const mockTVMazeEpisode: TVMazeEpisode = {
  id: 1,
  season: 1,
  number: 1,
  name: 'Test Episode',
  summary: '<p>Test episode summary</p>',
  image: mockTVMazeImage,
  airdate: '2024-01-01',
};

export const mockTVMazeEpisodeWithoutImage: TVMazeEpisode = {
  id: 2,
  season: 1,
  number: 2,
  name: 'Episode Without Image',
  summary: '',
  image: null,
  airdate: '2024-01-08',
};

export const mockTVMazeEpisodes: TVMazeEpisode[] = [
  mockTVMazeEpisode,
  mockTVMazeEpisodeWithoutImage,
];

export const mockTVMazeSearchResponse = {
  score: 1.0,
  show: mockTVMazeShow,
};
