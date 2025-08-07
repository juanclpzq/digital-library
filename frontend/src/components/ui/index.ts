// ============================================================================
// UI COMPONENTS INDEX - CENTRALIZED UI EXPORTS
// FILE LOCATION: src/components/ui/index.ts
// ============================================================================

// ============================================================================
// ADAPTIVE UI COMPONENTS (PRIMARY EXPORTS)
// ============================================================================

// Core adaptive components that auto-switch between themes
export { default as AdaptiveButton, ButtonVariants, AdaptiveButtonGroup, AdaptiveConfirmButton, AdaptiveAsyncButton } from "../shared/AdaptiveButton";
export { default as AdaptiveInput, InputVariants, AdaptiveInputGroup, AdaptiveFormField, useControlledInput } from "../shared/AdaptiveInput";
export { default as AdaptiveModal, ModalVariants, useModalState, useModalQueue, useConfirmation } from "../shared/AdaptiveModal";

// Theme toggle component
export { default as ThemeToggle } from "./ThemeToggle";

// ============================================================================
// COMPONENT VARIANTS & FACTORIES
// ============================================================================

// Button variants for quick access
export const Button = {
  Primary: ButtonVariants.Primary,
  Secondary: ButtonVariants.Secondary,
  ActionSmall: ButtonVariants.ActionSmall,
  ActionLarge: ButtonVariants.ActionLarge,
  Danger: ButtonVariants.Danger,
  Success: ButtonVariants.Success,
  Ghost: ButtonVariants.Ghost,
  Outline: ButtonVariants.Outline,
  FloatingAction: ButtonVariants.FloatingAction,
  Submit: ButtonVariants.Submit,
  Toolbar: ButtonVariants.Toolbar,
};

// Input variants for quick access
export const Input = {
  Standard: InputVariants.Standard,
  Search: InputVariants.Search,
  Email: InputVariants.Email,
  Password: InputVariants.Password,
  Number: InputVariants.Number,
  Phone: InputVariants.Phone,
  Title: InputVariants.Title,
  Filter: InputVariants.Filter,
  Outlined: InputVariants.Outlined,
  Filled: InputVariants.Filled,
  Underlined: InputVariants.Underlined,
};

// Modal variants for quick access
export const Modal = {
  Confirmation: ModalVariants.Confirmation,
  Form: ModalVariants.Form,
  Detail: ModalVariants.Detail,
  Dashboard: ModalVariants.Dashboard,
  Drawer: ModalVariants.Drawer,
  Fullscreen: ModalVariants.Fullscreen,
  Alert: ModalVariants.Alert,
  Success: ModalVariants.Success,
};

// ============================================================================
// COMPONENT SETS FOR COMMON USE CASES
// ============================================================================

/**
 * Complete component sets for different scenarios
 */
export const ComponentSets = {
  // Form components
  Form: {
    Input: AdaptiveInput,
    Button: AdaptiveButton,
    Modal: AdaptiveModal,
    FormField: AdaptiveFormField,
    InputGroup: AdaptiveInputGroup,
  },

  // Action components
  Actions: {
    Button: AdaptiveButton,
    ConfirmButton: AdaptiveConfirmButton,
    AsyncButton: AdaptiveAsyncButton,
    ButtonGroup: AdaptiveButtonGroup,
  },

  // Modal components
  Modals: {
    Modal: AdaptiveModal,
    useModalState,
    useModalQueue,
    useConfirmation,
  },

  // Input components
  Inputs: {
    Input: AdaptiveInput,
    FormField: AdaptiveFormField,
    InputGroup: AdaptiveInputGroup,
    useControlledInput,
  },
};

// ============================================================================
// QUICK ACCESS COMPONENT BUILDERS
// ============================================================================

/**
 * Quick builders for common component combinations
 */
export const QuickBuilders = {
  // Create a form modal with input and buttons
  createFormModal: (title: string, inputs: React.ReactNode, onSubmit: () => void) => {
    const { isOpen, openModal, closeModal } = useModalState();
    
    return {
      isOpen,
      openModal,
      closeModal,
      ModalComponent: (
        <AdaptiveModal
          isOpen={isOpen}
          onClose={closeModal}
          title={title}
          size="md"
          footer={
            <AdaptiveButtonGroup spacing="md">
              <Button.Secondary onClick={closeModal}>Cancel</Button.Secondary>
              <Button.Primary onClick={onSubmit}>Submit</Button.Primary>
            </AdaptiveButtonGroup>
          }
        >
          {inputs}
        </AdaptiveModal>
      ),
    };
  },

  // Create a confirmation dialog
  createConfirmDialog: (message: string, onConfirm: () => void) => {
    const { confirm, ConfirmationModal } = useConfirmation();
    
    return {
      confirm: () => confirm({ message }),
      ConfirmationModal,
      onConfirm,
    };
  },

  // Create a search input with button
  createSearchInput: (onSearch: (term: string) => void) => {
    const { value, onChange, onClear } = useControlledInput();
    
    return {
      SearchInput: (
        <AdaptiveInputGroup orientation="horizontal" spacing="sm">
          <Input.Search 
            value={value} 
            onChange={onChange} 
            onClear={onClear}
            placeholder="Search..."
          />
          <Button.Primary onClick={() => onSearch(value)}>
            Search
          </Button.Primary>
        </AdaptiveInputGroup>
      ),
      value,
      clear: onClear,
    };
  },
};

