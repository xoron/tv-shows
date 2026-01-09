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
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
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

5. **Custom Hooks**: Domain-specific hooks like `useDocumentTitle` encapsulate side effects and improve code organization.

### Data Fetching Strategy

- **Stale-While-Revalidate**: React Query's default caching strategy ensures fast UI updates while keeping data fresh
- **Conditional Queries**: Episodes query is only enabled after show data is loaded, preventing unnecessary API calls
- **Optimistic Caching**: Configured stale times (30min for shows, 60min for episodes) reduce API load while maintaining reasonable freshness

## Key Trade-offs

1. **Hardcoded Show Search**: The app currently searches for "Powerpuff Girls" by default rather than providing a search interface. This was a pragmatic choice to focus on core functionality (show/episode display) over search UX.

2. **Direct HTML Rendering**: Episode summaries use `dangerouslySetInnerHTML` without sanitization. This was chosen for simplicity, but in production would require a sanitization library like DOMPurify.

3. **No Error Boundaries**: Errors are handled at the component level rather than with React error boundaries. This works for the current scope but limits graceful degradation.

4. **Basic Loading States**: Loading indicators are simple spinners. More sophisticated skeleton screens or progressive loading could improve perceived performance.

5. **No Pagination**: All episodes are loaded at once. For shows with hundreds of episodes, this could impact performance, but simplifies the implementation.

6. **Limited Error Recovery**: Failed requests show error messages but don't provide retry mechanisms beyond React Query's automatic retries.

## What Would Be Improved With More Time

### Functionality Enhancements
- **Search Interface**: Add a search bar to allow users to find any TV show
- **Episode Filtering**: Filter episodes by season, search within episode titles/summaries
- **Favorites/Bookmarks**: Allow users to save favorite shows or episodes
- **Episode Ratings**: Display and allow user ratings for episodes

### Technical Improvements
- **HTML Sanitization**: Integrate DOMPurify to safely render HTML content from API
- **Error Boundaries**: Add React error boundaries for better error isolation and recovery
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
  - Skeleton screens instead of spinners
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

