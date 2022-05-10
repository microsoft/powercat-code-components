import { IInputs, IOutputs } from "./generated/ManifestTypes";
import ResizeObserver from "resize-observer-polyfill";
import { ComponentState, ContextEx } from "./component.types";
import {
  setBorderStyles,
  setFontStyles,
  setStateDepBorderAndFillStyles,
  setStateDepFontStyles,
} from "./component.styles";

const defaultState = {
  isDisabled: false,
  isFocus: false,
  isHover: false,
} as ComponentState;

export class AutoWidthLabel implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  container: HTMLDivElement;
  context: ComponentFramework.Context<IInputs>;
  ro: ResizeObserver;
  labelText: HTMLDivElement;
  labelContainer: HTMLDivElement;
  state = { ...defaultState };
  notifyOutputChanged: () => void;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement,
  ): void {
    this.container = container;
    this.context = context;
    this.notifyOutputChanged = notifyOutputChanged;

    // Create the label div
    this.labelText = document.createElement("div");
    this.labelText.className = "cat-label-text";

    // Create container div for measuring size (border-box)
    this.labelContainer = document.createElement("div");
    this.labelContainer.className = "cat-label-text-container";
    this.labelContainer.appendChild(this.labelText);
    this.container.appendChild(this.labelContainer);

    // Style the div
    this.updateStateFromContext();
    this.setStyles();

    // Set the initial label text
    this.setText();

    // Listen for resize/focus/hover
    this.attachEventListeners();
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.context = context;
    this.updateStateFromContext();
    this.setStyles();

    // Update the text if it has changed
    this.setText();
  }

  public getOutputs(): IOutputs {
    return {
      AutoWidth: this.state.width,
    };
  }

  public destroy(): void {
    this.detatchEventListeners();
  }

  private setText() {
    const text = this.context.parameters.Text.raw ?? "";
    if (this.labelText.innerText !== text) {
      this.labelText.innerText = text;
    }
  }

  private setStyles(): void {
    const { context, labelText } = this;

    // Set the tabindex because canvas-apps always assigns one even if tabindex is zero in the App
    // This is undocumented but there is no alternative
    const assignedTabIndex = (context as unknown as ContextEx).accessibility?.assignedTabIndex ?? 0;
    if (assignedTabIndex > 0 && labelText.tabIndex !== assignedTabIndex) labelText.tabIndex = assignedTabIndex;

    // We set the styles to empty CSS string if not set - this is to overwrite previous values if the property is cleared
    const accessibleLabel = (context as unknown as ContextEx).accessibility?.assignedTooltip ?? "";
    if (accessibleLabel !== labelText.title) labelText.title = accessibleLabel;
    setFontStyles(labelText, context.parameters);
    setBorderStyles(labelText, context.parameters);
    this.setStateDependentStyles();
  }

  private setStateDependentStyles() {
    const { labelText, context, state } = this;
    setStateDepFontStyles(labelText, context.parameters, state);
    setStateDepBorderAndFillStyles(labelText, context.parameters, state);
  }

  private updateStateFromContext() {
    this.state.isDisabled = this.context.mode.isControlDisabled;
  }

  private attachEventListeners() {
    const { labelText: labelTextContainer } = this;
    labelTextContainer.addEventListener("click", this.onClick);
    labelTextContainer.addEventListener("mouseenter", this.mouseEnter);
    labelTextContainer.addEventListener("mouseleave", this.mouseLeave);
    labelTextContainer.addEventListener("focus", this.onFocus);
    labelTextContainer.addEventListener("blur", this.onBlur);

    // Use the ResizeObserver to detect when the label increases in width
    this.ro = new ResizeObserver(this.resizeHandler);
    this.ro.observe(this.labelContainer);
  }

  private detatchEventListeners() {
    const { labelText: labelTextContainer } = this;
    labelTextContainer.removeEventListener("click", this.onClick);
    labelTextContainer.removeEventListener("mouseenter", this.mouseEnter);
    labelTextContainer.removeEventListener("mouseleave", this.mouseLeave);
    labelTextContainer.removeEventListener("focus", this.onFocus);
    labelTextContainer.removeEventListener("blur", this.onBlur);

    // Stop the ResizeObserver listening for resize events
    this.ro.disconnect();
  }

  resizeHandler = (entries: ResizeObserverEntry[]): void => {
    let width = 0;

    // There should only be a single element ever bound to this resize observer
    if (entries.length > 0) {
      const entry = entries[0];
      if (entry.contentBoxSize && entry.contentBoxSize.length > 0) {
        // For horizontal writing mode, inlineSize is the width
        width = entry.contentBoxSize[0].inlineSize;
      } else {
        // Support for safari on iOS
        width = entry.contentRect.width;
      }
    }

    this.state.width = width;
    this.notifyOutputChanged();
  };

  onClick = (): void => {
    // ISSUE - There isn't anyway of calling OnSelect event for field controls
  };

  mouseEnter = (): void => {
    this.state.isHover = true;
    this.setStateDependentStyles();
  };

  mouseLeave = (): void => {
    this.state.isHover = false;
    this.setStateDependentStyles();
  };

  onFocus = (): void => {
    this.state.isFocus = true;
    this.setStateDependentStyles();
  };

  onBlur = (): void => {
    this.state.isFocus = false;
    this.setStateDependentStyles();
  };
}
