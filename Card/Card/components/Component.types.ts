import type { CardProps } from "@fluentui/react-components";
import { IToolbarItem } from "./Toolbar/Component.types";

export interface CustomCardProps extends CardProps {
  key: string;
  visible?: boolean;
  title: string;
  subTitle: string;
  headerImage: string;
  image: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: IToolbarItem[];
  width: number;
  height: number;
  disabled: boolean;
  onSelected: (item?: IToolbarItem, onSelectCalled?: boolean) => void;
  getPopoverRoot: () => HTMLElement;
  onResize?: (height: number) => void;
  ariaLabel?: string;
  placePreview?: string;
  selectedValue?: string;
  accessibleLabel: string;
}
