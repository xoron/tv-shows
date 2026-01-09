import { TVMazeImage, TVMazeShow, TVMazeEpisode, TVMazeSearchResponse } from '../types';

/**
 * Type guard to check if a value is a TVMazeImage
 * @param data - The value to check
 * @returns True if data is a TVMazeImage
 */
export function isTVMazeImage(data: unknown): data is TVMazeImage {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.medium === 'string' &&
    typeof obj.original === 'string'
  );
}

/**
 * Type guard to check if a value is a TVMazeShow
 * @param data - The value to check
 * @returns True if data is a TVMazeShow
 */
export function isTVMazeShow(data: unknown): data is TVMazeShow {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    (typeof obj.summary === 'string' || obj.summary === null) &&
    (obj.image === null || isTVMazeImage(obj.image))
  );
}

/**
 * Type guard to check if a value is a TVMazeEpisode
 * @param data - The value to check
 * @returns True if data is a TVMazeEpisode
 */
export function isTVMazeEpisode(data: unknown): data is TVMazeEpisode {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.id === 'number' &&
    typeof obj.season === 'number' &&
    typeof obj.number === 'number' &&
    typeof obj.name === 'string' &&
    (typeof obj.summary === 'string' || obj.summary === null) &&
    (obj.image === null || isTVMazeImage(obj.image)) &&
    typeof obj.airdate === 'string'
  );
}

/**
 * Type guard to check if a value is a TVMazeSearchResponse
 * @param data - The value to check
 * @returns True if data is a TVMazeSearchResponse
 */
export function isTVMazeSearchResponse(data: unknown): data is TVMazeSearchResponse {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.score === 'number' &&
    isTVMazeShow(obj.show)
  );
}

/**
 * Type guard to check if a value is an array of TVMazeSearchResponse
 * @param data - The value to check
 * @returns True if data is an array of TVMazeSearchResponse
 */
export function isTVMazeSearchResponseArray(data: unknown): data is TVMazeSearchResponse[] {
  return Array.isArray(data) && data.every((item) => isTVMazeSearchResponse(item));
}

/**
 * Type guard to check if a value is an array of TVMazeEpisode
 * @param data - The value to check
 * @returns True if data is an array of TVMazeEpisode
 */
export function isTVMazeEpisodeArray(data: unknown): data is TVMazeEpisode[] {
  return Array.isArray(data) && data.every((item) => isTVMazeEpisode(item));
}

