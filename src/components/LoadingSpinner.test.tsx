import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render spinner', () => {
    render(<LoadingSpinner ariaLabel="Loading test" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('should have correct ARIA attributes', () => {
    render(<LoadingSpinner ariaLabel="Loading test" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading test');
    expect(spinner).toHaveAttribute('aria-busy', 'true');
  });

  it('should show correct label', () => {
    render(<LoadingSpinner ariaLabel="Custom loading message" />);

    // Spinner component should have the label accessible
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Custom loading message');
  });

  it('should render Atlassian Spinner component', () => {
    const { container } = render(<LoadingSpinner ariaLabel="Loading test" />);

    // Check that spinner is rendered (Atlassian Spinner creates SVG elements)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

