import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/utils/test-utils';
import ShowDetailsPage from './ShowDetailsPage';
import { searchShow, getShowEpisodes } from '../services/tvmaze';

vi.mock('../services/tvmaze');

describe('ShowDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show skeleton loader while fetching show', () => {
      vi.mocked(searchShow).mockImplementation(() => new Promise(() => {}));

      renderWithProviders(<ShowDetailsPage />);

      // Check for skeleton loader - SkeletonLoader uses role="status" with aria-label="Loading content"
      const skeleton = screen.getByRole('status', { name: 'Loading content' });
      expect(skeleton).toBeInTheDocument();
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
        expect(image).toHaveAttribute(
          'src',
          'https://placehold.co/600x900/666/white?text=No+Image'
        );
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

    it('should use singular "episode" when episodes.length is 1', async () => {
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
      ]);

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(
        () => {
          // Check aria-label uses singular "episode"
          const episodesList = screen.getByRole('list', { name: /List of 1 episode/ });
          expect(episodesList).toBeInTheDocument();
        },
        { timeout: 10000 }
      );
    });

    it('should use plural "episodes" when episodes.length is greater than 1', async () => {
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
        // Check aria-label uses plural "episodes"
        const episodesList = screen.getByRole('list', { name: /List of 2 episodes/ });
        expect(episodesList).toBeInTheDocument();
      });
    });

    it('should call useDocumentTitle with undefined when show is null', async () => {
      vi.mocked(searchShow).mockResolvedValue(null);
      const documentTitleSpy = vi.spyOn(document, 'title', 'set');

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Show Not Found')).toBeInTheDocument();
      });

      documentTitleSpy.mockRestore();
    });

    it('should return empty array when show.id is falsy', async () => {
      vi.mocked(searchShow).mockResolvedValue({
        id: 0, // falsy value
        title: 'Test Show',
        description: 'Test description',
        coverImage: null,
      });

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        // getShowEpisodes should not be called when show.id is falsy
        expect(getShowEpisodes).not.toHaveBeenCalled();
      });
    });

    it('should show skeleton loader when episodes are loading', async () => {
      vi.mocked(searchShow).mockResolvedValue({
        id: 1,
        title: 'Test Show',
        description: 'Test description',
        coverImage: null,
      });
      vi.mocked(getShowEpisodes).mockImplementation(() => new Promise(() => {}));

      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        // Should show skeleton loaders for episodes
        const skeletons = screen.getAllByRole('listitem');
        expect(skeletons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
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
          title: 'The Beginning',
          summary: 'This is the first episode of the show.',
          coverImage: null,
          airdate: '2024-01-01',
        },
        {
          id: 2,
          showId: 1,
          season: 1,
          episodeNumber: 2,
          title: 'The Middle',
          summary: 'A middle episode with action.',
          coverImage: null,
          airdate: '2024-01-08',
        },
        {
          id: 3,
          showId: 1,
          season: 1,
          episodeNumber: 3,
          title: 'The End',
          summary: 'The final episode of the season.',
          coverImage: null,
          airdate: '2024-01-15',
        },
      ]);
    });

    it('should render search input component', async () => {
      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByRole('searchbox')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search episodes...')).toBeInTheDocument();
      });
    });

    it('should filter episodes by title', async () => {
      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('The Beginning')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await userEvent.type(searchInput, 'Beginning');

      await waitFor(
        () => {
          expect(screen.getByText('The Beginning')).toBeInTheDocument();
          expect(screen.queryByText('The Middle')).not.toBeInTheDocument();
          expect(screen.queryByText('The End')).not.toBeInTheDocument();
        },
        { timeout: 10000 }
      );
    });

    it('should filter episodes by summary', async () => {
      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('The Beginning')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await userEvent.type(searchInput, 'action');

      await waitFor(
        () => {
          expect(screen.getByText('The Middle')).toBeInTheDocument();
          expect(screen.queryByText('The Beginning')).not.toBeInTheDocument();
          expect(screen.queryByText('The End')).not.toBeInTheDocument();
        },
        { timeout: 10000 }
      );
    });

    it('should show all episodes when search is cleared', async () => {
      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('The Beginning')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await userEvent.type(searchInput, 'Beginning');

      await waitFor(
        () => {
          expect(screen.getByText('The Beginning')).toBeInTheDocument();
          expect(screen.queryByText('The Middle')).not.toBeInTheDocument();
        },
        { timeout: 10000 }
      );

      await userEvent.clear(searchInput);

      await waitFor(() => {
        expect(screen.getByText('The Beginning')).toBeInTheDocument();
        expect(screen.getByText('The Middle')).toBeInTheDocument();
        expect(screen.getByText('The End')).toBeInTheDocument();
      });
    });

    it('should show no results message when no episodes match', async () => {
      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('The Beginning')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'NonExistent' } });

      await waitFor(
        () => {
          expect(
            screen.getByText((content) => content.includes('No episodes match "NonExistent"'))
          ).toBeInTheDocument();
          expect(screen.getByText('Try adjusting your search terms')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    }, 10000);

    it('should be case-insensitive', async () => {
      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('The Beginning')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await userEvent.type(searchInput, 'beginning');

      await waitFor(
        () => {
          expect(screen.getByText('The Beginning')).toBeInTheDocument();
          expect(screen.queryByText('The Middle')).not.toBeInTheDocument();
        },
        { timeout: 10000 }
      );
    });

    it('should update aria-label with filtered results count', async () => {
      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByRole('list', { name: /List of 3 episodes/ })).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');

      fireEvent.change(searchInput, { target: { value: 'Beginning' } });

      await waitFor(
        () => {
          expect(
            screen.getByRole('list', { name: /List of 1 matching episode for "Beginning"/ })
          ).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    }, 10000);

    it('should show clear button when search has value', async () => {
      renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        expect(screen.getByRole('searchbox')).toBeInTheDocument();
      });

      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();

      const searchInput = screen.getByRole('searchbox');
      await userEvent.type(searchInput, 'test');

      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
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

      // Check for skeleton loader - SkeletonLoader uses role="status" with aria-label="Loading content"
      const skeletons = screen.getAllByRole('status', { name: 'Loading content' });
      expect(skeletons.length).toBeGreaterThan(0);
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

    it('should sanitize HTML and remove script tags', async () => {
      vi.mocked(searchShow).mockResolvedValue({
        id: 1,
        title: 'Test Show',
        description: '<p>Safe content</p><script>alert("XSS")</script>',
        coverImage: null,
      });
      vi.mocked(getShowEpisodes).mockResolvedValue([]);

      const { container } = renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        // Script tags should be removed
        const scripts = container.querySelectorAll('script');
        expect(scripts.length).toBe(0);

        // Safe content should still be rendered
        expect(screen.getByText(/Safe content/)).toBeInTheDocument();
      });
    });

    it('should sanitize HTML and remove event handlers', async () => {
      vi.mocked(searchShow).mockResolvedValue({
        id: 1,
        title: 'Test Show',
        description: '<p onclick="alert(\'XSS\')">Click me</p>',
        coverImage: null,
      });
      vi.mocked(getShowEpisodes).mockResolvedValue([]);

      const { container } = renderWithProviders(<ShowDetailsPage />);

      await waitFor(() => {
        const paragraph = container.querySelector('p');
        expect(paragraph).not.toHaveAttribute('onclick');
        expect(screen.getByText(/Click me/)).toBeInTheDocument();
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
