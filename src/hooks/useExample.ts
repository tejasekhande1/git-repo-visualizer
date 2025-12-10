import { useState, useEffect } from "react";

/**
 * Example custom hook for managing boolean toggle state
 * @param initialValue - Initial boolean value
 * @returns Tuple of [value, toggle function, setValue function]
 */
export function useToggle(initialValue: boolean = false) {
    const [value, setValue] = useState(initialValue);

    const toggle = () => setValue((prev) => !prev);

    return [value, toggle, setValue] as const;
}

/**
 * Example custom hook for debouncing a value
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
