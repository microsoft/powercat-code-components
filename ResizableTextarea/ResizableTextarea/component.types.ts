/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Rectangle {
  width: number;
  height: number;
}

// This is undocumented - but needed since canvas apps sets non-zero tabindexes
// so we must use the tabindex provided by the context for accessibility purposes
export interface ContextEx {
  accessibility: {
    assignedTabIndex: number;
  };
}

export interface ComponentState {
  isHover: boolean;
  isFocus: boolean;
  isDisabled: boolean;
  isMasked: boolean;
  text: string;
  size?: Rectangle;
}
