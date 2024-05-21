import { IInputs } from "./generated/ManifestTypes";
import { BorderStyles, FontSizeUnits, ResizeTypes } from "./ManifestTypes";
import { ComponentState } from "./component.types";

export function setFontStyles(element: HTMLElement, newStyles: IInputs): void {
  const fontFamily = newStyles.FontName.raw ?? "";
  if (element.style.fontFamily !== fontFamily) element.style.fontFamily = fontFamily;

  const fontSize =
    newStyles.FontSizeUnits.raw === FontSizeUnits.Pt
      ? getPointStyleFromParameter(newStyles.FontSize)
      : getPixelStyleFromParameter(newStyles.FontSize);
  if (element.style.fontSize !== fontSize) element.style.fontSize = fontSize;

  const paddingLeft = getPixelStyleFromParameter(newStyles.PaddingLeft);
  if (element.style.paddingLeft !== paddingLeft) element.style.paddingLeft = paddingLeft;

  const paddingRight = getPixelStyleFromParameter(newStyles.PaddingRight);
  if (element.style.paddingRight !== paddingRight) element.style.paddingRight = paddingRight;

  const paddingTop = getPixelStyleFromParameter(newStyles.PaddingTop);
  if (element.style.paddingTop !== paddingTop) element.style.paddingTop = paddingTop;

  const paddingBottom = getPixelStyleFromParameter(newStyles.PaddingBottom);
  if (element.style.paddingBottom !== paddingBottom) element.style.paddingBottom = paddingBottom;
}

export function setStateDepFontStyles(element: HTMLElement, newStyles: IInputs, state: ComponentState): void {
  // Font Color
  const fontColor =
    selectStateValue(
      state,
      newStyles.FontColor?.raw,
      newStyles.DisabledFontColor?.raw,
      newStyles.FocusFontColor?.raw,
      newStyles.HoverFontColor?.raw,
    ) ?? "";
  if (fontColor !== element.style.color) element.style.color = fontColor;

  // Font Weight
  const fontWeight =
    selectStateValue(
      state,
      newStyles.FontWeight?.raw,
      newStyles.DisabledFontWeight?.raw,
      newStyles.FocusFontWeight?.raw,
      newStyles.HoverFontWeight?.raw,
    ) ?? "";
  if (fontWeight !== element.style.fontWeight) element.style.fontWeight = fontWeight;
}

export function setBorderStyles(
  outerContainer: HTMLDivElement,
  _innerContainer: HTMLDivElement,
  newStyles: IInputs,
): void {
  const borderRadius = getPixelStyleFromParameter(newStyles.BorderRadius);
  if (outerContainer.style.borderRadius !== borderRadius) outerContainer.style.borderRadius = borderRadius;
}

export function setStateDepBorderAndFillStyles(
  outerContainer: HTMLDivElement,
  innerContainer: HTMLDivElement,
  newStyles: IInputs,
  state: ComponentState,
): void {
  // Border Width
  const borderWidth =
    selectStateValue(
      state,
      newStyles.BorderThickness?.raw,
      newStyles.BorderThickness?.raw,
      newStyles.FocusBorderThickness?.raw,
      newStyles.HoverBorderThickness?.raw,
    ) ?? 0;

  const borderWidthPx = `${borderWidth}px`;
  if (borderWidthPx !== outerContainer.style.borderWidth) {
    outerContainer.style.borderWidth = borderWidthPx;

    // There are two modes:
    // 1. centered - borders will expand around the outer border-box like in canvas apps
    // 2. inner - borders will expand inwards like in model-driven apps and the fluent ui controls
    if (newStyles.RenderBorderStyle?.raw === BorderStyles.Centred.toString()) {
      outerContainer.style.margin = `${-borderWidth / 2}px`;
      innerContainer.style.margin = `${-borderWidth / 2}px`;
    } else {
      innerContainer.style.margin = `${-borderWidth}px`;
    }
  }

  // Border Color
  const borderColor =
    selectStateValue(
      state,
      newStyles.BorderColor?.raw,
      newStyles.DisabledBorderColor?.raw,
      newStyles.FocusBorderColor?.raw,
      newStyles.HoverBorderColor?.raw,
    ) ?? "";
  if (borderColor !== outerContainer.style.borderColor) outerContainer.style.borderColor = borderColor;

  // Background Color
  const fillColor =
    selectStateValue(
      state,
      newStyles.FillColor?.raw,
      newStyles.DisabledFillColor?.raw,
      newStyles.FocusFillColor?.raw,
      newStyles.HoverFillColor?.raw,
      newStyles.DisabledHoverFillColor?.raw,
    ) ?? "";
  if (fillColor !== outerContainer.style.background) outerContainer.style.background = fillColor;
}

