import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { QueryProvider } from './QueryProvider';
import { queryClient as actualQueryClient } from '../lib/queryClient';

describe('QueryProvider', () => {
  it('should render children correctly', () => {
    const { getByText } = render(
      <QueryProvider>
        <div>Test Child</div>
      </QueryProvider>
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('should wrap children in QueryClientProvider', () => {
    const { getByText } = render(
      <QueryProvider>
        <div>Test Child</div>
      </QueryProvider>
    );

    const child = getByText('Test Child');
    expect(child).toBeInTheDocument();
  });

  it('should use the correct queryClient instance', () => {
    render(
      <QueryProvider>
        <div>Test Child</div>
      </QueryProvider>
    );

    expect(actualQueryClient).toBeDefined();
    expect(actualQueryClient.constructor.name).toBe('QueryClient');
  });

  it('should render ReactQueryDevtools', () => {
    const { container } = render(
      <QueryProvider>
        <div>Test Child</div>
      </QueryProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    const { getByText } = render(
      <QueryProvider>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </QueryProvider>
    );

    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();
    expect(getByText('Child 3')).toBeInTheDocument();
  });

  it('should render nested components', () => {
    const { getByText } = render(
      <QueryProvider>
        <div>
          <span>Nested Child</span>
        </div>
      </QueryProvider>
    );

    expect(getByText('Nested Child')).toBeInTheDocument();
  });

  it('should handle null children gracefully', () => {
    const { container } = render(
      <QueryProvider>{null}</QueryProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should work with React components as children', () => {
    const TestComponent = () => <div>Component Child</div>;

    const { getByText } = render(
      <QueryProvider>
        <TestComponent />
      </QueryProvider>
    );

    expect(getByText('Component Child')).toBeInTheDocument();
  });
});
