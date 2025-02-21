/* eslint-disable sonarjs/cognitive-complexity */
import * as React from 'react';
import { OverflowItem, mergeClasses, ToolbarButton, Tooltip, Overflow, Toolbar } from '@fluentui/react-components';
import type { ToolbarButtonProps } from '@fluentui/react-components';
import type { CustomToolbarProps, IToolbarItem } from './Component.types';
import { OverflowMenu } from './OverflowMenu';
import { useOverflowStyles } from './ToolbarComponent.styles';
import { getFluentIcon } from './Icon';

export const ToolbarComponent = React.memo((props: CustomToolbarProps) => {
    const { items, onSelected, ariaLabel, disabled, key, getPopoverRoot, /*width,*/ layout } = props;
    const styles = useOverflowStyles();

    // Return a different component if items.length is 1
    if (items.length === 1) {
        const item = items[0];
        const iconToRender = item.iconName && getFluentIcon(item.iconName, item.iconStyle);
        const buttonProps: ToolbarButtonProps = {
            value: item.key,
            className: mergeClasses(styles.toolbarBtnStyle, styles.rootOverride),
            style: { fontSize: '12px', fontWeight: '600', minHeight: '22px' },
            disabled: disabled || item.disabled,
            appearance: item.appearance,
            onClick: (event) => {
                event.stopPropagation();
                onSelected(item);
            },
        };

        return (
            <Toolbar aria-label={ariaLabel} style={{ gap: 'var(--spacingHorizontalM)', padding: 0 }}>
                <ToolbarButton {...buttonProps} className={styles.content}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacingHorizontalSNudge)' }}>
                        {iconToRender}
                        {item.name}
                    </span>
                </ToolbarButton>
            </Toolbar>
        );
    }

    const onCheckedValueChange = React.useCallback(
        (dataValue: string) => {
            const selectedItem = items.find((i) => i.key === dataValue);
            if (selectedItem) {
                onSelected(selectedItem);
            }
        },
        [onSelected, items],
    );

    const toolbarButtons = React.useMemo(() => {
        return items.map((item: IToolbarItem) => {
            const iconToRender = item.iconName && getFluentIcon(item.iconName, item.iconStyle);
            const useColorOverride = !(disabled || item.disabled) && item.appearance === 'primary';
            const buttonClasses = mergeClasses(styles.toolbarBtnStyle, !useColorOverride && styles.rootOverride);

            const buttonProps: ToolbarButtonProps = {
                value: item.key,
                className: buttonClasses,
                style: { fontSize: '12px', fontWeight: '600', minHeight: '22px', ...(layout === 'icon' || !item?.name ? { minWidth: 'fit-content' } : {}) },
                disabled: disabled || item.disabled,
                appearance: item.appearance,
                onClick: (event) => {
                    event.stopPropagation(); // Prevent the click from bubbling up to the card
                    onCheckedValueChange(item.key);
                },
            };

            const toolbarButton = (
                <ToolbarButton {...buttonProps} className={styles.content}>
                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacingHorizontalSNudge)',
                        }}
                    >
                        {(layout === 'before' || layout === 'icon') && iconToRender}
                        {layout !== 'icon' && item.name && <>{item.name}</>}
                        {layout === 'after' && iconToRender}
                    </span>
                </ToolbarButton>
            );

            return (
                <OverflowItem key={item.key} id={item.key}>
                    {item.tooltip ? (
                        <Tooltip content={item.tooltip} relationship="description" withArrow>
                            {toolbarButton}
                        </Tooltip>
                    ) : (
                        toolbarButton
                    )}
                </OverflowItem>
            );
        });
    }, [items, disabled, styles.toolbarBtnStyle, styles.rootOverride, styles.content, onCheckedValueChange]);

    return (
        <Overflow key={key} overflowAxis={'horizontal'}>
            <Toolbar
                className={styles.default}
                aria-label={ariaLabel}
                style={{ gap: 'var(--spacingHorizontalM)', padding: 0 }}
            >
                {toolbarButtons}
                <OverflowMenu
                    layout={layout}
                    onCheckedValueChange={onCheckedValueChange}
                    items={items}
                    getPopoverRoot={getPopoverRoot}
                    disabled={disabled}
                />
            </Toolbar>
        </Overflow>
    );
});

ToolbarComponent.displayName = 'ToolbarComponent';
