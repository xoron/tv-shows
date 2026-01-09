/**
 * Application-wide constants
 */

/** Stale time for show queries (30 minutes) */
export const STALE_TIME_SHOW = 1000 * 60 * 30;

/** Stale time for episode queries (60 minutes) */
export const STALE_TIME_EPISODE = 1000 * 60 * 60;

/** Default stale time for queries (5 minutes) */
export const STALE_TIME_DEFAULT = 1000 * 60 * 5;

/** Default garbage collection time for queries (30 minutes) */
export const GC_TIME_DEFAULT = 1000 * 60 * 30;

/** Fallback image URL for shows */
export const FALLBACK_IMAGE_SHOW = 'https://placehold.co/600x900/666/white?text=No+Image';

/** Fallback image URL for episodes */
export const FALLBACK_IMAGE_EPISODE = 'https://placehold.co/600x400/666/white?text=No+Image';

/** Default document title */
export const DEFAULT_DOCUMENT_TITLE = 'TV Shows - Browse Episodes';

/** Default show name to search for */
export const SHOW_NAME = 'Powerpuff Girls';
