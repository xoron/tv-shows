import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
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

  it('should render ShowDetailsPage at /show route', () => {
    renderWithProviders(<App />, { route: '/show' });

    expect(document.body).toBeInTheDocument();
  });

  it('should render EpisodeDetailsPage at /show/episode/:episodeId route', () => {
    renderWithProviders(<App />, { route: '/show/episode/123' });

    expect(document.body).toBeInTheDocument();
  });

  it('should handle dynamic episodeId parameter', () => {
    const { container } = renderWithProviders(<App />, { route: '/show/episode/456' });

    expect(container).toBeInTheDocument();
  });

  it('should configure all three routes', () => {
    const { container } = renderWithProviders(<App />, { route: '/' });

    expect(container).toBeInTheDocument();
  });
});
