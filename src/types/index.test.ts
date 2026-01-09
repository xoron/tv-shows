import { describe, it, expect } from 'vitest';
import { transformShow, transformEpisode, Show, Episode } from './index';
import { mockTVMazeShow, mockTVMazeEpisode, mockTVMazeEpisodeWithoutImage } from '../test/mocks/data';

describe('transformShow', () => {
  it('should transform a TVMaze show to Show format with all fields', () => {
    const result = transformShow(mockTVMazeShow);

    expect(result).toEqual({
      id: 1,
      title: 'Test Show',
      description: '<p>This is a test show</p>',
      coverImage: 'https://example.com/image-original.jpg',
    });
  });

  it('should return null coverImage when image is null', () => {
    const showWithoutImage = {
      id: 2,
      name: 'Show Without Image',
      summary: 'Some summary',
      image: null,
    };

    const result = transformShow(showWithoutImage);

    expect(result.coverImage).toBeNull();
  });

  it('should use default description when summary is empty', () => {
    const showWithEmptySummary = {
      id: 3,
      name: 'Empty Summary Show',
      summary: '',
      image: mockTVMazeShow.image,
    };

    const result = transformShow(showWithEmptySummary);

    expect(result.description).toBe('No description available.');
  });

  it('should use default description when summary is null', () => {
    const showWithNullSummary = {
      id: 3,
      name: 'Null Summary Show',
      summary: null as unknown as string,
      image: mockTVMazeShow.image,
    };

    const result = transformShow(showWithNullSummary);

    expect(result.description).toBe('No description available.');
  });

  it('should use original image URL when available', () => {
    const result = transformShow(mockTVMazeShow);

    expect(result.coverImage).toBe('https://example.com/image-original.jpg');
  });

  it('should preserve HTML content in description', () => {
    const showWithHTML = {
      id: 4,
      name: 'HTML Show',
      summary: '<p><strong>Bold</strong> text</p>',
      image: null,
    };

    const result = transformShow(showWithHTML);

    expect(result.description).toBe('<p><strong>Bold</strong> text</p>');
  });

  it('should return type Show', () => {
    const result: Show = transformShow(mockTVMazeShow);

    expect(result).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(typeof result.title).toBe('string');
    expect(typeof result.description).toBe('string');
  });
});

describe('transformEpisode', () => {
  it('should transform a TVMaze episode to Episode format with all fields', () => {
    const showId = 1;
    const result = transformEpisode(mockTVMazeEpisode, showId);

    expect(result).toEqual({
      id: 1,
      showId: 1,
      season: 1,
      episodeNumber: 1,
      title: 'Test Episode',
      summary: '<p>Test episode summary</p>',
      coverImage: 'https://example.com/image-original.jpg',
      airdate: '2024-01-01',
    });
  });

  it('should return null coverImage when image is null', () => {
    const result = transformEpisode(mockTVMazeEpisodeWithoutImage, 1);

    expect(result.coverImage).toBeNull();
  });

  it('should use default summary when summary is empty', () => {
    const episodeWithEmptySummary = {
      id: 3,
      season: 1,
      number: 3,
      name: 'Empty Summary Episode',
      summary: '',
      image: mockTVMazeEpisodeWithoutImage.image,
      airdate: '2024-01-15',
    };

    const result = transformEpisode(episodeWithEmptySummary, 1);

    expect(result.summary).toBe('No summary available.');
  });

  it('should use default summary when summary is null', () => {
    const episodeWithNullSummary = {
      id: 3,
      season: 1,
      number: 3,
      name: 'Null Summary Episode',
      summary: null as unknown as string,
      image: mockTVMazeEpisodeWithoutImage.image,
      airdate: '2024-01-15',
    };

    const result = transformEpisode(episodeWithNullSummary, 1);

    expect(result.summary).toBe('No summary available.');
  });

  it('should use original image URL when available', () => {
    const result = transformEpisode(mockTVMazeEpisode, 1);

    expect(result.coverImage).toBe('https://example.com/image-original.jpg');
  });

  it('should correctly assign showId parameter', () => {
    const showId = 42;
    const result = transformEpisode(mockTVMazeEpisode, showId);

    expect(result.showId).toBe(42);
  });

  it('should preserve airdate field', () => {
    const result = transformEpisode(mockTVMazeEpisode, 1);

    expect(result.airdate).toBe('2024-01-01');
  });

  it('should return type Episode', () => {
    const result: Episode = transformEpisode(mockTVMazeEpisode, 1);

    expect(result).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(typeof result.showId).toBe('number');
    expect(typeof result.season).toBe('number');
    expect(typeof result.episodeNumber).toBe('number');
    expect(typeof result.title).toBe('string');
    expect(typeof result.summary).toBe('string');
    expect(typeof result.airdate).toBe('string');
  });
});
