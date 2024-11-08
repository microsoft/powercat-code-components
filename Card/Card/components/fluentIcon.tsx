import * as React from "react";
import type { FluentIconProps } from "./FluentIcon.types";
import { FluentIcons } from "./Icons";

export const FluentIcon: React.FC<FluentIconProps> = ({ fluentIconName, fluentIconProps }) => {
  const Icon = React.useMemo(() => FluentIcons[fluentIconName] ?? FluentIcons["CircleRegular"], [fluentIconName]);
  return <Icon {...fluentIconProps} data-testid={Icon.displayName} />;
};
