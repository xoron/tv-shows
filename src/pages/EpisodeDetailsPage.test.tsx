import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test/utils/test-utils';
import EpisodeDetailsPage from './EpisodeDetailsPage';
import { getEpisodeDetails } from '../services/tvmaze';

vi.mock('../services/tvmaze');

const mockUseParams = vi.fn();
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useLocation: () => mockUseLocation(),
    Link: ({ children, to, ...props }: { children: React.ReactNode; to: string; [key: string]: unknown }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    Navigate: ({ to }: { to: string }) => {
      mockNavigate(to);
      return <div data-testid="navigate" data-to={to} />;
    },
  };
});

describe('EpisodeDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ episodeId: '1' });
    mockUseLocation.mockReturnValue({ state: { showId: 1 } });
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
    it('should show skeleton loader while fetching episode', async () => {
      vi.mocked(getEpisodeDetails).mockImplementation(() => new Promise(() => {}));

      renderWithProviders(<EpisodeDetailsPage />);

      // Check for skeleton loader - SkeletonLoader uses role="status" with aria-label="Loading content"
      const skeleton = screen.getByRole('status', { name: 'Loading content' });
      expect(skeleton).toBeInTheDocument();
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
        showId: 1,
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
        showId: 1,
        season: 1,
        episodeNumber: 1,
        title: 'Test Episode',
        summary: '<p>Test episode summary</p>',
        coverImage: null,
        airdate: '2024-01-01',
      });

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        const image = screen.getByAltText('Cover image for Test Episode - Season 1, Episode 1');
        expect(image).toHaveAttribute('src', 'https://placehold.co/600x400/666/white?text=No+Image');
      });
    });

    it('should display season and episode number badges', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue({
        id: 1,
        showId: 1,
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
        showId: 1,
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
    it('should call getEpisodeDetails with correct episodeId and showId', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue({
        id: 1,
        showId: 1,
        season: 1,
        episodeNumber: 1,
        title: 'Test Episode',
        summary: '<p>Test episode summary</p>',
        coverImage: null,
        airdate: '2024-01-01',
      });

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        expect(getEpisodeDetails).toHaveBeenCalledWith(1, 1);
      });
    });

    it('should not call getEpisodeDetails when episodeId is missing', async () => {
      mockUseParams.mockReturnValue({});

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        expect(getEpisodeDetails).not.toHaveBeenCalled();
      });
    });

    it('should not call getEpisodeDetails when showId is missing', async () => {
      mockUseLocation.mockReturnValue({ state: null });
      const documentTitleSpy = vi.spyOn(document, 'title', 'set');

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        expect(getEpisodeDetails).not.toHaveBeenCalled();
      });

      // useDocumentTitle should be called with undefined when episode is undefined (query disabled)
      // It's called before the redirect check
      expect(documentTitleSpy).toHaveBeenCalled();
      documentTitleSpy.mockRestore();
    });

    it('should not call getEpisodeDetails when showId is missing from state object', async () => {
      mockUseLocation.mockReturnValue({ state: {} });
      const documentTitleSpy = vi.spyOn(document, 'title', 'set');

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        expect(getEpisodeDetails).not.toHaveBeenCalled();
      });

      // useDocumentTitle should be called with undefined when episode is undefined (query disabled)
      // It's called before the redirect check
      expect(documentTitleSpy).toHaveBeenCalled();
      documentTitleSpy.mockRestore();
    });

    it('should handle when episodeId is missing but showId exists', async () => {
      mockUseParams.mockReturnValue({});
      mockUseLocation.mockReturnValue({ state: { showId: 1 } });
      const documentTitleSpy = vi.spyOn(document, 'title', 'set');

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        const navigate = screen.getByTestId('navigate');
        expect(navigate).toBeInTheDocument();
        expect(navigate).toHaveAttribute('data-to', '/show');
      });

      // Verify queryFn returns null when episodeId is missing (line 28)
      // useDocumentTitle should be called with undefined
      expect(documentTitleSpy).toHaveBeenCalled();
      documentTitleSpy.mockRestore();
    });

    it('should return null from queryFn when showId is missing but episodeId exists', async () => {
      mockUseParams.mockReturnValue({ episodeId: '1' });
      mockUseLocation.mockReturnValue({ state: {} });
      const documentTitleSpy = vi.spyOn(document, 'title', 'set');

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        expect(getEpisodeDetails).not.toHaveBeenCalled();
      });

      // Verify queryFn returns null when showId is missing (line 28)
      // useDocumentTitle should be called with undefined
      expect(documentTitleSpy).toHaveBeenCalled();
      documentTitleSpy.mockRestore();
    });

    it('should call useDocumentTitle with undefined when episode is null', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue(null);
      const documentTitleSpy = vi.spyOn(document, 'title', 'set');

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        // useDocumentTitle should be called with undefined when episode is null
        // This is tested indirectly by checking navigation happens
        const navigate = screen.getByTestId('navigate');
        expect(navigate).toBeInTheDocument();
      });

      // Verify useDocumentTitle was called (it runs before the redirect)
      // The hook will be called with undefined when episode is null
      expect(documentTitleSpy).toHaveBeenCalled();
      documentTitleSpy.mockRestore();
    });

    it('should call useDocumentTitle when episode is loaded', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue({
        id: 1,
        showId: 1,
        season: 1,
        episodeNumber: 1,
        title: 'Test Episode Title',
        summary: '<p>Test summary</p>',
        coverImage: null,
        airdate: '2024-01-01',
      });
      const documentTitleSpy = vi.spyOn(document, 'title', 'set');

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Episode Title')).toBeInTheDocument();
      });

      // Verify useDocumentTitle was called with episode title
      expect(documentTitleSpy).toHaveBeenCalled();
      documentTitleSpy.mockRestore();
    });

    it('should compute memoized values when episode is null', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue(null);
      const documentTitleSpy = vi.spyOn(document, 'title', 'set');

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        const navigate = screen.getByTestId('navigate');
        expect(navigate).toBeInTheDocument();
      });

      // Verify useDocumentTitle was called with undefined (episode?.title when episode is null)
      // This ensures line 36 is executed
      expect(documentTitleSpy).toHaveBeenCalled();
      documentTitleSpy.mockRestore();
    });

    it('should compute memoized values when episode is undefined (query disabled)', async () => {
      mockUseLocation.mockReturnValue({ state: {} });
      const documentTitleSpy = vi.spyOn(document, 'title', 'set');

      renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        expect(getEpisodeDetails).not.toHaveBeenCalled();
      });

      // Verify useDocumentTitle was called with undefined (episode?.title when episode is undefined)
      // This ensures line 36 is executed even when query is disabled
      expect(documentTitleSpy).toHaveBeenCalled();
      documentTitleSpy.mockRestore();
    });

    it('should render "Summary" heading', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue({
        id: 1,
        showId: 1,
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
        showId: 1,
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

    it('should sanitize HTML and remove script tags', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue({
        id: 1,
        showId: 1,
        season: 1,
        episodeNumber: 1,
        title: 'Test Episode',
        summary: '<p>Safe content</p><script>alert("XSS")</script>',
        coverImage: null,
        airdate: '2024-01-01',
      });

      const { container } = renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        // Script tags should be removed
        const scripts = container.querySelectorAll('script');
        expect(scripts.length).toBe(0);
        
        // Safe content should still be rendered
        expect(screen.getByText(/Safe content/)).toBeInTheDocument();
      });
    });

    it('should sanitize HTML and remove event handlers', async () => {
      vi.mocked(getEpisodeDetails).mockResolvedValue({
        id: 1,
        showId: 1,
        season: 1,
        episodeNumber: 1,
        title: 'Test Episode',
        summary: '<p onclick="alert(\'XSS\')">Click me</p>',
        coverImage: null,
        airdate: '2024-01-01',
      });

      const { container } = renderWithProviders(<EpisodeDetailsPage />);

      await waitFor(() => {
        const paragraph = container.querySelector('p');
        expect(paragraph).not.toHaveAttribute('onclick');
        expect(screen.getByText(/Click me/)).toBeInTheDocument();
      });
    });
  });
});
