// ============================================================================
// ADAPTIVE INPUT - AUTO-SWITCHES BETWEEN THEMES
// FILE LOCATION: src/components/shared/AdaptiveInput.tsx
// ============================================================================

import React from "react";
import { useTheme } from "@/theme/ThemeProvider";
import InputSoftclub from "@/components/themes/softclub/Input";
import InputGlassHeavy from "@/components/themes/glass-heavy/Input";
import type { InputProps } from "@/components/themes/softclub/Input";

// ============================================================================
// ADAPTIVE INPUT COMPONENT
// ============================================================================

/**
 * AdaptiveInput automatically renders the appropriate Input variant
 * based on the current theme (Softclub or Glass Heavy)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AdaptiveInput
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 *
 * // With validation and glass-specific props
 * <AdaptiveInput
 *   label="Password"
 *   type="password"
 *   value={password}
 *   onChange={handlePasswordChange}
 *   error={passwordError}
 *   shimmer={true}
 *   leftIcon={<LockIcon />}
 *   clearable
 * />
 * ```
 */
const AdaptiveInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const theme = useTheme();

    // Add glass-specific props when in glass mode
    const enhancedProps = theme.isGlassMode
      ? {
          ...props,
          glassIntensity: theme.glassIntensity,
          // Enable glass effects by default in glass mode
          shimmer: props.shimmer ?? true,
        }
      : props;

    // Render the appropriate component based on current theme
    if (theme.isGlassMode) {
      return <InputGlassHeavy ref={ref} {...enhancedProps} />;
    }

    return <InputSoftclub ref={ref} {...props} />;
  }
);

AdaptiveInput.displayName = "AdaptiveInput";

export default AdaptiveInput;

// ============================================================================
// INPUT HOOKS & UTILITIES
// ============================================================================

/**
 * Hook que retorna la variante apropiada de Input basado en el tema actual
 */
export const useAdaptiveInput = () => {
  const theme = useTheme();

  const Input = React.useMemo(() => {
    return theme.isGlassMode ? InputGlassHeavy : InputSoftclub;
  }, [theme.variant]);

  return { Input };
};

/**
 * Factory function para crear Inputs adaptativos con configuración predeterminada
 */
export const createInputVariant = (defaultProps: Partial<InputProps>) => {
  return React.forwardRef<HTMLInputElement, InputProps>((props, ref) => (
    <AdaptiveInput ref={ref} {...defaultProps} {...props} />
  ));
};

// ============================================================================
// PREDEFINED INPUT VARIANTS
// ============================================================================

/**
 * Variantes predefinidas para casos de uso específicos
 */
export const InputVariants = {
  // Input estándar para formularios
  Standard: createInputVariant({
    size: "md",
    variant: "default",
    animate: true,
  }),

  // Input para búsqueda
  Search: createInputVariant({
    size: "md",
    variant: "default",
    placeholder: "Search...",
    clearable: true,
    leftIcon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  }),

  // Input para email
  Email: createInputVariant({
    type: "email",
    size: "md",
    variant: "default",
    placeholder: "Enter your email",
    leftIcon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
        />
      </svg>
    ),
  }),

  // Input para password
  Password: createInputVariant({
    type: "password",
    size: "md",
    variant: "default",
    placeholder: "Enter your password",
    leftIcon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
  }),

  // Input para números
  Number: createInputVariant({
    type: "number",
    size: "md",
    variant: "default",
    rightIcon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
        />
      </svg>
    ),
  }),

  // Input para teléfono
  Phone: createInputVariant({
    type: "tel",
    size: "md",
    variant: "default",
    placeholder: "+1 (555) 000-0000",
    leftIcon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  }),

  // Input grande para títulos
  Title: createInputVariant({
    size: "lg",
    variant: "default",
    placeholder: "Enter title",
  }),

  // Input pequeño para filtros
  Filter: createInputVariant({
    size: "sm",
    variant: "outline",
    placeholder: "Filter...",
  }),

  // Input con borde completo
  Outlined: createInputVariant({
    size: "md",
    variant: "outline",
  }),

  // Input rellenado
  Filled: createInputVariant({
    size: "md",
    variant: "filled",
  }),

  // Input solo con línea inferior
  Underlined: createInputVariant({
    size: "md",
    variant: "underline",
  }),
};

// ============================================================================
// INPUT GROUP COMPONENT
// ============================================================================

interface InputGroupProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  helperText?: string;
  orientation?: "horizontal" | "vertical";
  spacing?: "none" | "sm" | "md" | "lg";
  className?: string;
}

/**
 * InputGroup component para agrupar inputs relacionados
 */
export const AdaptiveInputGroup: React.FC<InputGroupProps> = ({
  children,
  label,
  error,
  helperText,
  orientation = "vertical",
  spacing = "md",
  className = "",
}) => {
  const spacingClasses = {
    none: "",
    sm: orientation === "horizontal" ? "space-x-2" : "space-y-2",
    md: orientation === "horizontal" ? "space-x-4" : "space-y-4",
    lg: orientation === "horizontal" ? "space-x-6" : "space-y-6",
  };

  const groupClasses = [
    "w-full",
    orientation === "vertical" ? "flex flex-col" : "flex flex-row items-end",
    spacingClasses[spacing],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full">
      {/* Group Label */}
      {label && (
        <label className="block text-sm font-medium mb-3 text-midnight-navy/80 dark:text-white/90">
          {label}
        </label>
      )}

      {/* Input Group */}
      <div className={groupClasses} role="group">
        {children}
      </div>

      {/* Group Helper Text / Error */}
      {(error || helperText) && (
        <div className="mt-2 text-sm">
          {error && (
            <p className="text-red-500 font-medium flex items-center gap-2">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          )}

          {helperText && !error && (
            <p className="text-midnight-navy/60 dark:text-white/70">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// FORM FIELD WRAPPER
// ============================================================================

interface FormFieldProps extends InputProps {
  required?: boolean;
  optional?: boolean;
}

/**
 * FormField wrapper que añade indicadores de required/optional
 */
export const AdaptiveFormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  optional = false,
  ...props
}) => {
  const enhancedLabel = label && (
    <span>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
      {optional && (
        <span className="text-gray-500 ml-1 text-xs">(optional)</span>
      )}
    </span>
  );

  return <AdaptiveInput {...props} label={enhancedLabel} required={required} />;
};

// ============================================================================
// CONTROLLED INPUT HOOK
// ============================================================================

interface UseControlledInputProps {
  initialValue?: string;
  validation?: (value: string) => string | null;
  debounceMs?: number;
}

/**
 * Hook para manejar inputs controlados con validación
 */
export const useControlledInput = ({
  initialValue = "",
  validation,
  debounceMs = 300,
}: UseControlledInputProps = {}) => {
  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState<string | null>(null);
  const [isValid, setIsValid] = React.useState(false);

  // Debounced validation
  React.useEffect(() => {
    if (!validation) return;

    const timer = setTimeout(() => {
      const validationError = validation(value);
      setError(validationError);
      setIsValid(!validationError && value.length > 0);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, validation, debounceMs]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    []
  );

  const handleClear = React.useCallback(() => {
    setValue("");
    setError(null);
    setIsValid(false);
  }, []);

  const reset = React.useCallback(() => {
    setValue(initialValue);
    setError(null);
    setIsValid(false);
  }, [initialValue]);

  return {
    value,
    setValue,
    error,
    isValid,
    onChange: handleChange,
    onClear: handleClear,
    reset,
  };
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { InputProps } from "@/components/themes/softclub/Input";
export { AdaptiveInput as default };
