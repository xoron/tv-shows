import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorAlert from './ErrorAlert';

describe('ErrorAlert', () => {
  describe('Default variant', () => {
    it('should render error message', () => {
      render(<ErrorAlert title="Error Title" message="Error message" />);

      expect(screen.getByText('Error Title')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should have correct ARIA attributes', () => {
      render(<ErrorAlert title="Error Title" message="Error message" />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });

    it('should have correct styling', () => {
      const { container } = render(<ErrorAlert title="Error Title" message="Error message" />);

      const alert = container.querySelector('.bg-white');
      expect(alert).toBeInTheDocument();
    });
  });

  describe('Inline variant', () => {
    it('should render error message', () => {
      render(<ErrorAlert title="Error Title" message="Error message" variant="inline" />);

      expect(screen.getByText('Error Title')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should have correct ARIA attributes', () => {
      render(<ErrorAlert title="Error Title" message="Error message" variant="inline" />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });

    it('should have inline styling', () => {
      const { container } = render(<ErrorAlert title="Error Title" message="Error message" variant="inline" />);

      const alert = container.querySelector('.bg-red-50');
      expect(alert).toBeInTheDocument();
    });
  });
});

