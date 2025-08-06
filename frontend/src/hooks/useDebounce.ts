// ============================================================================
// USE DEBOUNCE HOOK - DEBOUNCE VALUES FOR PERFORMANCE OPTIMIZATION
// FILE LOCATION: src/hooks/useDebounce.ts
// ============================================================================

import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================================
// BASIC DEBOUNCE HOOK
// ============================================================================

/**
 * Debounces a value, delaying updates until the specified delay has passed
 * without the value changing. Useful for search inputs, API calls, etc.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // Perform search API call
 *     searchBooks(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
export const useDebounce = <T>(value: T, delay = 300): T => {
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
};

// ============================================================================
// ADVANCED DEBOUNCE HOOK WITH CONTROLS
// ============================================================================

export interface UseAdvancedDebounceOptions {
  delay?: number;
  immediate?: boolean; // Execute immediately on first call
  maxWait?: number; // Maximum time to wait before forcing execution
}

export interface UseAdvancedDebounceReturn<T> {
  debouncedValue: T;
  isPending: boolean;
  cancel: () => void;
  flush: () => void;
}

/**
 * Advanced debounce hook with additional controls and state information
 *
 * @param value - The value to debounce
 * @param options - Configuration options
 * @returns Object with debounced value and control methods
 *
 * @example
 * ```tsx
 * const { debouncedValue, isPending, cancel, flush } = useAdvancedDebounce(
 *   searchTerm,
 *   { delay: 500, immediate: true, maxWait: 2000 }
 * );
 *
 * // Cancel pending debounce
 * const handleCancel = () => cancel();
 *
 * // Force immediate execution
 * const handleFlush = () => flush();
 * ```
 */
export const useAdvancedDebounce = <T>(
  value: T,
  options: UseAdvancedDebounceOptions = {}
): UseAdvancedDebounceReturn<T> => {
  const { delay = 300, immediate = false, maxWait } = options;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isPending, setIsPending] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number>(0);
  const lastValueRef = useRef<T>(value);
  const isFirstCallRef = useRef(true);

  const updateValue = useCallback((newValue: T) => {
    setDebouncedValue(newValue);
    setIsPending(false);
    lastValueRef.current = newValue;
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    setIsPending(false);
  }, []);

  const flush = useCallback(() => {
    cancel();
    updateValue(value);
  }, [cancel, updateValue, value]);

  useEffect(() => {
    // If value hasn't changed, don't do anything
    if (lastValueRef.current === value && !isFirstCallRef.current) {
      return;
    }

    const now = Date.now();
    const timeSinceLastCall = now - lastCallTimeRef.current;

    // Handle immediate execution on first call
    if (immediate && isFirstCallRef.current) {
      updateValue(value);
      lastCallTimeRef.current = now;
      isFirstCallRef.current = false;
      return;
    }

    isFirstCallRef.current = false;
    setIsPending(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set up debounce timeout
    timeoutRef.current = setTimeout(() => {
      updateValue(value);
      lastCallTimeRef.current = Date.now();

      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
        maxTimeoutRef.current = null;
      }
    }, delay);

    // Set up max wait timeout if specified
    if (maxWait && !maxTimeoutRef.current) {
      maxTimeoutRef.current = setTimeout(() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        updateValue(value);
        lastCallTimeRef.current = Date.now();
        maxTimeoutRef.current = null;
      }, maxWait);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, delay, immediate, maxWait, updateValue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    debouncedValue,
    isPending,
    cancel,
    flush,
  };
};

// ============================================================================
// DEBOUNCED CALLBACK HOOK
// ============================================================================

export interface UseDebouncedCallbackOptions {
  delay?: number;
  immediate?: boolean;
  maxWait?: number;
  deps?: React.DependencyList;
}

/**
 * Creates a debounced version of a callback function
 *
 * @param callback - The function to debounce
 * @param options - Configuration options
 * @returns Object with debounced callback and control methods
 *
 * @example
 * ```tsx
 * const { debouncedCallback, cancel, flush, isPending } = useDebouncedCallback(
 *   (searchTerm: string) => {
 *     console.log('Searching for:', searchTerm);
 *     // Perform search
 *   },
 *   { delay: 500, deps: [userId] }
 * );
 *
 * const handleSearch = (term: string) => {
 *   debouncedCallback(term);
 * };
 * ```
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  options: UseDebouncedCallbackOptions = {}
): {
  debouncedCallback: T;
  cancel: () => void;
  flush: (...args: Parameters<T>) => void;
  isPending: boolean;
} => {
  const { delay = 300, immediate = false, maxWait, deps = [] } = options;

  const [isPending, setIsPending] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const argsRef = useRef<Parameters<T>>();
  const isFirstCallRef = useRef(true);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    setIsPending(false);
  }, []);

  const execute = useCallback(
    (...args: Parameters<T>) => {
      cancel();
      callback(...args);
    },
    [callback, cancel]
  );

  const flush = useCallback(
    (...args: Parameters<T>) => {
      const finalArgs = args.length > 0 ? args : argsRef.current;
      if (finalArgs) {
        execute(...finalArgs);
      }
    },
    [execute]
  );

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      argsRef.current = args;

      // Handle immediate execution on first call
      if (immediate && isFirstCallRef.current) {
        callback(...args);
        isFirstCallRef.current = false;
        return;
      }

      isFirstCallRef.current = false;
      setIsPending(true);

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set up debounce timeout
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        setIsPending(false);

        if (maxTimeoutRef.current) {
          clearTimeout(maxTimeoutRef.current);
          maxTimeoutRef.current = null;
        }
      }, delay);

      // Set up max wait timeout if specified
      if (maxWait && !maxTimeoutRef.current) {
        maxTimeoutRef.current = setTimeout(() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          callback(...args);
          setIsPending(false);
          maxTimeoutRef.current = null;
        }, maxWait);
      }
    },
    [callback, delay, immediate, maxWait, ...deps]
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  // Reset first call flag when deps change
  useEffect(() => {
    isFirstCallRef.current = true;
  }, deps);

  return {
    debouncedCallback,
    cancel,
    flush,
    isPending,
  };
};

// ============================================================================
// DEBOUNCED STATE HOOK
// ============================================================================

export interface UseDebouncedStateOptions {
  delay?: number;
  immediate?: boolean;
}

/**
 * State hook with built-in debouncing
 *
 * @param initialValue - Initial state value
 * @param options - Configuration options
 * @returns Array with [debouncedValue, setValue, immediateValue, isPending]
 *
 * @example
 * ```tsx
 * const [debouncedSearch, setSearch, immediateSearch, isPending] = useDebouncedState('', {
 *   delay: 500,
 *   immediate: false
 * });
 *
 * return (
 *   <div>
 *     <input
 *       value={immediateSearch}
 *       onChange={(e) => setSearch(e.target.value)}
 *       placeholder="Search..."
 *     />
 *     {isPending && <span>Searching...</span>}
 *   </div>
 * );
 * ```
 */
export const useDebouncedState = <T>(
  initialValue: T,
  options: UseDebouncedStateOptions = {}
): [T, (value: T) => void, T, boolean] => {
  const [immediateValue, setImmediateValue] = useState<T>(initialValue);
  const { debouncedValue, isPending } = useAdvancedDebounce(
    immediateValue,
    options
  );

  return [debouncedValue, setImmediateValue, immediateValue, isPending];
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useDebounce;
