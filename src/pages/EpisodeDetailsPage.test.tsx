import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test/utils/test-utils';
import EpisodeDetailsPage from './EpisodeDetailsPage';
import { getEpisodeDetails } from '../services/tvmaze';
import { mockTVMazeEpisode } from '../test/mocks/data';

vi.mock('../services/tvmaze');

const mockUseParams = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: () => mockUseParams(),
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    Navigate: ({ to }: any) => {
      mockNavigate(to);
      return <div data-testid="navigate" data-to={to} />;
    },
  };
});

describe('EpisodeDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ episodeId: '1' });
  });

  afterEach(() => {
    mockNavigate.mockClear();
  });

  describe('Navigation Guards', () => {
    it('should redirect to /show when episodeId is missing', async () => {
      mockUseParams.mockReturnValue({});

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        const navigate = screen.getByTestId('navigate');
        expect(navigate).toBeInTheDocument();
        expect(navigate).toHaveAttribute('data-to', '/show');
      });
    });

    it('should redirect to /show when episode is null after fetch', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue(null);

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        const navigate = screen.getByTestId('navigate');
        expect(navigate).toBeInTheDocument();
        expect(navigate).toHaveAttribute('data-to', '/show');
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner while fetching episode', async () => {
      vi.mocked(getEpisodeDetails).mockImplementation(() => new Promise(() => {}));

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        const spinner = document.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
      });
    });
  });

  describe('Error State', () => {
    it('should show error card when query fails', async () => {
      vi.mocked(getEpisodeDetails).mockRejectedValue(new Error('Network Error'));

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Error Loading Episode')).toBeInTheDocument();
        expect(screen.getByText('Network Error')).toBeInTheDocument();
      });
    });
  });

  describe('Success State', () => {
    it('should render episode details correctly', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue({
        id: 1,
        showId: 0,
        season: 1,
        episodeNumber: 1,
        title: 'Test Episode',
        summary: '<p>Test episode summary</p>',
        coverImage: 'https://example.com/image.jpg',
        airdate: '2024-01-01',
      });

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Episode')).toBeInTheDocument();
        expect(screen.getByText('Test episode summary')).toBeInTheDocument();
      });
    });

    it('should use fallback image when coverImage is null', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue({
        id: 1,
        showId: 0,
        season: 1,
        episodeNumber: 1,
        title: 'Test Episode',
        summary: '<p>Test episode summary</p>',
        coverImage: null,
        airdate: '2024-01-01',
      });

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        const image = screen.getByAltText('Test Episode');
        expect(image).toHaveAttribute('src', 'https://placehold.co/600x400/666/white?text=No+Image');
      });
    });

    it('should display season and episode number badges', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue({
        id: 1,
        showId: 0,
        season: 2,
        episodeNumber: 5,
        title: 'Test Episode',
        summary: '<p>Test episode summary</p>',
        coverImage: null,
        airdate: '2024-01-01',
      });

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Season 2')).toBeInTheDocument();
        expect(screen.getByText('Episode 5')).toBeInTheDocument();
      });
    });

    it('should render "Back to Show" link', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue({
        id: 1,
        showId: 0,
        season: 1,
        episodeNumber: 1,
        title: 'Test Episode',
        summary: '<p>Test episode summary</p>',
        coverImage: null,
        airdate: '2024-01-01',
      });

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        const backLink = screen.getByText('Back to Show');
        expect(backLink).toBeInTheDocument();
        expect(backLink.closest('a')).toHaveAttribute('href', '/show');
      });
    });
  });

  describe('Query Behavior', () => {
    it('should call getEpisodeDetails with correct episodeId', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue({
        id: 1,
        showId: 0,
        season: 1,
        episodeNumber: 1,
        title: 'Test Episode',
        summary: '<p>Test episode summary</p>',
        coverImage: null,
        airdate: '2024-01-01',
      });

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        expect(getEpisodeDetails).toHaveBeenCalledWith(1);
      });
    });

    it('should not call getEpisodeDetails when episodeId is missing', async () => {
      mockUseParams.mockReturnValue({});

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        expect(getEpisodeDetails).not.toHaveBeenCalled();
      });
    });

    it('should render "Summary" heading', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue({
        id: 1,
        showId: 0,
        season: 1,
        episodeNumber: 1,
        title: 'Test Episode',
        summary: '<p>Test episode summary</p>',
        coverImage: null,
        airdate: '2024-01-01',
      });

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
      });
    });

    it('should render HTML content in summary', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue({
        id: 1,
        showId: 0,
        season: 1,
        episodeNumber: 1,
        title: 'Test Episode',
        summary: '<p><strong>Bold</strong> text</p>',
        coverImage: null,
        airdate: '2024-01-01',
      });

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText(/Bold/)).toBeInTheDocument();
        expect(screen.getByText(/text/)).toBeInTheDocument();
      });
    });
  });
});
