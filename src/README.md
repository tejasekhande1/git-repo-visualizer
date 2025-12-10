# src Directory

This directory contains all application source code, keeping the project root clean and organized.

## Structure

```
src/
├── app/          # Next.js App Router (pages & routes)
├── components/   # React components
│   ├── ui/       # Reusable UI primitives
│   ├── layout/   # Layout components (Header, Footer)
│   └── features/ # Feature-specific components
├── lib/          # Utility functions and constants
├── hooks/        # Custom React hooks
├── types/        # TypeScript type definitions
├── config/       # Application configuration
└── styles/       # Additional style files
```

## Import Paths

All imports use path aliases starting with `@/`:

```typescript
// Components
import { Button } from "@/components/ui";
import { Header, Footer } from "@/components/layout";
import ExampleCard from "@/components/features/ExampleCard";

// Utilities
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

// Hooks
import { useToggle } from "@/hooks/useExample";

// Configuration
import { siteConfig } from "@/config/site";

// Types
import type { User, Post } from "@/types";
```

## Folder Guidelines

### `/app`
- Next.js 14+ App Router
- Pages, layouts, and route handlers
- Keep route components lean, extract logic to hooks/lib

### `/components`
- **ui/**: Generic, reusable components (Button, Input, Card)
- **layout/**: Layout components (Header, Footer, Sidebar)
- **features/**: Business logic components composed from UI components

### `/lib`
- Utility functions (formatters, helpers)
- Constants and configuration values
- Third-party library configurations

### `/hooks`
- Custom React hooks
- Prefix all hooks with `use`
- Keep hooks focused and composable

### `/types`
- TypeScript interfaces and types
- Share types across the application
- Keep types close to their usage when possible

### `/config`
- Application-wide configuration
- Environment-specific settings
- Feature flags and constants

### `/styles`
- Additional CSS files if needed
- Global styles are in `app/globals.css`

## Best Practices

1. **Always use path aliases** - Import from `@/` not relative paths
2. **Keep components small** - Single responsibility
3. **Extract logic** - Use hooks for complex state/effects
4. **Type everything** - Leverage TypeScript fully
5. **Document as you go** - Add JSDoc comments to functions

## Adding New Code

When adding new features:
1. Define types in `/types`
2. Create utilities in `/lib` if needed
3. Build hooks in `/hooks` for logic
4. Create UI components in `/components/ui`
5. Compose features in `/components/features`
6. Add pages/routes in `/app`
