/* istanbul ignore file */

import { IInputs } from "../generated/ManifestTypes";
import { MockEnumProperty, MockStringProperty, MockWholeNumberProperty } from "./mock-context";
import { MockDataSet } from "./mock-datasets";

export function getMockParameters(): IInputs {
  return {
    AccessibleLabel: new MockStringProperty(),
    Title: new MockStringProperty(),
    Subtitle: new MockStringProperty(),
    Description: new MockStringProperty(),
    Items: new MockDataSet([]),
    Alignment: new MockEnumProperty(),
    HeaderImage: new MockStringProperty(),
    Image: new MockStringProperty(),
    ImagePlacement: new MockEnumProperty(),
    Size: new MockEnumProperty(),
    TabIndex: new MockWholeNumberProperty(),
    Tooltip: new MockStringProperty(),
  };
}
