import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchInput from './SearchInput';

describe('SearchInput', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render input with accessible label', () => {
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby', 'episode-search-description');
  });

  it('should render with custom placeholder', () => {
    render(<SearchInput onSearch={mockOnSearch} placeholder="Custom placeholder" />);

    const input = screen.getByPlaceholderText('Custom placeholder');
    expect(input).toBeInTheDocument();
  });

  it('should call onSearch immediately when input is cleared', () => {
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'test' } });

    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('should focus input when clear button is clicked', () => {
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'test' } });

    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);

    expect(input).toHaveFocus();
  });

  it('should show clear button only when there is input', () => {
    render(<SearchInput onSearch={mockOnSearch} />);

    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('should debounce search calls', () => {
    vi.useFakeTimers();
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'test' } });

    expect(mockOnSearch).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(mockOnSearch).toHaveBeenCalledWith('test');
    vi.useRealTimers();
  });

  it('should clear debounce on new input', () => {
    vi.useFakeTimers();
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'test' } });
    vi.advanceTimersByTime(100);

    fireEvent.change(input, { target: { value: 'testing' } });
    vi.runAllTimers();

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('testing');
    vi.useRealTimers();
  });

  it('should clear search on Escape key', () => {
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(input).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('should show loading indicator during debounce', async () => {
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'test' } });

    const loadingIndicator = screen.getByLabelText('Searching');
    expect(loadingIndicator).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByLabelText('Searching')).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('should not show loading indicator for empty input', () => {
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: '' } });

    expect(screen.queryByLabelText('Searching')).not.toBeInTheDocument();
  });

  it('should handle custom debounce duration', () => {
    vi.useFakeTimers();
    render(<SearchInput onSearch={mockOnSearch} debounceMs={500} />);

    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'test' } });
    vi.advanceTimersByTime(400);

    expect(mockOnSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(mockOnSearch).toHaveBeenCalledWith('test');
    vi.useRealTimers();
  });

  it('should cleanup debounce on unmount', () => {
    vi.useFakeTimers();
    const { unmount } = render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test' } });

    unmount();
    vi.advanceTimersByTime(300);

    expect(mockOnSearch).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('should be accessible via keyboard', async () => {
    const user = userEvent.setup();

    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');

    await user.type(input, 'test');

    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledWith('test');
      },
      { timeout: 1000 }
    );
  });
});
