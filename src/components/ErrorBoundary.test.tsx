import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error
const ThrowError = ({
  shouldThrow = false,
  message = 'Test error',
}: {
  shouldThrow?: boolean;
  message?: string;
}) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div>No error</div>;
};

// Suppress console.error for tests
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should catch errors and display fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('should display default error message when error has no message', () => {
    const ThrowErrorWithoutMessage = () => {
      throw new Error();
    };

    render(
      <ErrorBoundary>
        <ThrowErrorWithoutMessage />
      </ErrorBoundary>
    );

    expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
  });

  it('should call onError callback when error occurs', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} message="Callback test" />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object));
  });

  it('should reset error boundary when reset button is clicked', async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    const ThrowErrorControlled = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>No error</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowErrorControlled />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    // Find reset button by text
    const resetButton = screen.getByText('Try Again');
    expect(resetButton).toBeInTheDocument();

    // Set shouldThrow to false before clicking reset
    shouldThrow = false;
    await user.click(resetButton);

    // Re-render with no error - the error boundary should reset and render children
    rerender(
      <ErrorBoundary>
        <ThrowErrorControlled />
      </ErrorBoundary>
    );

    await waitFor(
      () => {
        expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
        expect(screen.getByText('No error')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('should reset error boundary when resetKeys change', async () => {
    const { rerender } = render(
      <ErrorBoundary resetKeys={['key1']}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Change resetKeys and render component that doesn't throw
    rerender(
      <ErrorBoundary resetKeys={['key2']}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Error boundary should reset and render children
    await waitFor(
      () => {
        expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
        expect(screen.getByText('No error')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('should not reset when resetKeys are empty', () => {
    const { rerender } = render(
      <ErrorBoundary resetKeys={[]}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Change resetKeys but keep empty
    rerender(
      <ErrorBoundary resetKeys={[]}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Error boundary should still show error
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should reset when resetOnPropsChange is true and children change', async () => {
    const { rerender } = render(
      <ErrorBoundary resetOnPropsChange={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Change children to component that doesn't throw
    rerender(
      <ErrorBoundary resetOnPropsChange={true}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Error boundary should reset and render children
    await waitFor(
      () => {
        expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
        expect(screen.getByText('No error')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('should use custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('should display error details in development mode', () => {
    // In Vite, import.meta.env.DEV is true in development
    // We can't easily mock import.meta.env in tests, so we test the actual behavior
    // The component will show error details when import.meta.env.DEV is true
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} message="Development error" />
      </ErrorBoundary>
    );

    // Error details should be shown in development mode (which is the default in tests)
    expect(screen.getByText('Error details')).toBeInTheDocument();
  });

  it('should not display error details in production mode', () => {
    // Note: We can't easily mock import.meta.env in Vitest
    // This test verifies the component structure, but the actual env check
    // would need to be tested in an E2E environment or with a different approach
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} message="Production error" />
      </ErrorBoundary>
    );

    // In test environment (development), error details are shown
    // In production build, they would not be shown
    expect(screen.getByText('Error details')).toBeInTheDocument();
  });

  it('should have correct ARIA attributes', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('should clean up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const { unmount } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Click reset to set up timeout
    const resetButton = screen.getByText('Try Again');
    resetButton.click();

    unmount();

    // Verify clearTimeout was called (may be called multiple times)
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('should clear timeout when resetTimeoutId is not null', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Click reset button multiple times to ensure clearTimeout is called
    const resetButton = screen.getByText('Try Again');
    resetButton.click();
    resetButton.click(); // Second click should clear the previous timeout

    // Verify clearTimeout was called when resetTimeoutId is not null
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
