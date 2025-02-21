import * as React from 'react';

import { MenuItem, Tooltip, useIsOverflowItemVisible } from '@fluentui/react-components';

import type { IToolbarItem } from './Component.types';
import { getFluentIcon } from './Icon';
import { useOverflowMenuItemStyles } from './OverflowMenuItem.styles';

type OverflowMenuItemProps = {
  button: IToolbarItem;
  layout?: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
};
/**
 * A menu item for an overflow menu that only displays when the toolbar is not visible
 */
export const OverflowMenuItem = React.memo((props: OverflowMenuItemProps) => {
    const { button, onClick, layout, disabled } = props;

    const isVisible = useIsOverflowItemVisible(button.key);
    if (isVisible) {
        return null;
    }

    const styles = useOverflowMenuItemStyles();
    const iconToRender = button.iconName && getFluentIcon(button.iconName, button.iconStyle);
    const menuItem = (
        <MenuItem
            key={button.key}
            onClick={onClick}
            style={{ minHeight: '32px' }}
            disabled={disabled || button.disabled}
            icon={{ className: styles.icon }} // Hide icon to remove space
        >
            <span
                style={{
                    display: 'flex',
                    gap: 'var(--spacingHorizontalSNudge)',
                    alignItems: 'center',
                }}
            >
                {layout === 'before' && iconToRender}
                {layout === 'above' && iconToRender}
                {layout === 'icon' && iconToRender}
                {layout !== 'icon' && button.name}
                {layout === 'after' && iconToRender}
            </span>
        </MenuItem>
    );
    return button.tooltip ? (
        <Tooltip content={button.tooltip} relationship="description" withArrow>
            {menuItem}
        </Tooltip>
    ) : (
        menuItem
    );
});
OverflowMenuItem.displayName = 'OverflowMenuItem';
