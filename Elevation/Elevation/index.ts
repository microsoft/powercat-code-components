import { ComponentState, DepthClasses } from "./component.types";
import { IInputs, IOutputs } from "./generated/ManifestTypes";

const defaultState: ComponentState = {
  isHover: false,
};

export class Elevation implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  container: HTMLDivElement;
  notifyOutputChanged: () => void;
  context: ComponentFramework.Context<IInputs>;
  elevationContainer: HTMLDivElement;
  outerContainer: HTMLDivElement;
  state: ComponentState = { ...defaultState };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement,
  ): void {
    this.notifyOutputChanged = notifyOutputChanged;
    this.context = context;
    this.container = container;
    this.outerContainer = document.createElement("div");
    this.elevationContainer = document.createElement("div");
    this.container.appendChild(this.outerContainer);
    this.outerContainer.appendChild(this.elevationContainer);
    this.context.mode.trackContainerResize(true);
    this.attachEventListeners();
    this.setStateDependentStyles();
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.context = context;
    this.setStateDependentStyles();
  }

  public getOutputs(): IOutputs {
    return {
      IsHovered: this.state.isHover,
    } as IOutputs;
  }

  public destroy(): void {
    this.detatchEventListeners();
  }

  private setStateDependentStyles() {
    this.outerContainer.className = this.context.parameters.DarkOverlay.raw === true ? "cat-blocking" : "";

    const depth = this.selectStateValue(this.context.parameters.Depth.raw, this.context.parameters.HoverDepth.raw, "1");
    this.elevationContainer.className = "cat-elevation-container " + DepthClasses[depth];
    this.elevationContainer.style.left = this.getPixelStyleFromParameter(this.context.parameters.PaddingLeft);
    this.elevationContainer.style.right = this.getPixelStyleFromParameter(this.context.parameters.PaddingRight);
    this.elevationContainer.style.top = this.getPixelStyleFromParameter(this.context.parameters.PaddingTop);
    this.elevationContainer.style.bottom = this.getPixelStyleFromParameter(this.context.parameters.PaddingBottom);

    const fillColor = this.selectStateValue(
      this.context.parameters.FillColor.raw,
      this.context.parameters.HoverFillColor.raw,
      "white",
    );
    this.elevationContainer.style.background = fillColor;
  }

  private getPixelStyleFromParameter(pixelValue: ComponentFramework.PropertyTypes.WholeNumberProperty): string {
    return (pixelValue?.raw ?? 0) > 0 ? `${pixelValue.raw}px` : "";
  }

  private selectStateValue<T>(normalValue: T | null, hoverValue: T | null, defaultValue: T): T {
    if (this.state.isHover && hoverValue) {
      return hoverValue;
    } else return normalValue ?? defaultValue;
  }

  private attachEventListeners() {
    // We can't use mouseenter/mouseleave because of other canvas controls that can obscure this control
    // (and we don't have control over pointer-event styles)
    document.body.addEventListener("mousemove", this.bodyMouseMove);
  }

  private detatchEventListeners() {
    document.body.removeEventListener("mousemove", this.bodyMouseMove);
  }

  bodyMouseMove = (ev: MouseEvent): void => {
    if (this.context.mode.isControlDisabled || !this.context.mode.isVisible) return;
    const hit = this.hitTest(ev);

    if (this.state.isHover !== hit) {
      this.state.isHover = hit;
      this.notifyOutputChanged();
      this.setStateDependentStyles();
    }
  };

  private hitTest(ev: MouseEvent) {
    const elementRectange = this.elevationContainer.getBoundingClientRect();
    return (
      ev.clientX >= elementRectange.left &&
      ev.clientX <= elementRectange.right &&
      ev.clientY >= elementRectange.top &&
      ev.clientY <= elementRectange.top + this.context.mode.allocatedHeight
    );
  }
}
