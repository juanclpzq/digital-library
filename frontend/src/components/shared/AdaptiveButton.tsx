// ============================================================================
// ADAPTIVE BUTTON - AUTO-SWITCHES BETWEEN THEMES
// FILE LOCATION: src/components/shared/AdaptiveButton.tsx
// ============================================================================

import React from "react";
import { useTheme } from "@/theme/ThemeProvider";
import ButtonSoftclub from "@/components/themes/softclub/Button";
import ButtonGlassHeavy from "@/components/themes/glass-heavy/Button";
import type { ButtonProps } from "@/components/themes/softclub/Button";

// ============================================================================
// ADAPTIVE BUTTON COMPONENT
// ============================================================================

/**
 * AdaptiveButton automatically renders the appropriate Button variant
 * based on the current theme (Softclub or Glass Heavy)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AdaptiveButton variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </AdaptiveButton>
 *
 * // With glass-specific props (only applied in glass mode)
 * <AdaptiveButton
 *   variant="primary"
 *   gradient="cyan"
 *   shimmer={true}
 *   rippleEffect={true}
 *   onClick={handleSubmit}
 * >
 *   Submit Form
 * </AdaptiveButton>
 * ```
 */
const AdaptiveButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const theme = useTheme();

    // Add glass-specific props when in glass mode
    const enhancedProps = theme.isGlassMode
      ? {
          ...props,
          glassIntensity: theme.glassIntensity,
          // Enable glass effects by default in glass mode
          shimmer: props.shimmer ?? true,
          rippleEffect: props.rippleEffect ?? true,
        }
      : props;

    // Render the appropriate component based on current theme
    if (theme.isGlassMode) {
      return <ButtonGlassHeavy ref={ref} {...enhancedProps} />;
    }

    return <ButtonSoftclub ref={ref} {...props} />;
  }
);

AdaptiveButton.displayName = "AdaptiveButton";

export default AdaptiveButton;

// ============================================================================
// BUTTON HOOKS & UTILITIES
// ============================================================================

/**
 * Hook que retorna la variante apropiada de Button basado en el tema actual
 */
export const useAdaptiveButton = () => {
  const theme = useTheme();

  const Button = React.useMemo(() => {
    return theme.isGlassMode ? ButtonGlassHeavy : ButtonSoftclub;
  }, [theme.variant]);

  return { Button };
};

/**
 * Factory function para crear Buttons adaptativos con configuración predeterminada
 */
export const createButtonVariant = (defaultProps: Partial<ButtonProps>) => {
  return React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
    <AdaptiveButton ref={ref} {...defaultProps} {...props} />
  ));
};

// ============================================================================
// PREDEFINED BUTTON VARIANTS
// ============================================================================

/**
 * Variantes predefinidas para casos de uso específicos
 */
export const ButtonVariants = {
  // Botones primarios para acciones principales
  Primary: createButtonVariant({
    variant: "primary",
    size: "md",
    gradient: "cyan",
    shadow: "gentle",
  }),

  // Botones secundarios para acciones complementarias
  Secondary: createButtonVariant({
    variant: "secondary",
    size: "md",
    shadow: "soft",
  }),

  // Botones de acción pequeños
  ActionSmall: createButtonVariant({
    variant: "primary",
    size: "sm",
    rounded: "lg",
    shadow: "soft",
  }),

  // Botones de acción grandes
  ActionLarge: createButtonVariant({
    variant: "primary",
    size: "lg",
    gradient: "lavender",
    shadow: "strong",
  }),

  // Botones de peligro/eliminación
  Danger: createButtonVariant({
    variant: "danger",
    size: "md",
    shadow: "gentle",
  }),

  // Botones de éxito/confirmación
  Success: createButtonVariant({
    variant: "success",
    size: "md",
    gradient: "mint",
    shadow: "gentle",
  }),

  // Botones fantasma para navegación
  Ghost: createButtonVariant({
    variant: "ghost",
    size: "md",
    shadow: "none",
  }),

  // Botones de outline para alternativas
  Outline: createButtonVariant({
    variant: "outline",
    size: "md",
    shadow: "soft",
  }),

  // Botón FAB (Floating Action Button)
  FloatingAction: createButtonVariant({
    variant: "primary",
    size: "lg",
    rounded: "full",
    shadow: "strong",
    gradient: "coral",
  }),

  // Botón de carga/envío
  Submit: createButtonVariant({
    variant: "primary",
    size: "md",
    fullWidth: true,
    gradient: "cyan",
    shadow: "gentle",
  }),

  // Botón compacto para toolbars
  Toolbar: createButtonVariant({
    variant: "secondary",
    size: "sm",
    rounded: "md",
    shadow: "none",
  }),
};

