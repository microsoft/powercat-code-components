/* istanbul ignore file */

import { IInputs } from "../generated/ManifestTypes";
import { MockStringProperty } from "./mock-context";

export function getMockParameters(): IInputs {
  return {
    KeyConfig: new MockStringProperty(),
    OnKey: new MockStringProperty(),
  };
}
