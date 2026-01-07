import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../test/utils/test-utils';
import EpisodeCard from './EpisodeCard';
import { mockTVMazeEpisode } from '../test/mocks/data';

describe('EpisodeCard', () => {
  it('should render episode card with all data', () => {
    const mockEpisode = {
      id: 1,
      showId: 1,
      season: 1,
      episodeNumber: 1,
      title: 'Test Episode',
      summary: '<p>Test episode summary</p>',
      coverImage: 'https://example.com/image.jpg',
      airdate: '2024-01-01',
    };

    renderWithRouter(<EpisodeCard episode={mockEpisode} />);

    expect(screen.getByText('Test Episode')).toBeInTheDocument();
    expect(screen.getByText('S1 E1')).toBeInTheDocument();
    expect(screen.getByText('Test episode summary')).toBeInTheDocument();
  });

  it('should display fallback image when coverImage is null', () => {
    const mockEpisodeWithoutImage = {
      id: 1,
      showId: 1,
      season: 1,
      episodeNumber: 1,
      title: 'Test Episode',
      summary: '<p>Test episode summary</p>',
      coverImage: null,
      airdate: '2024-01-01',
    };

    renderWithRouter(<EpisodeCard episode={mockEpisodeWithoutImage} />);

    const image = screen.getByAltText('Test Episode');
    expect(image).toHaveAttribute('src', 'https://placehold.co/600x400/666/white?text=No+Image');
  });

  it('should use coverImage when available', () => {
    const mockEpisodeWithImage = {
      id: 1,
      showId: 1,
      season: 1,
      episodeNumber: 1,
      title: 'Test Episode',
      summary: '<p>Test episode summary</p>',
      coverImage: 'https://example.com/image.jpg',
      airdate: '2024-01-01',
    };

    renderWithRouter(<EpisodeCard episode={mockEpisodeWithImage} />);

    const image = screen.getByAltText('Test Episode');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should display correct season and episode number badge', () => {
    const mockEpisode = {
      id: 1,
      showId: 1,
      season: 2,
      episodeNumber: 5,
      title: 'Test Episode',
      summary: '<p>Test episode summary</p>',
      coverImage: null,
      airdate: '2024-01-01',
    };

    renderWithRouter(<EpisodeCard episode={mockEpisode} />);

    expect(screen.getByText('S2 E5')).toBeInTheDocument();
  });

  it('should render Link component with correct route', () => {
    const mockEpisode = {
      id: 42,
      showId: 1,
      season: 1,
      episodeNumber: 1,
      title: 'Test Episode',
      summary: '<p>Test episode summary</p>',
      coverImage: null,
      airdate: '2024-01-01',
    };

    renderWithRouter(<EpisodeCard episode={mockEpisode} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/show/episode/42');
  });

  it('should apply correct CSS classes', () => {
    const mockEpisode = {
      id: 1,
      showId: 1,
      season: 1,
      episodeNumber: 1,
      title: 'Test Episode',
      summary: '<p>Test episode summary</p>',
      coverImage: null,
      airdate: '2024-01-01',
    };

    const { container } = renderWithRouter(<EpisodeCard episode={mockEpisode} />);

    const link = container.querySelector('a');
    expect(link).toHaveClass('block', 'bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden');

    const image = container.querySelector('img');
    expect(image).toHaveClass('w-full', 'h-48', 'object-cover');
  });

  it('should handle empty summary with default text', () => {
    const mockEpisodeWithEmptySummary = {
      id: 1,
      showId: 1,
      season: 1,
      episodeNumber: 1,
      title: 'Test Episode',
      summary: '',
      coverImage: null,
      airdate: '2024-01-01',
    };

    renderWithRouter(<EpisodeCard episode={mockEpisodeWithEmptySummary} />);

    expect(screen.getByText('Test Episode')).toBeInTheDocument();
  });

  it('should render HTML content in summary', () => {
    const mockEpisodeWithHTML = {
      id: 1,
      showId: 1,
      season: 1,
      episodeNumber: 1,
      title: 'Test Episode',
      summary: '<p><strong>Bold</strong> text</p>',
      coverImage: null,
      airdate: '2024-01-01',
    };

    renderWithRouter(<EpisodeCard episode={mockEpisodeWithHTML} />);

    expect(screen.getByText(/Bold/)).toBeInTheDocument();
    expect(screen.getByText(/text/)).toBeInTheDocument();
  });
});