export function setTextAreaStyles(element: HTMLTextAreaElement, newStyles: IInputs): void {
  const enableSpellCheck = newStyles.EnableSpellCheck?.raw === "1" ?? false;
  if (element.spellcheck !== enableSpellCheck) element.spellcheck = enableSpellCheck;

  const resizeMode = ResizeTypes[newStyles.AllowResize?.raw ?? "1"];
  if (element.style.resize !== resizeMode) element.style.resize = resizeMode;

  const maxLength = (newStyles.MaxLength?.raw ?? 0) > 0 ? (newStyles.MaxLength.raw as number) : 100000;
  if (maxLength !== element.maxLength) element.maxLength = maxLength;

  const maxWidth = getPixelStyleFromParameter(newStyles.MaxWidth);
  if (maxWidth !== element.style.maxWidth) element.style.maxWidth = maxWidth;

  const maxHeight = getPixelStyleFromParameter(newStyles.MaxHeight);
  if (maxHeight !== element.style.maxHeight) element.style.maxHeight = maxHeight;

  const minWidth = getPixelStyleFromParameter(newStyles.MinWidth);
  if (minWidth !== element.style.minWidth) element.style.minWidth = minWidth;

  const minHeight = getPixelStyleFromParameter(newStyles.MinHeight);
  if (minHeight !== element.style.minHeight) element.style.minHeight = minHeight;

  const accessibleLabel = newStyles.AccessibilityLabel?.raw ? newStyles.AccessibilityLabel?.raw : "";
  if (accessibleLabel !== element.ariaLabel) element.ariaLabel = accessibleLabel;
}

// Returns the stle for the corresponding state using the correct priority
// Priority is: disabled:hover | disabled | focus | hover | default
export function selectStateValue<T>(
  state: ComponentState,
  defaultValue: T,
  disabledValue?: T,
  focusedValue?: T,
  hoverValue?: T,
  disabledHoverValue?: T,
): T {
  if (state.isHover && state.isDisabled && disabledHoverValue) {
    return disabledHoverValue;
  } else if (state.isDisabled && disabledValue) {
    return disabledValue;
  } else if (state.isFocus && focusedValue) {
    return focusedValue;
  } else if (state.isHover && !state.isDisabled && hoverValue) {
    return hoverValue;
  }
  return defaultValue;
}

// Returns a the number of pixels from a style string
export function getPixelValueFromStyle(pixelString?: string): number {
  if (pixelString) {
    const value = Number.parseInt(pixelString.replace("px", ""));
    return Number.isNaN(value) ? 0 : value;
  } else return 0;
}

// We set the styles to empty CSS string if not set - this is to overwrite previous values if the property is cleared
export function getPixelStyleFromParameter(pixelValue: ComponentFramework.PropertyTypes.NumberProperty): string {
  return (pixelValue?.raw ?? 0) > 0 ? `${pixelValue.raw}px` : "";
}

export function getPointStyleFromParameter(pointValue: ComponentFramework.PropertyTypes.NumberProperty): string {
  return (pointValue?.raw ?? 0) > 0 ? `${pointValue.raw}pt` : "";
}
