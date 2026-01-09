import { describe, it, expect } from 'vitest';
import {
  isTVMazeImage,
  isTVMazeShow,
  isTVMazeEpisode,
  isTVMazeSearchResponse,
  isTVMazeSearchResponseArray,
  isTVMazeEpisodeArray,
} from './typeGuards';
import {
  mockTVMazeImage,
  mockTVMazeShow,
  mockTVMazeEpisode,
  mockTVMazeSearchResponse,
  mockTVMazeEpisodes,
} from '../test/mocks/data';

describe('isTVMazeImage', () => {
  it('should return true for valid TVMazeImage', () => {
    expect(isTVMazeImage(mockTVMazeImage)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isTVMazeImage(null)).toBe(false);
  });

  it('should return false for non-object', () => {
    expect(isTVMazeImage('string')).toBe(false);
    expect(isTVMazeImage(123)).toBe(false);
    expect(isTVMazeImage(undefined)).toBe(false);
  });

  it('should return false for object missing medium', () => {
    expect(isTVMazeImage({ original: 'url' })).toBe(false);
  });

  it('should return false for object missing original', () => {
    expect(isTVMazeImage({ medium: 'url' })).toBe(false);
  });

  it('should return false for object with wrong types', () => {
    expect(isTVMazeImage({ medium: 123, original: 'url' })).toBe(false);
    expect(isTVMazeImage({ medium: 'url', original: 123 })).toBe(false);
  });
});

describe('isTVMazeShow', () => {
  it('should return true for valid TVMazeShow', () => {
    expect(isTVMazeShow(mockTVMazeShow)).toBe(true);
  });

  it('should return true for TVMazeShow with null image', () => {
    const showWithoutImage = { ...mockTVMazeShow, image: null };
    expect(isTVMazeShow(showWithoutImage)).toBe(true);
  });

  it('should return true for TVMazeShow with null summary', () => {
    const showWithNullSummary = { ...mockTVMazeShow, summary: null };
    expect(isTVMazeShow(showWithNullSummary)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isTVMazeShow(null)).toBe(false);
  });

  it('should return false for non-object', () => {
    expect(isTVMazeShow('string')).toBe(false);
    expect(isTVMazeShow(123)).toBe(false);
  });

  it('should return false for object missing required fields', () => {
    expect(isTVMazeShow({ id: 1, name: 'Test' })).toBe(false);
    expect(isTVMazeShow({ id: 1 })).toBe(false);
    expect(isTVMazeShow({ name: 'Test' })).toBe(false);
  });

  it('should return false for object with wrong types', () => {
    expect(isTVMazeShow({ ...mockTVMazeShow, id: 'string' })).toBe(false);
    expect(isTVMazeShow({ ...mockTVMazeShow, name: 123 })).toBe(false);
  });

  it('should return false for object with invalid image', () => {
    expect(isTVMazeShow({ ...mockTVMazeShow, image: 'invalid' })).toBe(false);
  });
});

describe('isTVMazeEpisode', () => {
  it('should return true for valid TVMazeEpisode', () => {
    expect(isTVMazeEpisode(mockTVMazeEpisode)).toBe(true);
  });

  it('should return true for TVMazeEpisode with null image', () => {
    const episodeWithoutImage = { ...mockTVMazeEpisode, image: null };
    expect(isTVMazeEpisode(episodeWithoutImage)).toBe(true);
  });

  it('should return true for TVMazeEpisode with null summary', () => {
    const episodeWithNullSummary = { ...mockTVMazeEpisode, summary: null };
    expect(isTVMazeEpisode(episodeWithNullSummary)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isTVMazeEpisode(null)).toBe(false);
  });

  it('should return false for non-object', () => {
    expect(isTVMazeEpisode('string')).toBe(false);
    expect(isTVMazeEpisode(123)).toBe(false);
  });

  it('should return false for object missing required fields', () => {
    expect(isTVMazeEpisode({ id: 1, season: 1 })).toBe(false);
    expect(isTVMazeEpisode({ id: 1 })).toBe(false);
  });

  it('should return false for object with wrong types', () => {
    expect(isTVMazeEpisode({ ...mockTVMazeEpisode, id: 'string' })).toBe(false);
    expect(isTVMazeEpisode({ ...mockTVMazeEpisode, season: 'string' })).toBe(false);
    expect(isTVMazeEpisode({ ...mockTVMazeEpisode, number: 'string' })).toBe(false);
    expect(isTVMazeEpisode({ ...mockTVMazeEpisode, airdate: 123 })).toBe(false);
  });
});

describe('isTVMazeSearchResponse', () => {
  it('should return true for valid TVMazeSearchResponse', () => {
    expect(isTVMazeSearchResponse(mockTVMazeSearchResponse)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isTVMazeSearchResponse(null)).toBe(false);
  });

  it('should return false for non-object', () => {
    expect(isTVMazeSearchResponse('string')).toBe(false);
    expect(isTVMazeSearchResponse(123)).toBe(false);
  });

  it('should return false for object missing score', () => {
    expect(isTVMazeSearchResponse({ show: mockTVMazeShow })).toBe(false);
  });

  it('should return false for object missing show', () => {
    expect(isTVMazeSearchResponse({ score: 1.0 })).toBe(false);
  });

  it('should return false for object with invalid show', () => {
    expect(isTVMazeSearchResponse({ score: 1.0, show: 'invalid' })).toBe(false);
  });

  it('should return false for object with wrong score type', () => {
    expect(isTVMazeSearchResponse({ score: 'string', show: mockTVMazeShow })).toBe(false);
  });
});

describe('isTVMazeSearchResponseArray', () => {
  it('should return true for valid array', () => {
    expect(isTVMazeSearchResponseArray([mockTVMazeSearchResponse])).toBe(true);
    expect(isTVMazeSearchResponseArray([])).toBe(true);
  });

  it('should return false for non-array', () => {
    expect(isTVMazeSearchResponseArray(mockTVMazeSearchResponse)).toBe(false);
    expect(isTVMazeSearchResponseArray(null)).toBe(false);
    expect(isTVMazeSearchResponseArray('string')).toBe(false);
  });

  it('should return false for array with invalid items', () => {
    expect(isTVMazeSearchResponseArray([mockTVMazeSearchResponse, 'invalid'])).toBe(false);
    expect(isTVMazeSearchResponseArray([{ score: 1.0 }])).toBe(false);
  });
});

describe('isTVMazeEpisodeArray', () => {
  it('should return true for valid array', () => {
    expect(isTVMazeEpisodeArray(mockTVMazeEpisodes)).toBe(true);
    expect(isTVMazeEpisodeArray([])).toBe(true);
  });

  it('should return false for non-array', () => {
    expect(isTVMazeEpisodeArray(mockTVMazeEpisode)).toBe(false);
    expect(isTVMazeEpisodeArray(null)).toBe(false);
    expect(isTVMazeEpisodeArray('string')).toBe(false);
  });

  it('should return false for array with invalid items', () => {
    expect(isTVMazeEpisodeArray([mockTVMazeEpisode, 'invalid'])).toBe(false);
    expect(isTVMazeEpisodeArray([{ id: 1 }])).toBe(false);
  });
});

