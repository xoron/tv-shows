import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render spinner', () => {
    render(<LoadingSpinner ariaLabel="Loading test" />);

    const spinner = document.querySelector('.animate-spin');
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

    const srOnly = screen.getByText('Custom loading message');
    expect(srOnly).toBeInTheDocument();
    expect(srOnly).toHaveClass('sr-only');
  });

  it('should have correct CSS classes', () => {
    const { container } = render(<LoadingSpinner ariaLabel="Loading test" />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-blue-600');
  });
});

