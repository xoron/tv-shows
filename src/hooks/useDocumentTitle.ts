import { useEffect } from 'react';

const DEFAULT_TITLE = 'TV Shows - Browse Episodes';

export function useDocumentTitle(title: string | null | undefined) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | TV Shows`;
    } else {
      document.title = DEFAULT_TITLE;
    }
  }, [title]);
}