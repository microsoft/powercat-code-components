/* istanbul ignore file */

import { IInputs } from "../generated/ManifestTypes";
import { MockEnumProperty, MockStringProperty, MockTwoOptionsProperty } from "./mock-context";
import { MockDataSet } from "./mock-datasets";

export function getMockParameters(): IInputs {
  return {
    Title: new MockStringProperty(),
    Items: new MockDataSet([]),
    Body:new MockStringProperty(),
    LinkText:new MockStringProperty(),
    URL:new MockStringProperty(),
    HideDismiss:new MockTwoOptionsProperty(),
    Intent: new MockEnumProperty(),
    Shape:new MockEnumProperty()


  };
}
