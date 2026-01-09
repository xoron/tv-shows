import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchShow, getShowEpisodes, getShowDetails, getEpisodeDetails } from './tvmaze';
import {
  mockTVMazeShow,
  mockTVMazeEpisode,
  mockTVMazeEpisodes,
  mockTVMazeSearchResponse,
} from '../test/mocks/data';

const globalFetch = globalThis.fetch;

describe('searchShow', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = globalFetch;
  });

  it('should return transformed show when search succeeds', async () => {
    const mockResponse = { ok: true, json: async () => [mockTVMazeSearchResponse] };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    const result = await searchShow('Powerpuff Girls');

    expect(result).toEqual({
      id: 1,
      title: 'Test Show',
      description: '<p>This is a test show</p>',
      coverImage: 'https://example.com/image-original.jpg',
    });
  });

  it('should return null when search returns empty results', async () => {
    const mockResponse = { ok: true, json: async () => [] };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    const result = await searchShow('NonExistentShow');

    expect(result).toBeNull();
  });

  it('should return first result when multiple shows are found', async () => {
    const multipleShows = [
      mockTVMazeSearchResponse,
      { score: 0.9, show: { ...mockTVMazeShow, id: 2, name: 'Second Show' } },
    ];
    const mockResponse = { ok: true, json: async () => multipleShows };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    const result = await searchShow('Multiple Results');

    expect(result?.id).toBe(1);
    expect(result?.title).toBe('Test Show');
  });

  it('should throw error when API request fails', async () => {
    const mockResponse = { ok: false, statusText: 'Not Found' };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    await expect(searchShow('TestShow')).rejects.toThrow('API request failed: Not Found');
  });

  it('should throw error when network fails', async () => {
    vi.mocked(globalThis.fetch).mockRejectedValue(new Error('Network Error'));

    await expect(searchShow('TestShow')).rejects.toThrow('Network Error');
  });

  it('should properly encode query parameter', async () => {
    const mockResponse = { ok: true, json: async () => [] };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    await searchShow('Test Show with Spaces');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent('Test Show with Spaces'))
    );
  });

  it('should throw error when JSON parsing fails', async () => {
    const mockResponse = {
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    await expect(searchShow('TestShow')).rejects.toThrow('Invalid JSON');
  });

  it('should throw error when API returns invalid response structure', async () => {
    const mockResponse = { ok: true, json: async () => 'invalid' };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    await expect(searchShow('TestShow')).rejects.toThrow(
      'Invalid API response: expected array of search results'
    );
  });

  // Note: Line 41 in tvmaze.ts is technically unreachable because isTVMazeSearchResponseArray
  // already validates the show structure. However, we keep the explicit check for clarity.
  // To test this, we would need to bypass the type guard, which is not practical.
  // The type guard ensures type safety, so this redundant check serves as a safety net.

  it('should throw error when API returns array with invalid show data', async () => {
    const mockResponse = { ok: true, json: async () => [{ score: 1.0, show: 'invalid' }] };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    await expect(searchShow('TestShow')).rejects.toThrow(
      'Invalid API response: expected array of search results'
    );
  });
});

