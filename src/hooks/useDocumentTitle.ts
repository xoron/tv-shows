import { useEffect } from 'react';
import { DEFAULT_DOCUMENT_TITLE } from '../lib/constants';

/**
 * Custom hook to update the document title based on the provided title
 * @param title - The title to set. If null or undefined, uses the default title
 */
export function useDocumentTitle(title: string | null | undefined) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | TV Shows`;
    } else {
      document.title = DEFAULT_DOCUMENT_TITLE;
    }
  }, [title]);
}