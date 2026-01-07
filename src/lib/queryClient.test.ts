import { describe, it, expect } from 'vitest';
import { queryClient } from './queryClient';

describe('queryClient', () => {
  it('should be a QueryClient instance', () => {
    expect(queryClient).toBeDefined();
    expect(queryClient.constructor.name).toBe('QueryClient');
  });

  it('should have default query options configured', () => {
    const defaultOptions = queryClient.getDefaultOptions().queries;

    expect(defaultOptions).toBeDefined();
    expect(defaultOptions?.staleTime).toBe(1000 * 60 * 5);
    expect(defaultOptions?.gcTime).toBe(1000 * 60 * 30);
    expect(defaultOptions?.refetchOnWindowFocus).toBe(false);
    expect(defaultOptions?.refetchOnReconnect).toBe(false);
    expect(defaultOptions?.retry).toBe(2);
  });

  it('should have staleTime set to 5 minutes', () => {
    const defaultOptions = queryClient.getDefaultOptions().queries;

    expect(defaultOptions?.staleTime).toBe(300000);
  });

  it('should have gcTime set to 30 minutes', () => {
    const defaultOptions = queryClient.getDefaultOptions().queries;

    expect(defaultOptions?.gcTime).toBe(1800000);
  });

  it('should have refetchOnWindowFocus disabled', () => {
    const defaultOptions = queryClient.getDefaultOptions().queries;

    expect(defaultOptions?.refetchOnWindowFocus).toBe(false);
  });

  it('should have refetchOnReconnect disabled', () => {
    const defaultOptions = queryClient.getDefaultOptions().queries;

    expect(defaultOptions?.refetchOnReconnect).toBe(false);
  });

  it('should have retry set to 2', () => {
    const defaultOptions = queryClient.getDefaultOptions().queries;

    expect(defaultOptions?.retry).toBe(2);
  });

  it('should have no default mutation options', () => {
    const defaultOptions = queryClient.getDefaultOptions();

    expect(defaultOptions?.mutations).toBeUndefined();
  });
});