// ============================================================================
// BUTTON GROUP COMPONENT
// ============================================================================

interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  gradient?: ButtonProps["gradient"];
  spacing?: "none" | "sm" | "md" | "lg";
  className?: string;
}

/**
 * ButtonGroup component para agrupar botones relacionados
 */
export const AdaptiveButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = "horizontal",
  size,
  variant,
  gradient,
  spacing = "sm",
  className = "",
}) => {
  const spacingClasses = {
    none: "",
    sm: orientation === "horizontal" ? "space-x-2" : "space-y-2",
    md: orientation === "horizontal" ? "space-x-4" : "space-y-4",
    lg: orientation === "horizontal" ? "space-x-6" : "space-y-6",
  };

  const groupClasses = [
    "inline-flex",
    orientation === "vertical" ? "flex-col" : "flex-row",
    spacingClasses[spacing],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Clone children to add consistent props
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === AdaptiveButton) {
      return React.cloneElement(child, {
        size: child.props.size || size,
        variant: child.props.variant || variant,
        gradient: child.props.gradient || gradient,
      });
    }
    return child;
  });

  return (
    <div className={groupClasses} role="group">
      {enhancedChildren}
    </div>
  );
};

// ============================================================================
// BUTTON WITH CONFIRMATION COMPONENT
// ============================================================================

interface ConfirmButtonProps extends ButtonProps {
  confirmText?: string;
  confirmDelay?: number;
  onConfirm?: () => void;
}

/**
 * Button que requiere confirmación para acciones destructivas
 */
export const AdaptiveConfirmButton: React.FC<ConfirmButtonProps> = ({
  confirmText = "Confirm?",
  confirmDelay = 3000,
  onConfirm,
  children,
  onClick,
  ...props
}) => {
  const [isConfirming, setIsConfirming] = React.useState(false);

  React.useEffect(() => {
    if (isConfirming) {
      const timer = setTimeout(() => {
        setIsConfirming(false);
      }, confirmDelay);

      return () => clearTimeout(timer);
    }
  }, [isConfirming, confirmDelay]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isConfirming) {
      onConfirm?.();
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
    }
    onClick?.(e);
  };

  return (
    <AdaptiveButton
      {...props}
      onClick={handleClick}
      variant={isConfirming ? "danger" : props.variant}
    >
      {isConfirming ? confirmText : children}
    </AdaptiveButton>
  );
};

// ============================================================================
// LOADING BUTTON WRAPPER
// ============================================================================

interface AsyncButtonProps extends ButtonProps {
  asyncAction?: () => Promise<void>;
  successText?: string;
  errorText?: string;
  successDuration?: number;
}

/**
 * Button que maneja acciones asíncronas automáticamente
 */
export const AdaptiveAsyncButton: React.FC<AsyncButtonProps> = ({
  asyncAction,
  successText = "Success!",
  errorText = "Error",
  successDuration = 2000,
  children,
  onClick,
  ...props
}) => {
  const [state, setState] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);

    if (asyncAction) {
      setState("loading");
      try {
        await asyncAction();
        setState("success");
        setTimeout(() => setState("idle"), successDuration);
      } catch (error) {
        setState("error");
        setTimeout(() => setState("idle"), successDuration);
      }
    }
  };

  const getButtonContent = () => {
    switch (state) {
      case "loading":
        return props.loadingText || "Loading...";
      case "success":
        return successText;
      case "error":
        return errorText;
      default:
        return children;
    }
  };

  const getVariant = (): ButtonProps["variant"] => {
    switch (state) {
      case "success":
        return "success";
      case "error":
        return "danger";
      default:
        return props.variant;
    }
  };

  return (
    <AdaptiveButton
      {...props}
      onClick={handleClick}
      isLoading={state === "loading"}
      variant={getVariant()}
      disabled={props.disabled || state === "loading"}
    >
      {getButtonContent()}
    </AdaptiveButton>
  );
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { ButtonProps } from "@/components/themes/softclub/Button";
export { AdaptiveButton as default };
