# TV Shows App

A React application for browsing TV show information and episodes using the TVMaze API.

## Setup Instructions

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173` (or the port Vite assigns).

## Architecture Decisions

### Technology Stack

- **React 19** with TypeScript: Modern React with strong type safety
- **Vite**: Fast build tool and dev server for optimal developer experience
- **TanStack Query (React Query)**: Handles server state, caching, and data synchronization
- **React Router**: Client-side routing for navigation between show and episode pages
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development (exclusively used, no component libraries)
- **DOMPurify**: HTML sanitization library for XSS prevention
- **Vitest**: Fast unit testing framework with excellent TypeScript support
- **MSW (Mock Service Worker)**: API mocking for reliable testing

### Architectural Patterns

1. **Service Layer Pattern**: All API calls are abstracted in `src/services/tvmaze.ts`, keeping components decoupled from API implementation details.

2. **Type Transformation Layer**: The `types/index.ts` file contains transformation functions that normalize TVMaze API responses into our application's domain models. This provides:
   - Consistent data structures across the app
   - Decoupling from external API schema changes
   - Type safety throughout the application

3. **Provider Pattern**: React Query is configured via a `QueryProvider` component, allowing centralized cache configuration and easy access to devtools.

4. **Component Composition**: Small, focused components (e.g., `EpisodeCard`) promote reusability and testability.

5. **Custom Hooks**: Domain-specific hooks like `useDocumentTitle` and `useFocusManagement` encapsulate side effects and improve code organization.

6. **Error Boundaries**: Route-level error boundaries provide graceful error handling and recovery, preventing application crashes from propagating.

7. **HTML Sanitization**: All user-provided HTML content is sanitized before rendering to prevent XSS attacks, ensuring secure content display.

### Data Fetching Strategy

- **Stale-While-Revalidate**: React Query's default caching strategy ensures fast UI updates while keeping data fresh
- **Conditional Queries**: Episodes query is only enabled after show data is loaded, preventing unnecessary API calls
- **Optimistic Caching**: Configured stale times (30min for shows, 60min for episodes) reduce API load while maintaining reasonable freshness

## Security Features

1. **HTML Sanitization**: All HTML content from the API is sanitized using DOMPurify before rendering to prevent XSS attacks. The `sanitizeHtml` utility function ensures only safe HTML tags and attributes are allowed.

2. **Error Boundaries**: React error boundaries are implemented at the route level to catch and handle component errors gracefully, preventing the entire application from crashing.

## Key Trade-offs

1. **Hardcoded Show Search**: The app currently searches for "Powerpuff Girls" by default rather than providing a search interface. This was a pragmatic choice to focus on core functionality (show/episode display) over search UX.

2. **Basic Loading States**: Loading indicators use Tailwind CSS spinners and skeleton loaders. More sophisticated progressive loading could improve perceived performance.

3. **No Pagination**: All episodes are loaded at once. For shows with hundreds of episodes, this could impact performance, but simplifies the implementation.

4. **Limited Error Recovery**: Failed requests show error messages but don't provide retry mechanisms beyond React Query's automatic retries and error boundary reset functionality.

## What Would Be Improved With More Time

### Functionality Enhancements
- **Search Interface**: Add a search bar to allow users to find any TV show
- **Episode Filtering**: Filter episodes by season, search within episode titles/summaries
- **Favorites/Bookmarks**: Allow users to save favorite shows or episodes
- **Episode Ratings**: Display and allow user ratings for episodes

### Technical Improvements
- **Image Optimization**: 
  - Implement proper image lazy loading with intersection observer
  - Add image error handling with fallbacks
  - Consider using a CDN or image optimization service
- **Performance**:
  - Code splitting with React.lazy() for route-based chunks
  - Virtual scrolling for long episode lists
  - Memoization of expensive computations
- **Accessibility**:
  - Enhanced keyboard navigation
  - Screen reader announcements for dynamic content updates
  - Focus management during route transitions
- **Testing**:
  - Increase test coverage, especially for edge cases
  - Add E2E tests with Playwright or Cypress
  - Integration tests for API interactions
- **Developer Experience**:
  - Add Storybook for component documentation
  - Pre-commit hooks with Husky for linting/formatting
  - CI/CD pipeline for automated testing and deployment
- **State Management**: Consider adding Zustand or Redux Toolkit if client-side state becomes more complex
- **API Layer**:
  - Request deduplication
  - Request cancellation for stale requests
  - Offline support with service workers
- **UI/UX**:
  - Progressive image loading
  - Smooth page transitions
  - Toast notifications for user actions

## Project Structure

```
src/
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Library configurations (e.g., queryClient)
├── pages/           # Page-level components
├── providers/       # Context providers
├── services/        # API service layer
├── types/           # TypeScript types and transformations
└── test/            # Test utilities and mocks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

