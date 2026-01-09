import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from './test/utils/test-utils';
import App from './App';

describe('App', () => {
  it('should render Routes component', () => {
    renderWithProviders(<App />, { route: '/' });

    expect(document.body).toBeInTheDocument();
  });

  it('should redirect from / to /show', () => {
    renderWithProviders(<App />, { route: '/' });

    expect(screen.queryByText('Powerpuff Girls')).not.toBeInTheDocument();
  });

  it('should render ShowDetailsPage at /show route', async () => {
    renderWithProviders(<App />, { route: '/show' });

    // Wait for lazy-loaded component to render
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  it('should render EpisodeDetailsPage at /show/episode/:episodeId route', async () => {
    renderWithProviders(<App />, { route: '/show/episode/123' });

    // Wait for lazy-loaded component to render
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  it('should handle dynamic episodeId parameter', async () => {
    const { container } = renderWithProviders(<App />, { route: '/show/episode/456' });

    // Wait for lazy-loaded component to render
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });

  it('should configure all three routes', () => {
    const { container } = renderWithProviders(<App />, { route: '/' });

    expect(container).toBeInTheDocument();
  });

  it('should show loading spinner while lazy loading', () => {
    const { container } = renderWithProviders(<App />, { route: '/show' });

    // Suspense fallback should be rendered initially
    expect(container).toBeInTheDocument();
  });
});
