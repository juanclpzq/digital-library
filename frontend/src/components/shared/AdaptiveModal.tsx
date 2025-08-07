// ============================================================================
// ADAPTIVE MODAL - AUTO-SWITCHES BETWEEN THEMES
// FILE LOCATION: src/components/shared/AdaptiveModal.tsx
// ============================================================================

import React from "react";
import { useTheme } from "@/theme/ThemeProvider";
import ModalSoftclub from "@/components/themes/softclub/Modal";
import ModalGlassHeavy from "@/components/themes/glass-heavy/Modal";
import type { ModalProps } from "@/components/themes/softclub/Modal";

// ============================================================================
// ADAPTIVE MODAL COMPONENT
// ============================================================================

/**
 * AdaptiveModal automatically renders the appropriate Modal variant
 * based on the current theme (Softclub or Glass Heavy)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AdaptiveModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   title="Confirm Action"
 * >
 *   <p>Are you sure you want to continue?</p>
 * </AdaptiveModal>
 *
 * // With glass-specific props and footer
 * <AdaptiveModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Book Details"
 *   size="lg"
 *   shimmer={true}
 *   condensation={true}
 *   footer={
 *     <div className="flex gap-3">
 *       <AdaptiveButton variant="secondary" onClick={handleClose}>
 *         Cancel
 *       </AdaptiveButton>
 *       <AdaptiveButton variant="primary" onClick={handleSave}>
 *         Save Changes
 *       </AdaptiveButton>
 *     </div>
 *   }
 * >
 *   <BookForm book={selectedBook} />
 * </AdaptiveModal>
 * ```
 */
const AdaptiveModal: React.FC<ModalProps> = (props) => {
  const theme = useTheme();

  // Add glass-specific props when in glass mode
  const enhancedProps = theme.isGlassMode
    ? {
        ...props,
        glassIntensity: theme.glassIntensity,
        // Enable glass effects by default in glass mode
        shimmer: props.shimmer ?? true,
        condensation: props.condensation ?? true,
        depth: props.depth ?? true,
      }
    : props;

  // Render the appropriate component based on current theme
  if (theme.isGlassMode) {
    return <ModalGlassHeavy {...enhancedProps} />;
  }

  return <ModalSoftclub {...props} />;
};

export default AdaptiveModal;

// ============================================================================
// MODAL HOOKS & UTILITIES
// ============================================================================

/**
 * Hook que retorna la variante apropiada de Modal basado en el tema actual
 */
export const useAdaptiveModal = () => {
  const theme = useTheme();

  const Modal = React.useMemo(() => {
    return theme.isGlassMode ? ModalGlassHeavy : ModalSoftclub;
  }, [theme.variant]);

  return { Modal };
};

/**
 * Factory function para crear Modals adaptativos con configuración predeterminada
 */
export const createModalVariant = (defaultProps: Partial<ModalProps>) => {
  return (props: ModalProps) => <AdaptiveModal {...defaultProps} {...props} />;
};

// ============================================================================
// PREDEFINED MODAL VARIANTS
// ============================================================================

/**
 * Variantes predefinidas para casos de uso específicos
 */
export const ModalVariants = {
  // Modal de confirmación pequeño
  Confirmation: createModalVariant({
    size: "sm",
    variant: "centered",
    gradient: "coral",
    showCloseButton: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
  }),

  // Modal estándar para formularios
  Form: createModalVariant({
    size: "md",
    variant: "centered",
    gradient: "cyan",
    showCloseButton: true,
    closeOnOverlayClick: false,
    closeOnEscape: true,
  }),

  // Modal grande para contenido detallado
  Detail: createModalVariant({
    size: "lg",
    variant: "centered",
    gradient: "lavender",
    showCloseButton: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
  }),

  // Modal extra grande para dashboards
  Dashboard: createModalVariant({
    size: "2xl",
    variant: "centered",
    gradient: "mint",
    showCloseButton: true,
    closeOnOverlayClick: false,
    closeOnEscape: true,
  }),

  // Modal drawer lateral
  Drawer: createModalVariant({
    size: "md",
    variant: "drawer",
    gradient: "peach",
    showCloseButton: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
  }),

  // Modal de pantalla completa
  Fullscreen: createModalVariant({
    size: "full",
    variant: "fullscreen",
    gradient: "cyan",
    showCloseButton: true,
    closeOnOverlayClick: false,
    closeOnEscape: true,
  }),

  // Modal de alerta/warning
  Alert: createModalVariant({
    size: "sm",
    variant: "centered",
    gradient: "coral",
    showCloseButton: false,
    closeOnOverlayClick: false,
    closeOnEscape: false,
  }),

  // Modal de éxito
  Success: createModalVariant({
    size: "sm",
    variant: "centered",
    gradient: "mint",
    showCloseButton: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
  }),
};