// ============================================================================
// THEME-AWARE COMPONENT UTILITIES
// ============================================================================

/**
 * Utilities for working with theme-aware components
 */
export const ThemeUtils = {
  // Get appropriate component props based on current theme
  getThemeProps: (baseProps: any, glassProps: any = {}) => {
    // This would be used internally by components
    // Users typically don't need to call this directly
    return { ...baseProps, ...glassProps };
  },

  // Check if glass effects should be enabled
  shouldUseGlassEffects: () => {
    // Internal utility - components handle this automatically
    return false; // Placeholder
  },
};

// ============================================================================
// COMPONENT VALIDATION & DEVELOPMENT HELPERS
// ============================================================================

/**
 * Development helpers for component usage
 */
export const DevHelpers = {
  // Validate component props (development only)
  validateProps: (componentName: string, props: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Validating ${componentName} props:`, props);
      // Add validation logic here
    }
  },

  // Track component usage (development only)
  trackUsage: (componentName: string) => {
    if (process.env.NODE_ENV === 'development') {
      const usage = JSON.parse(localStorage.getItem('ui-component-usage') || '{}');
      usage[componentName] = (usage[componentName] || 0) + 1;
      localStorage.setItem('ui-component-usage', JSON.stringify(usage));
    }
  },

  // Get component usage stats (development only)
  getUsageStats: () => {
    if (process.env.NODE_ENV === 'development') {
      return JSON.parse(localStorage.getItem('ui-component-usage') || '{}');
    }
    return {};
  },
};

// ============================================================================
// ACCESSIBILITY UTILITIES
// ============================================================================

/**
 * Accessibility helpers for UI components
 */
export const A11yUtils = {
  // ARIA labels for common UI patterns
  getAriaLabels: (type: 'modal' | 'button' | 'input') => {
    const labels = {
      modal: {
        'aria-modal': 'true',
        'role': 'dialog',
      },
      button: {
        'role': 'button',
        'tabIndex': 0,
      },
      input: {
        'role': 'textbox',
      },
    };
    return labels[type] || {};
  },

  // Focus management utilities
  focusManagement: {
    trapFocus: (element: HTMLElement) => {
      // Focus trap implementation
    },
    restoreFocus: (previousElement: HTMLElement) => {
      // Restore focus implementation
    },
  },
};

// ============================================================================
// COMPONENT DOCUMENTATION
// ============================================================================

/**
 * Component documentation and examples
 */
export const ComponentDocs = {
  Button: {
    description: 'Adaptive button component that switches between Softclub and Glass Heavy themes',
    examples: [
      'Basic: <AdaptiveButton>Click me</AdaptiveButton>',
      'Primary: <Button.Primary>Save</Button.Primary>',
      'With icon: <AdaptiveButton leftIcon={<SaveIcon />}>Save</AdaptiveButton>',
    ],
  },
  Input: {
    description: 'Adaptive input component with validation and theme switching',
    examples: [
      'Basic: <AdaptiveInput placeholder="Enter text" />',
      'Email: <Input.Email value={email} onChange={setEmail} />',
      'With validation: <AdaptiveInput error="Required field" />',
    ],
  },
  Modal: {
    description: 'Adaptive modal component with glass effects and animations',
    examples: [
      'Basic: <AdaptiveModal isOpen={open} onClose={close}>Content</AdaptiveModal>',
      'Form: <Modal.Form title="Edit Profile">Form content</Modal.Form>',
      'Confirmation: <Modal.Confirmation>Are you sure?</Modal.Confirmation>',
    ],
  },
};

// ============================================================================
// DEFAULT EXPORT WITH MOST USED COMPONENTS
// ============================================================================

export default {
  // Core components
  Button: AdaptiveButton,
  Input: AdaptiveInput,
  Modal: AdaptiveModal,
  ThemeToggle,

  // Component variants
  ButtonVariants: Button,
  InputVariants: Input,
  ModalVariants: Modal,

  // Utilities
  ComponentSets,
  QuickBuilders,
  DevHelpers,
  A11yUtils,
  
  // Hooks
  useModalState,
  useConfirmation,
  useControlledInput,
};