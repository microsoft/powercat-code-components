/* istanbul ignore file */

import { IInputs } from "../generated/ManifestTypes";
import {
  MockDecimalNumberProperty,
  MockEnumProperty,
  MockStringProperty,
  MockWholeNumberProperty,
} from "./mock-context";

export function getMockParameters(): IInputs {
  return {
    Text: new MockStringProperty(),
    PaddingLeft: new MockWholeNumberProperty(),
    PaddingRight: new MockWholeNumberProperty(),
    PaddingTop: new MockWholeNumberProperty(),
    PaddingBottom: new MockWholeNumberProperty(),
    FontName: new MockStringProperty(),
    FontSize: new MockDecimalNumberProperty(),
    FontSizeUnits: new MockEnumProperty("1"),
    FontColor: new MockStringProperty(),
    FontWeight: new MockStringProperty(),
    DisabledFontColor: new MockStringProperty(),
    DisabledFontWeight: new MockStringProperty(),
    FocusFontColor: new MockStringProperty(),
    FocusFontWeight: new MockStringProperty(),
    HoverFontColor: new MockStringProperty(),
    HoverFontWeight: new MockStringProperty(),
    FillColor: new MockStringProperty(),
    DisabledFillColor: new MockStringProperty(),
    FocusFillColor: new MockStringProperty(),
    HoverFillColor: new MockStringProperty(),
    //DisabledHoverFillColor: new MockStringProperty(),
    BorderColor: new MockStringProperty(),
    BorderThickness: new MockWholeNumberProperty(),
    BorderRadius: new MockWholeNumberProperty(),
    DisabledBorderColor: new MockStringProperty(),
    FocusBorderColor: new MockStringProperty(),
    FocusBorderThickness: new MockWholeNumberProperty(),
    HoverBorderColor: new MockStringProperty(),
    HoverBorderThickness: new MockWholeNumberProperty(),
    //RenderBorderStyle: new MockEnumProperty<"0" | "1">(),
  };
}
