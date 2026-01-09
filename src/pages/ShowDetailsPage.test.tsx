import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test/utils/test-utils';
import ShowDetailsPage from './ShowDetailsPage';
import { searchShow, getShowEpisodes } from '../services/tvmaze';

vi.mock('../services/tvmaze');

describe('ShowDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading spinner while fetching show', () => {
      vi.mocked(searchShow).mockImplementation(() => new Promise(() => {}));

      renderWithProviders(<ShowDetailsPage />);

      // Check for loading spinner - LoadingSpinner uses aria-label="Loading show information" when loading show
      const spinner = document.querySelector('[role="status"][aria-busy="true"]');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error card when show query fails', async () => {
      vi.mocked(searchShow).mockRejectedValue(new Error('Network Error'));

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Error Loading Show')).toBeInTheDocument();
        expect(screen.getByText('Network Error')).toBeInTheDocument();
      });
    });

    it('should show error banner when episodes query fails', async () => {
      vi.mocked(searchShow).mockResolvedValue({
        id: 1,
        title: 'Test Show',
        description: 'Test description',
        coverImage: 'url',
      });
      vi.mocked(getShowEpisodes).mockRejectedValue(new Error('Episodes Error'));

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Error loading episodes')).toBeInTheDocument();
        expect(screen.getByText('Episodes Error')).toBeInTheDocument();
      });
    });
  });

  describe('Success State', () => {
    it('should render show details correctly', async () => {
      vi.mocked(searchShow).mockResolvedValue({
        id: 1,
        title: 'Test Show',
        description: '<p>Test description</p>',
        coverImage: 'https://example.com/image.jpg',
      });
      vi.mocked(getShowEpisodes).mockResolvedValue([]);

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Show')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
      });
    });

    it('should use fallback image when coverImage is null', async () => {
      vi.mocked(searchShow).mockResolvedValue({
        id: 1,
        title: 'Test Show',
        description: 'Test description',
        coverImage: null,
      });
      vi.mocked(getShowEpisodes).mockResolvedValue([]);

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        const image = screen.getByAltText('Cover image for Test Show');
        expect(image).toHaveAttribute('src', 'https://placehold.co/600x900/666/white?text=No+Image');
      });
    });

    it('should display "Show Not Found" when show is null', async () => {
      vi.mocked(searchShow).mockResolvedValue(null);

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Show Not Found')).toBeInTheDocument();
        expect(screen.getByText(/Could not find/)).toBeInTheDocument();
      });
    });

    it('should render episode grid when episodes are loaded', async () => {
      vi.mocked(searchShow).mockResolvedValue({
        id: 1,
        title: 'Test Show',
        description: 'Test description',
        coverImage: null,
      });
      vi.mocked(getShowEpisodes).mockResolvedValue([
        {
          id: 1,
          showId: 1,
          season: 1,
          episodeNumber: 1,
          title: 'Episode 1',
          summary: 'Summary 1',
          coverImage: null,
          airdate: '2024-01-01',
        },
        {
          id: 2,
          showId: 1,
          season: 1,
          episodeNumber: 2,
          title: 'Episode 2',
          summary: 'Summary 2',
          coverImage: null,
          airdate: '2024-01-08',
        },
      ]);

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Episode 1')).toBeInTheDocument();
        expect(screen.getByText('Episode 2')).toBeInTheDocument();
      });
    });

    it('should show "No episodes available" when episodes array is empty', async () => {
      vi.mocked(searchShow).mockResolvedValue({
        id: 1,
        title: 'Test Show',
        description: 'Test description',
        coverImage: null,
      });
      vi.mocked(getShowEpisodes).mockResolvedValue([]);

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('No episodes available')).toBeInTheDocument();
      });
    });
  });

  describe('Query Behavior', () => {
    it('should call searchShow on mount', () => {
      vi.mocked(searchShow).mockResolvedValue({
        id: 1,
        title: 'Test Show',
        description: 'Test description',
        coverImage: null,
      });

      renderWithProviders(<ShowDetailsPage />);

      expect(searchShow).toHaveBeenCalledWith('Powerpuff Girls');
    });

    it('should not call getShowEpisodes when show is null', async () => {
      vi.mocked(searchShow).mockResolvedValue(null);

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(searchShow).toHaveBeenCalled();
      });

      expect(getShowEpisodes).not.toHaveBeenCalled();
    });

    it('should call getShowEpisodes when show id exists', async () => {
      vi.mocked(searchShow).mockResolvedValue({
        id: 1,
        title: 'Test Show',
        description: 'Test description',
        coverImage: null,
      });
      vi.mocked(getShowEpisodes).mockResolvedValue([]);

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(searchShow).toHaveBeenCalled();
        expect(getShowEpisodes).toHaveBeenCalledWith(1);
      });
    });

    it('should show loading spinner while fetching episodes', async () => {
      vi.mocked(searchShow).mockResolvedValue({
        id: 1,
        title: 'Test Show',
        description: 'Test description',
        coverImage: null,
      });
      vi.mocked(getShowEpisodes).mockImplementation(() => new Promise(() => {}));

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Episodes')).toBeInTheDocument();
      });

      // Check for loading spinner - LoadingSpinner uses aria-label="Loading show information" when loading show
      const spinner = document.querySelector('[role="status"][aria-busy="true"]');
      expect(spinner).toBeInTheDocument();
    });

    it('should render HTML content in description', async () => {
      vi.mocked(searchShow).mockResolvedValue({
        id: 1,
        title: 'Test Show',
        description: '<p><strong>Bold</strong> text</p>',
        coverImage: null,
      });
      vi.mocked(getShowEpisodes).mockResolvedValue([]);

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText(/Bold/)).toBeInTheDocument();
        expect(screen.getByText(/text/)).toBeInTheDocument();
      });
    });

    it('should render "Episodes" heading', async () => {
      vi.mocked(searchShow).mockResolvedValue({
        id: 1,
        title: 'Test Show',
        description: 'Test description',
        coverImage: null,
      });
      vi.mocked(getShowEpisodes).mockResolvedValue([]);

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Episodes')).toBeInTheDocument();
      });
    });
  });
});
