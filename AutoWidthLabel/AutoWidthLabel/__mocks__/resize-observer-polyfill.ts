/* istanbul ignore file */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

export const ResizeObserverMock = {
  onResize: jest.fn(),
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
};
export default class ResizeObserver {
  constructor(handler: any) {
    ResizeObserverMock.onResize = handler;
    this.observe = ResizeObserverMock.observe;
    this.unobserve = ResizeObserverMock.unobserve;
    this.disconnect = ResizeObserverMock.disconnect;
  }
  disconnect(): void;
  disconnect(): void;
  disconnect(): void {
    throw new Error();
  }
  observe(target: Element, options?: ResizeObserverOptions): void;
  observe(target: Element): void;
  observe(target: any, options?: any): void {
    throw new Error();
  }
  unobserve(target: Element): void;
  unobserve(target: Element): void;
  unobserve(target: any): void {
    throw new Error();
  }
}
