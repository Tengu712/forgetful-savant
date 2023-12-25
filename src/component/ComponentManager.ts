import { IComponent } from "./IComponent"

/**
 * A class for managing components.
 */
export class ComponentManager {
  private components: IComponent[]

  /**
   * Constructor.
   */
  public constructor() {
    this.components = []
  }

  /**
   * Adds a component to this manager.
   * @param component 
   */
  public add(component: IComponent) {
    this.components.push(component)
  }

  /**
   * To get all components of the specified type as specified in the argument.
   * @param type Component type.
   * @returns all components of the specified type.
   */
  public get<T extends IComponent>(type: new (...args: any) => T): T[] {
    const res: T[] = []
    for (const n of this.components) {
      if (n instanceof type) {
        res.push(n as T)
      }
    }
    return res
  }
}
