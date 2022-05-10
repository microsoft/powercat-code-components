export enum BorderStyles {
  Normal = 0,
  Centred = 1,
}

export const ResizeTypes: Record<"0" | "1" | "2" | "3", string> = {
  "0": "none",
  "1": "both",
  "2": "vertical",
  "3": "horizontal",
};

export interface InputParameters {
  DefaultHeight?: number | null;
  DefaultWidth?: number | null;
  InputEvent?: string | null;
  Text: string;
  Default: string;
}

export interface OutputParameterFlags {
  resizedHeight?: boolean;
  resizedWidth?: boolean;
  text?: boolean;
}

export const enum InputEvents {
  SetFocus = "SetFocus",
  ResetSize = "ResetSize",
  ResetWidth = "ResetWidth",
  ResetHeight = "ResetHeight",
  ResetText = "ResetText",
}

export const enum FontSizeUnits {
  Pt = "0",
  Px = "1",
}
