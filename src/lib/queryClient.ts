import { QueryClient } from '@tanstack/react-query';
import { STALE_TIME_DEFAULT, GC_TIME_DEFAULT } from './constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_DEFAULT,
      gcTime: GC_TIME_DEFAULT,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 2,
    },
  },
});
