# Project Structure

## Directory Tree

```
first-app/
│
├── src/                          # 📁 All application source code
│   │
│   ├── app/                      # Next.js App Router
│   │   ├── favicon.ico
│   │   ├── globals.css          # Global styles with Poppins font
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   │
│   ├── components/               # React Components
│   │   ├── features/            # Feature components
│   │   │   └── ExampleCard.tsx
│   │   ├── layout/              # Layout components
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   └── ui/                  # Reusable UI components
│   │       ├── Button.tsx
│   │       └── index.ts
│   │
│   ├── config/                   # Configuration
│   │   └── site.ts
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── README.md
│   │   └── useExample.ts
│   │
│   ├── lib/                      # Utilities
│   │   ├── constants.ts
│   │   └── utils.ts
│   │
│   ├── styles/                   # Additional styles
│   │
│   ├── types/                    # TypeScript definitions
│   │   └── index.ts
│   │
│   └── README.md                 # src directory documentation
│
├── public/                       # 📁 Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── .gitignore                    # Git configuration
├── README.md                     # Project README
├── eslint.config.mjs             # ESLint configuration
├── next-env.d.ts                 # Next.js TypeScript declarations
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Why src Directory?

### Benefits
- ✅ **Cleaner Root** - Configuration files are more visible
- ✅ **Clear Separation** - App code vs project configuration
- ✅ **Industry Standard** - Follows Next.js best practices
- ✅ **Better Organization** - All source code in one place
- ✅ **Scalable** - Easy to add tooling without cluttering

### What's in Root?
Only configuration files and static assets:
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `eslint.config.mjs` - Linting rules
- `public/` - Static files (images, fonts)

### What's in src?
All application code:
- `app/` - Pages and routes
- `components/` - React components
- `lib/` - Utilities and helpers
- `hooks/` - Custom React hooks
- `types/` - TypeScript types
- `config/` - App configuration

## Import Paths

All imports use the `@/` alias pointing to `src/`:

```typescript
// ✅ Correct - using path aliases
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

// ❌ Avoid - relative paths
import { Button } from "../../../components/ui/Button";
```

## Quick Reference

| Path | Maps To | Purpose |
|------|---------|---------|
| `@/*` | `src/*` | Any file in src |
| `@/components/*` | `src/components/*` | Components |
| `@/lib/*` | `src/lib/*` | Utilities |
| `@/hooks/*` | `src/hooks/*` | Custom hooks |
| `@/types/*` | `src/types/*` | Type definitions |
| `@/config/*` | `src/config/*` | Configuration |

## Development Workflow

1. **Starting Development**
   ```bash
   npm run dev
   ```

2. **Adding a New Feature**
   - Define types in `src/types/`
   - Create utilities in `src/lib/` if needed
   - Build components in `src/components/`
   - Add pages in `src/app/`

3. **Building for Production**
   ```bash
   npm run build
   npm start
   ```

## Next.js Conventions

- `src/app/` is automatically recognized by Next.js 13+
- `public/` must stay at root level
- All path aliases point to `src/`
- Hot Module Replacement (HMR) works seamlessly
