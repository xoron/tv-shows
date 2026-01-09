import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should delay function execution', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn();

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should call function with correct arguments', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn('arg1', 'arg2');

    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should cancel previous call when called again', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn('first');
    vi.advanceTimersByTime(100);

    debouncedFn('second');
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('second');
  });

  it('should cancel pending call when cancel is called', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn();
    (debouncedFn as unknown as { cancel: () => void }).cancel();

    vi.advanceTimersByTime(300);

    expect(fn).not.toHaveBeenCalled();
  });

  it('should handle rapid consecutive calls', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn('1');
    debouncedFn('2');
    debouncedFn('3');
    debouncedFn('4');
    debouncedFn('5');

    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('5');
  });

  it('should allow new call after previous execution', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn('first');
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);

    debouncedFn('second');
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('second');
  });
});
