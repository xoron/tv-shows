import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/utils/test-utils';
import SkeletonLoader from './SkeletonLoader';

describe('SkeletonLoader', () => {
  it('should render text skeleton by default', () => {
    renderWithProviders(<SkeletonLoader />);

    const skeleton = screen.getByRole('status', { name: 'Loading content' });
    expect(skeleton).toBeInTheDocument();
  });

  it('should render card skeleton', () => {
    renderWithProviders(<SkeletonLoader variant="card" />);

    const skeleton = screen.getByRole('status', { name: 'Loading content' });
    expect(skeleton).toBeInTheDocument();
  });

  it('should render episode-card skeleton', () => {
    renderWithProviders(<SkeletonLoader variant="episode-card" />);

    const skeleton = screen.getByRole('status', { name: 'Loading content' });
    expect(skeleton).toBeInTheDocument();
  });

  it('should render show-details skeleton', () => {
    renderWithProviders(<SkeletonLoader variant="show-details" />);

    const skeleton = screen.getByRole('status', { name: 'Loading content' });
    expect(skeleton).toBeInTheDocument();
  });

  it('should render image skeleton', () => {
    renderWithProviders(<SkeletonLoader variant="image" />);

    const skeleton = screen.getByRole('status', { name: 'Loading image' });
    expect(skeleton).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = renderWithProviders(<SkeletonLoader className="custom-class" />);

    // Check if custom class is applied to the skeleton element
    const skeleton = container.querySelector('[role="status"]');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('custom-class');
  });

  it('should apply custom width and height', () => {
    renderWithProviders(<SkeletonLoader width="200px" height="100px" />);

    const skeleton = screen.getByRole('status', { name: 'Loading content' });
    expect(skeleton).toHaveStyle({ width: '200px', height: '100px' });
  });

  it('should render text variant with correct aria-label', () => {
    renderWithProviders(<SkeletonLoader variant="text" />);

    const skeleton = screen.getByRole('status', { name: 'Loading content' });
    expect(skeleton).toBeInTheDocument();
  });
});
