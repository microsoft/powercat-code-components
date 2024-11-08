import type { FluentIconsProps as FluentUIIconsProps } from "@fluentui/react-icons";
import { FluentIcons } from "./Icons";

export type FluentIconName = keyof typeof FluentIcons;

export type FluentIconProps = {
  /** Name of the fluent icon to return. If not provided (or not found), CircleRegular icon will return. */
  fluentIconName: FluentIconName;
  /** Native props for the fluent icon. See https://react.fluentui.dev/?path=/docs/concepts-developer-icons-icons--page#list-of-available-props */
  fluentIconProps?: FluentUIIconsProps;
};
