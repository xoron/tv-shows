import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { debounce } from '../utils/debounce';

interface SearchInputProps {
  onSearch: (query: string) => void;
  debounceMs?: number;
  placeholder?: string;
  label?: string;
  description?: string;
}

function SearchInput({
  onSearch,
  debounceMs = 300,
  placeholder = 'Search episodes...',
  label = 'Search episodes',
  description = 'Type to search episodes by title or summary',
}: SearchInputProps) {
  const [value, setValue] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useRef(
    debounce((query: string) => {
      setIsDebouncing(false);
      onSearch(query);
    }, debounceMs)
  );

  useEffect(() => {
    const debouncedFn = debouncedSearch.current as unknown as { cancel: () => void };
    return () => {
      debouncedFn.cancel();
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (newValue.trim()) {
      setIsDebouncing(true);
      debouncedSearch.current(newValue);
    } else {
      setIsDebouncing(false);
      onSearch('');
    }
  };

  const handleClear = () => {
    setValue('');
    setIsDebouncing(false);
    (debouncedSearch.current as unknown as { cancel: () => void }).cancel();
    onSearch('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor="episode-search" className="sr-only">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id="episode-search"
          type="search"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-describedby="episode-search-description"
          role="searchbox"
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        {isDebouncing && (
          <div
            className="absolute right-12 top-1/2 transform -translate-y-1/2"
            role="status"
            aria-label="Searching"
          >
            <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>
      <p id="episode-search-description" className="sr-only">
        {description}
      </p>
    </div>
  );
}

export default SearchInput;
