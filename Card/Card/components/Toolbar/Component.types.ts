import type { ToolbarProps } from "@fluentui/react-components";

export interface IToolbarItem {
  id: string;
  appearance: "primary" | "subtle" | "transparent" | undefined;
  disabled?: boolean;
  iconName?: string;
  iconStyle?: string;
  tooltip?: string;
  key: string;
  name: string;
  visible?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface CustomToolbarProps extends ToolbarProps {
  items: IToolbarItem[];
  onSelected: (item: IToolbarItem, onSelectCalled?: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
  selectedValue?: string;
  width: number;
  layout: "before" | "after" | "above" | "icon" | "text";
  getPopoverRoot: () => HTMLElement;
}