describe('getShowEpisodes', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = globalFetch;
  });

  it('should return array of transformed episodes', async () => {
    const mockResponse = { ok: true, json: async () => mockTVMazeEpisodes };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    const result = await getShowEpisodes(1);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
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

  it('should return empty array when no episodes exist', async () => {
    const mockResponse = { ok: true, json: async () => [] };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    const result = await getShowEpisodes(1);

    expect(result).toEqual([]);
  });

  it('should throw error when API request fails', async () => {
    const mockResponse = { ok: false, statusText: 'Internal Server Error' };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    await expect(getShowEpisodes(1)).rejects.toThrow('API request failed: Internal Server Error');
  });

  it('should throw error when network fails', async () => {
    vi.mocked(globalThis.fetch).mockRejectedValue(new Error('Network Error'));

    await expect(getShowEpisodes(1)).rejects.toThrow('Network Error');
  });

  it('should use correct API endpoint', async () => {
    const mockResponse = { ok: true, json: async () => [] };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    await getShowEpisodes(42);

    expect(globalThis.fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows/42/episodes');
  });

  it('should throw error when API returns invalid response structure', async () => {
    const mockResponse = { ok: true, json: async () => 'invalid' };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    await expect(getShowEpisodes(1)).rejects.toThrow(
      'Invalid API response: expected array of episodes'
    );
  });

  it('should throw error when API returns array with invalid episode data', async () => {
    const mockResponse = { ok: true, json: async () => [{ id: 1, invalid: 'data' }] };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    await expect(getShowEpisodes(1)).rejects.toThrow(
      'Invalid API response: expected array of episodes'
    );
  });
});

describe('getShowDetails', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = globalFetch;
  });

  it('should return transformed show details', async () => {
    const mockResponse = { ok: true, json: async () => mockTVMazeShow };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    const result = await getShowDetails(1);

    expect(result).toEqual({
      id: 1,
      title: 'Test Show',
      description: '<p>This is a test show</p>',
      coverImage: 'https://example.com/image-original.jpg',
    });
  });

  it('should throw error when API request fails', async () => {
    const mockResponse = { ok: false, statusText: 'Not Found' };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    await expect(getShowDetails(1)).rejects.toThrow('API request failed: Not Found');
  });

  it('should throw error when network fails', async () => {
    vi.mocked(globalThis.fetch).mockRejectedValue(new Error('Network Error'));

    await expect(getShowDetails(1)).rejects.toThrow('Network Error');
  });

  it('should use correct API endpoint', async () => {
    const mockResponse = { ok: true, json: async () => mockTVMazeShow };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    await getShowDetails(42);

    expect(globalThis.fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows/42');
  });

  it('should handle show without image', async () => {
    const showWithoutImage = { ...mockTVMazeShow, image: null };
    const mockResponse = { ok: true, json: async () => showWithoutImage };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    const result = await getShowDetails(1);

    expect(result.coverImage).toBeNull();
  });

  it('should throw error when API returns invalid response structure', async () => {
    const mockResponse = { ok: true, json: async () => 'invalid' };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    await expect(getShowDetails(1)).rejects.toThrow('Invalid API response: show data is invalid');
  });
});

describe('getEpisodeDetails', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = globalFetch;
  });

  it('should return transformed episode details', async () => {
    const mockResponse = { ok: true, json: async () => mockTVMazeEpisode };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    const result = await getEpisodeDetails(1, 42);

    expect(result).toEqual({
      id: 1,
      showId: 42,
      season: 1,
      episodeNumber: 1,
      title: 'Test Episode',
      summary: '<p>Test episode summary</p>',
      coverImage: 'https://example.com/image-original.jpg',
      airdate: '2024-01-01',
    });
  });

  it('should throw error when API request fails', async () => {
    const mockResponse = { ok: false, statusText: 'Not Found' };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    await expect(getEpisodeDetails(1, 42)).rejects.toThrow('API request failed: Not Found');
  });

  it('should throw error when network fails', async () => {
    vi.mocked(globalThis.fetch).mockRejectedValue(new Error('Network Error'));

    await expect(getEpisodeDetails(1, 42)).rejects.toThrow('Network Error');
  });

  it('should use correct API endpoint', async () => {
    const mockResponse = { ok: true, json: async () => mockTVMazeEpisode };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    await getEpisodeDetails(42, 1);

    expect(globalThis.fetch).toHaveBeenCalledWith('https://api.tvmaze.com/episodes/42');
  });

  it('should use provided showId in transformed episode', async () => {
    const mockResponse = { ok: true, json: async () => mockTVMazeEpisode };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    const result = await getEpisodeDetails(1, 99);

    expect(result?.showId).toBe(99);
  });

  it('should throw error when API returns invalid response structure', async () => {
    const mockResponse = { ok: true, json: async () => 'invalid' };
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as any);

    await expect(getEpisodeDetails(1, 42)).rejects.toThrow(
      'Invalid API response: episode data is invalid'
    );
  });
});
