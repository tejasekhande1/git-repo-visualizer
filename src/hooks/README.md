# Custom Hooks

This directory contains custom React hooks for reusable logic.

## Available Hooks

### `useToggle`
Toggle a boolean value.

```typescript
import { useToggle } from "@/hooks/useExample";

const [isOpen, toggleOpen, setIsOpen] = useToggle(false);
```

### `useDebounce`
Debounce a value.

```typescript
import { useDebounce } from "@/hooks/useExample";

const debouncedValue = useDebounce(searchTerm, 500);
```

## Creating New Hooks

1. Create a new file with the `use` prefix (e.g., `useAuth.ts`)
2. Export your hook function
3. Add JSDoc comments for documentation
4. Use TypeScript for type safety

```typescript
/**
 * Description of your hook
 * @param param - Description of parameter
 * @returns Description of return value
 */
export function useCustomHook(param: string) {
  // Hook logic here
}
```
