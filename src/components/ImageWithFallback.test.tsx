import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImageWithFallback from './ImageWithFallback';

describe('ImageWithFallback', () => {
  it('should render image when src provided', () => {
    render(
      <ImageWithFallback
        src="https://example.com/image.jpg"
        alt="Test image"
        fallback="https://placehold.co/600x400"
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should show fallback when src is null', () => {
    render(
      <ImageWithFallback
        src={null}
        alt="Test image"
        fallback="https://placehold.co/600x400"
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('src', 'https://placehold.co/600x400');
  });

  it('should show fallback on image error', async () => {
    render(
      <ImageWithFallback
        src="https://example.com/invalid.jpg"
        alt="Test image"
        fallback="https://placehold.co/600x400"
      />
    );

    const image = screen.getByAltText('Test image') as HTMLImageElement;
    
    // Wait for intersection observer
    await waitFor(() => {
      expect(image.src).toBeTruthy();
    });
    
    // Simulate image error
    fireEvent.error(image);

    // Wait for state update
    await waitFor(() => {
      expect(image.src).toContain('placehold.co');
    });
  });

  it('should have correct alt text', () => {
    render(
      <ImageWithFallback
        src="https://example.com/image.jpg"
        alt="Custom alt text"
        fallback="https://placehold.co/600x400"
      />
    );

    const image = screen.getByAltText('Custom alt text');
    expect(image).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <ImageWithFallback
        src="https://example.com/image.jpg"
        alt="Test image"
        fallback="https://placehold.co/600x400"
        className="custom-class"
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toHaveClass('custom-class');
  });

  it('should have lazy loading attribute', () => {
    render(
      <ImageWithFallback
        src="https://example.com/image.jpg"
        alt="Test image"
        fallback="https://placehold.co/600x400"
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('should show loading state initially', async () => {
    render(
      <ImageWithFallback
        src="https://example.com/image.jpg"
        alt="Test image"
        fallback="https://placehold.co/600x400"
      />
    );

    // Loading indicator should be present initially
    const loadingIndicator = screen.getByText('Loading...');
    expect(loadingIndicator).toBeInTheDocument();
    
    // Wait for image to load
    const image = screen.getByAltText('Test image');
    fireEvent.load(image);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('should handle loading state correctly', async () => {
    render(
      <ImageWithFallback
        src="https://example.com/image.jpg"
        alt="Test image"
        fallback="https://placehold.co/600x400"
      />
    );

    const image = screen.getByAltText('Test image') as HTMLImageElement;
    
    // Simulate image load
    await waitFor(() => {
      expect(image.src).toBeTruthy();
    });
    
    fireEvent.load(image);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });
});

