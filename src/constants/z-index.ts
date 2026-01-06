/**
 * Z-index constants for consistent layering throughout the application
 * Higher values appear above lower values
 */
export const Z_INDEX = {
  // Base content layer
  base: 0,

  // Relative content within containers (e.g., Book content)
  content: 10,

  // Modal and overlay layers
  modalOverlay: 50,
  modalContent: 60,
  modalCloseButton: 70,

  // CommandPalette layer (appears above modals, can be used inside modals)
  commandPalette: 80,

  // Popover and tooltip layer (highest, appears above everything)
  popover: 100,
} as const;