// ============================================================================
// MODAL STATE MANAGEMENT HOOK
// ============================================================================

interface UseModalStateOptions {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

/**
 * Hook para manejar el estado de un modal
 */
export const useModalState = (options: UseModalStateOptions = {}) => {
  const { defaultOpen = false, onOpen, onClose } = options;
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const openModal = React.useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const closeModal = React.useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggleModal = React.useCallback(() => {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  }, [isOpen, openModal, closeModal]);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};

// ============================================================================
// MODAL QUEUE MANAGER
// ============================================================================

interface QueuedModal {
  id: string;
  component: React.ReactNode;
  props: ModalProps;
  priority?: number;
}

/**
 * Hook para manejar una cola de modales (útil para confirmaciones en secuencia)
 */
export const useModalQueue = () => {
  const [queue, setQueue] = React.useState<QueuedModal[]>([]);
  const [currentModal, setCurrentModal] = React.useState<QueuedModal | null>(
    null
  );

  const addModal = React.useCallback((modal: Omit<QueuedModal, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newModal = { ...modal, id };

    setQueue((prev) => {
      const updated = [...prev, newModal];
      // Sort by priority (higher priority first)
      return updated.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    });
  }, []);

  const removeModal = React.useCallback(
    (id: string) => {
      setQueue((prev) => prev.filter((modal) => modal.id !== id));

      // If we removed the current modal, clear it
      if (currentModal?.id === id) {
        setCurrentModal(null);
      }
    },
    [currentModal]
  );

  const processQueue = React.useCallback(() => {
    if (!currentModal && queue.length > 0) {
      const nextModal = queue[0];
      setCurrentModal(nextModal);
      setQueue((prev) => prev.slice(1));
    }
  }, [currentModal, queue]);

  const clearQueue = React.useCallback(() => {
    setQueue([]);
    setCurrentModal(null);
  }, []);

  // Auto-process queue when current modal is closed
  React.useEffect(() => {
    processQueue();
  }, [processQueue]);

  const closeCurrentModal = React.useCallback(() => {
    setCurrentModal(null);
  }, []);

  return {
    currentModal,
    queueLength: queue.length,
    addModal,
    removeModal,
    clearQueue,
    closeCurrentModal,
  };
};

// ============================================================================
// CONFIRMATION MODAL HOOK
// ============================================================================

interface ConfirmationOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

/**
 * Hook para mostrar modales de confirmación fácilmente
 */
export const useConfirmation = () => {
  const { isOpen, openModal, closeModal } = useModalState();
  const [options, setOptions] = React.useState<ConfirmationOptions | null>(
    null
  );
  const [resolver, setResolver] = React.useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = React.useCallback(
    (opts: ConfirmationOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setOptions(opts);
        setResolver({ resolve });
        openModal();
      });
    },
    [openModal]
  );

  const handleConfirm = React.useCallback(() => {
    resolver?.resolve(true);
    closeModal();
    setResolver(null);
    setOptions(null);
  }, [resolver, closeModal]);

  const handleCancel = React.useCallback(() => {
    resolver?.resolve(false);
    closeModal();
    setResolver(null);
    setOptions(null);
  }, [resolver, closeModal]);

  const ConfirmationModal = options ? (
    <AdaptiveModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={options.title || "Confirm Action"}
      size="sm"
      variant="centered"
      gradient={options.variant === "danger" ? "coral" : "cyan"}
      closeOnOverlayClick={false}
      closeOnEscape={true}
      footer={
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          >
            {options.cancelText || "Cancel"}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          >
            {options.confirmText || "Confirm"}
          </button>
        </div>
      }
    >
      <p className="text-center">{options.message}</p>
    </AdaptiveModal>
  ) : null;

  return {
    confirm,
    ConfirmationModal,
  };
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { ModalProps } from "@/components/themes/softclub/Modal";
export { AdaptiveModal as default };
