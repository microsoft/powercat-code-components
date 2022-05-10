import ResizeObserver from "resize-observer-polyfill";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { InputEvents, InputParameters, OutputParameterFlags } from "./ManifestTypes";
import {
  getPixelValueFromStyle,
  setBorderStyles,
  setFontStyles,
  setStateDepBorderAndFillStyles,
  setStateDepFontStyles,
  setTextAreaStyles,
} from "./component.styles";
import { ContextEx, Rectangle, ComponentState } from "./component.types";

const defaultState: ComponentState = {
  isHover: false,
  isFocus: false,
  isDisabled: false,
  isMasked: false,
  text: "",
};

export class ResizableTextarea implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  container: HTMLDivElement;
  notifyOutputChanged: () => void;
  id: string;
  context: ComponentFramework.Context<IInputs>;
  ro: ResizeObserver;
  textChangeHandler: EventListener;
  outerContainer: HTMLDivElement;
  borderFillContainer: HTMLDivElement;
  borderInner: HTMLDivElement;
  textarea: HTMLTextAreaElement;
  state: ComponentState = { ...defaultState };
  prevParameters: InputParameters = { Text: "", Default: "" };
  outputs: OutputParameterFlags = {};

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement,
  ): void {
    this.context = context;
    this.container = container;
    this.notifyOutputChanged = notifyOutputChanged;

    // The textarea is wrapped in 3 divs:
    // 1. textarea-outer - controls the size of the border box so that wraps the textarea
    // 2. borderFillContainer - is styled to provide a border box
    // 3. borderInnner - is styled to provide an offset margin to allow borders to be centered on the outer border just like canvas app controls
    this.textarea = document.createElement("textarea");

    this.borderInner = document.createElement("div");
    this.borderInner.className = "cat-textarea-border-inner";
    this.borderInner.appendChild(this.textarea);

    this.borderFillContainer = document.createElement("div");
    this.borderFillContainer.className = "cat-textarea-border-container";
    this.borderFillContainer.appendChild(this.borderInner);

    this.outerContainer = document.createElement("div");
    this.outerContainer.className = "cat-textarea-outer";
    this.outerContainer.appendChild(this.borderFillContainer);
    this.updateStateFromContext();
    this.setTextAreaValue(this.context.parameters.Default?.raw ?? this.context.parameters.Text?.raw ?? "");
    this.setInitialStyle();
    this.container.appendChild(this.outerContainer);

    // Listen for resize/focus/hover
    this.attachEventListeners();

    // If the default width/height is not set, we use the control width/height
    this.context.mode.trackContainerResize(true);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.context = context;

    // Get disabled state using the model-driven security if available
    this.updateStateFromContext();

    const newParameters: InputParameters = this.getParameters(context);
    const resets: OutputParameterFlags = this.getResets(newParameters);

    // Set the styles - the size can be reset based on the input events
    this.setStyles(newParameters, resets);

    // If the Default value changes (or the TextReset event is received)
    // Reset the Text value to match the Default. This allows the component
    // to participlate in forms that are reset when saving/new
    const textValueChanged = this.context.updatedProperties.indexOf("Text") > -1;
    const defaultValueChanged = this.context.updatedProperties.indexOf("Default") > -1 || resets.text;

    if (defaultValueChanged) {
      this.setTextAreaValue(newParameters.Default);
    } else if (textValueChanged) {
      this.setTextAreaValue(newParameters.Text);
    }

    if (this.state.text !== newParameters.Text) {
      // This is only applicable to canvas-apps where the text bound property
      // must be in sync with the default when reset
      this.raiseNotifyOutputChanged({ text: true });
    }

    this.prevParameters = newParameters;
  }

  public getOutputs(): IOutputs {
    const outputs: IOutputs = {};
    if (this.outputs.resizedHeight && this.state.size) outputs.ResizedHeight = this.state.size.height;
    if (this.outputs.resizedWidth && this.state.size) outputs.ResizedWidth = this.state.size.width;
    if (this.outputs.text) outputs.Text = this.state.text;
    this.outputs = {};

    return outputs;
  }

  public destroy(): void {
    this.detatchEventListeners();
  }

  private getParameters(context: ComponentFramework.Context<IInputs>): InputParameters {
    // Correct width for model-driven apps
    const paddingAdjustment = context.parameters.LeftPaddingAdjustment?.raw ?? 0;

    const allocatedHeight = context.mode.allocatedHeight === -1 ? undefined : context.mode.allocatedHeight;
    const allocatedWidth =
      context.mode.allocatedWidth === -1 ? undefined : context.mode.allocatedWidth - paddingAdjustment;

    return {
      DefaultHeight: context.parameters.DefaultHeight?.raw || allocatedHeight,
      DefaultWidth: context.parameters.DefaultWidth?.raw || allocatedWidth,
      InputEvent: context.parameters.InputEvent?.raw,
      Text: this.context.parameters.Text?.raw ?? "",
      Default: this.context.parameters.Default?.raw ?? "",
    };
  }

  // The InputEvent property allows reseting of various propertes
  // Additionally, when the default height/width changes, then the the resized size is reset
  private getResets(newParameters: InputParameters) {
    const resets: OutputParameterFlags = {};

    // Process Input events
    if (this.prevParameters.InputEvent !== newParameters.InputEvent) {
      const inputEvent = this.context.parameters.InputEvent?.raw || "";
      if (inputEvent.indexOf(InputEvents.SetFocus) > -1) {
        this.textarea.focus();
      }
      if (inputEvent.indexOf(InputEvents.ResetSize) > -1) {
        resets.resizedWidth = true;
        resets.resizedHeight = true;
      }
      if (inputEvent.indexOf(InputEvents.ResetWidth) > -1) {
        resets.resizedWidth = true;
      }
      if (inputEvent.indexOf(InputEvents.ResetHeight) > -1) {
        resets.resizedHeight = true;
      }
      if (inputEvent.indexOf(InputEvents.ResetText) > -1) {
        resets.text = true;
      }
    }

    // If the Default height/widths have changed, then also reset them
    resets.resizedHeight = resets.resizedHeight || this.prevParameters.DefaultHeight !== newParameters.DefaultHeight;
    resets.resizedWidth = resets.resizedWidth || this.prevParameters.DefaultWidth !== newParameters.DefaultWidth;

    return resets;
  }

  // Gets the size of the textarea, clipping where needed
  private getOutputCalculatedSize(): Rectangle {
    const textArea = this.textarea;
    const size = {
      width: getPixelValueFromStyle(textArea.style.width),
      height: getPixelValueFromStyle(textArea.style.height),
    };

    // Because the resize handler can get a mouse resize before the height is clipped,
    // we manually clip here before giving to the host
    const maxHeight =
      (this.context.parameters.MaxHeight.raw ?? 0) > 0 ? this.context.parameters.MaxHeight?.raw : undefined;
    const maxWidth =
      (this.context.parameters.MaxWidth.raw ?? 0) > 0 ? this.context.parameters.MaxWidth?.raw : undefined;

    if (maxHeight) size.height = Math.min(size.height, maxHeight);
    if (maxWidth) size.width = Math.min(size.width, maxWidth);

    return size;
  }

  private updateStateFromContext() {
    this.state.isDisabled = this.context.mode.isControlDisabled;
    if (this.context.parameters.Text.security) {
      this.state.isMasked = !this.context.parameters.Text.security.readable;
      this.state.isDisabled =
        this.state.isDisabled || !this.context.parameters.Text.security.editable || this.state.isMasked;
    }
  }

  // Sets the styles when the elements are first created
  private setInitialStyle(): void {
    const parameters = this.getParameters(this.context);
    this.setStyles(parameters, { resizedWidth: true, resizedHeight: true });
  }

  // Sets the styles of the DOM elements, only updating if they are different to the current values
  private setStyles(newProperties: InputParameters, resets: OutputParameterFlags): void {
    const { context, textarea } = this;
    const newStyles = context.parameters;

    // Set the tabindex because canvas-apps always assigns one even if tabindex is zero in the App
    // This is undocumented but there is no alternative
    const assignedTabIndex = (context as unknown as ContextEx).accessibility?.assignedTabIndex ?? 0;
    if (assignedTabIndex > 0 && textarea.tabIndex !== assignedTabIndex) textarea.tabIndex = assignedTabIndex;

    const height = newProperties.DefaultHeight !== undefined ? `${newProperties.DefaultHeight}px` : undefined;
    if (resets.resizedHeight && height !== textarea.style.height) textarea.style.height = height ?? "";

    const width = newProperties.DefaultWidth !== undefined ? `${newProperties.DefaultWidth}px` : undefined;
    if (resets.resizedWidth && width !== textarea.style.width) textarea.style.width = width ?? "";

    if (textarea.disabled !== this.state.isDisabled) {
      textarea.disabled = this.state.isDisabled;
    }

    setFontStyles(textarea, newStyles);
    setBorderStyles(this.borderFillContainer, this.borderInner, newStyles);
    setTextAreaStyles(textarea, newStyles);

    this.setStateDependentStyles();
  }

  // Sets the state dependent styles of the DOM elements, only updating if they are different to the current values
  private setStateDependentStyles() {
    const { context, textarea, borderFillContainer, borderInner, state } = this;
    const parameters = context.parameters;

    // Hint Text - can be different when focused
    const hintText = parameters.HintText?.raw ?? "";
    const placeholderContent = parameters.EmptyPlaceholderText?.raw;
    const stateHintText = state.isFocus ? hintText : placeholderContent || hintText;
    if (stateHintText !== textarea.placeholder) textarea.placeholder = stateHintText;

    setStateDepFontStyles(textarea, parameters, state);
    setStateDepBorderAndFillStyles(borderFillContainer, borderInner, parameters, state);
  }

  private setTextAreaValue(text: string) {
    if (this.textarea.value !== text) {
      this.textarea.value = text;
      this.state.text = text;
    }
  }

  private attachEventListeners() {
    const { textarea } = this;
    textarea.addEventListener("input", this.onTextChanged);
    textarea.addEventListener("mouseenter", this.mouseEnter);
    textarea.addEventListener("mouseleave", this.mouseLeave);
    textarea.addEventListener("focus", this.onFocus);
    textarea.addEventListener("blur", this.onBlur);

    // The borderInner mouse over events are only used when the text area is disabled
    this.borderInner.addEventListener("mouseenter", this.mouseEnter);
    this.borderInner.addEventListener("mouseleave", this.mouseLeave);

    // Use the ResizeObserver to detect when the text area has been resized by the user
    this.ro = new ResizeObserver(this.resizeHandler);
    this.ro.observe(textarea);
  }

  private detatchEventListeners() {
    const { textarea } = this;
    textarea.removeEventListener("input", this.textChangeHandler);
    textarea.removeEventListener("mouseenter", this.mouseEnter);
    textarea.removeEventListener("mouseleave", this.mouseLeave);
    textarea.removeEventListener("focus", this.onFocus);
    textarea.removeEventListener("blur", this.onBlur);

    // The borderInner mouse over events are only used when the text area is disabled
    this.borderInner.removeEventListener("mouseenter", this.mouseEnter);
    this.borderInner.removeEventListener("mouseleave", this.mouseLeave);

    // Stop the ResizeObserver listening for resize events
    this.ro.disconnect();
  }

  resizeHandler = (): void => {
    this.state.size = this.getOutputCalculatedSize();
    // Set the size of the wrapper to ensure the border is shown around the textarea

    if (getPixelValueFromStyle(this.outerContainer.style.width) !== this.state.size.width) {
      this.outerContainer.style.width = `${this.state.size.width}px`;
    }

    if (getPixelValueFromStyle(this.outerContainer.style.height) !== this.state.size.height) {
      this.outerContainer.style.height = `${this.state.size.height}px`;
    }
    this.raiseNotifyOutputChanged({ resizedHeight: true, resizedWidth: true });
  };

  onTextChanged = (ev: Event): void => {
    this.state.text = (ev.target as HTMLTextAreaElement).value;
    this.raiseNotifyOutputChanged({ text: true });
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

  private raiseNotifyOutputChanged(outputsChanged: OutputParameterFlags) {
    // Merge outputs changed
    this.outputs = { ...this.outputs, ...outputsChanged };
    this.notifyOutputChanged();
  }
}
