/**
 * An interface that all components implement.
 * 
 * @remarks
 * The specific functions of each component are not included.
 * To use them, downcast the instance and utilize accordingly.
 */
export interface IComponent {
  /**
   * To check if this component is enabled.
   * @returns true if this component is enabled.
   */
  isEnabled(): boolean

  /**
   * Enables this component.
   */
  enable(): void

  /**
   * Disables this component.
   */
  disable(): void
}
