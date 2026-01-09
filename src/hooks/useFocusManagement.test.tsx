import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useFocusManagement, useFocusOnLoad } from './useFocusManagement';

// Mock useLocation
const mockLocation = { pathname: '/show' };
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => mockLocation,
  };
});

describe('useFocusManagement', () => {
  beforeEach(() => {
    // Create main-content element
    const mainContent = document.createElement('main');
    mainContent.id = 'main-content';
    document.body.appendChild(mainContent);
  });

  afterEach(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      document.body.removeChild(mainContent);
    }
  });

  it('should focus main content on mount', () => {
    const mainContent = document.getElementById('main-content') as HTMLElement;
    const focusSpy = vi.spyOn(mainContent, 'focus');

    renderHook(() => useFocusManagement(), {
      wrapper: BrowserRouter,
    });

    expect(focusSpy).toHaveBeenCalled();
  });

  it('should focus main content on route change', async () => {
    const mainContent = document.getElementById('main-content') as HTMLElement;
    const focusSpy = vi.spyOn(mainContent, 'focus');

    const { rerender } = renderHook(() => useFocusManagement(), {
      wrapper: BrowserRouter,
    });

    focusSpy.mockClear();

    // Simulate route change
    mockLocation.pathname = '/show/episode/1';
    rerender();

    await waitFor(() => {
      expect(focusSpy).toHaveBeenCalled();
    });
  });

  it('should not focus when disabled', () => {
    const mainContent = document.getElementById('main-content') as HTMLElement;
    const focusSpy = vi.spyOn(mainContent, 'focus');

    renderHook(() => useFocusManagement(false), {
      wrapper: BrowserRouter,
    });

    expect(focusSpy).not.toHaveBeenCalled();
  });
});

describe('useFocusOnLoad', () => {
  it('should focus element when condition is true', async () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const ref = { current: element };
    const focusSpy = vi.spyOn(element, 'focus');

    renderHook(() => useFocusOnLoad(ref, true));

    await waitFor(() => {
      expect(focusSpy).toHaveBeenCalled();
    });

    document.body.removeChild(element);
  });

  it('should not focus element when condition is false', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const ref = { current: element };
    const focusSpy = vi.spyOn(element, 'focus');

    renderHook(() => useFocusOnLoad(ref, false));

    expect(focusSpy).not.toHaveBeenCalled();

    document.body.removeChild(element);
  });

  it('should not focus when ref is null', () => {
    const ref = { current: null };
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');

    renderHook(() => useFocusOnLoad(ref, true));

    expect(focusSpy).not.toHaveBeenCalled();
  });
});

