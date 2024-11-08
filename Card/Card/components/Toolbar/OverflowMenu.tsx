import * as React from "react";
import { useEffect, useState } from "react";

import { useOverflowMenu, Menu, MenuTrigger, MenuList, MenuPopover, Button } from "@fluentui/react-components";
import { bundleIcon, MoreHorizontalFilled, MoreHorizontalRegular } from "@fluentui/react-icons";

import type { IToolbarItem } from "./Component.types";
import { useOverflowMenuStyles } from "./OverflowMenu.styles";
import { OverflowMenuItem } from "./OverflowMenuItem";

type OverflowMenuProps = {
  onCheckedValueChange?: (btnIds: string) => void;
  items: IToolbarItem[];
  getPopoverRoot: () => HTMLElement;
  disabled?: boolean;
  layout?: string;
};

/**
 * A menu for selecting menuitem that have overflowed and are not visible.
 */
const MoreHorizontal = bundleIcon(MoreHorizontalFilled, MoreHorizontalRegular);
export const OverflowMenu = React.memo((props: OverflowMenuProps) => {
  const { onCheckedValueChange, items, layout, getPopoverRoot, disabled } = props;
  const { ref, isOverflowing, overflowCount } = useOverflowMenu<HTMLButtonElement>();
  const [popoverRoot, setPopoverRoot] = useState<HTMLElement>();

  // update state if props change
  useEffect(() => {
    setPopoverRoot(getPopoverRoot());
  }, [getPopoverRoot]);

  const styles = useOverflowMenuStyles();

  if (!isOverflowing) {
    return null;
  }

  return (
    <Menu hasIcons mountNode={popoverRoot}>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance="transparent"
          className={styles.menuButton}
          disabled={disabled}
          ref={ref}
          icon={{
            children: <MoreHorizontal />,
          }}
          aria-label={`${overflowCount} more options`}
        />
      </MenuTrigger>
      <MenuPopover className={styles.menuPopOver}>
        <MenuList className={styles.menu}>
          {items.map((item) => (
            <OverflowMenuItem
              key={item.key}
              button={item}
              layout={layout}
              onClick={() => onCheckedValueChange?.(item.key)}
            />
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
});
OverflowMenu.displayName = "OverflowMenu";
