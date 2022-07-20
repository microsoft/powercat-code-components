import {
    IButtonProps,
    ICommandBarStyles,
    IContextualMenuItem,
    createTheme,
    ThemeProvider,
    IPartialTheme,
    ICommandBar,
} from '@fluentui/react';
import * as React from 'react';
import { CommandBar as CommandBarCustom } from '../fluentui-fork/CommandBar/CommandBar';
import { CanvasCommandBarProps, CanvasCommandItem } from './Component.types';
import { useAsync } from '@fluentui/react-hooks';
import { getCommandsWithChildren } from './DatasetMapping';

const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

function getCommandBarItems(
    items: CanvasCommandItem[],
    isDisabled: boolean,
    onClick: (ev?: React.MouseEvent<HTMLButtonElement>, item?: IContextualMenuItem | undefined) => boolean,
) {
    const rootItems = getCommandsWithChildren(
        items.filter((i) => i.farItem !== true && i.overflow !== true),
        isDisabled,
        onClick,
    );
    const farItems = getCommandsWithChildren(
        items.filter((i) => i.farItem === true && i.overflow !== true),
        isDisabled,
        onClick,
    );
    const overflowItems = getCommandsWithChildren(
        items.filter((i) => i.overflow === true),
        isDisabled,
        onClick,
    );
    return { rootItems, farItems, overflowItems };
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const CanvasCommandBar = React.memo((props: CanvasCommandBarProps) => {
    const { items, width, height, disabled, onSelected, tabIndex, ariaLabel, setFocus, themeJSON, visible } = props;

    const onClick = React.useCallback(
        (ev?: React.MouseEvent<HTMLButtonElement>, item?: IContextualMenuItem | undefined) => {
            if (item?.canCheck) ev?.preventDefault();
            onSelected(item?.data);
            return true;
        },
        [onSelected],
    );

    const commandBarItems = React.useMemo(() => {
        const { rootItems, farItems, overflowItems } = getCommandBarItems(items, disabled === true, onClick);
        return { rootItems: rootItems, farItems: farItems, overflowItems: overflowItems };
    }, [items, disabled, onClick]);

    // Provide an explicit size so that the ResizeGroup measurements are correct
    const rootStyle = React.useMemo(() => {
        return {
            display: 'block',
            position: 'absolute',
            width: width,
            height: height,
        } as React.CSSProperties;
    }, [width, height]);

    const commandBarStyle = React.useMemo(() => {
        return {
            root: {
                height: height,
                paddingLeft: 0,
                background: 'rgba(255, 255, 255,0)',
                // This is very important for custom pages
                // since the min-width is set to the size of the component
                // we override to ensure that the items do not keep trying to shrink
                // because the width is clamped
                // See: https://github.com/microsoft/fluentui/issues/12540
                minWidth: 0,
            },
        } as ICommandBarStyles;
    }, [height]);

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    const rootRef = React.useRef<HTMLDivElement>(null);
    const async = useAsync();
    React.useEffect(() => {
        if (setFocus && setFocus !== '') {
            // We can't call focus() on the imperative componentRef because of a bug in ResizeGroup
            // that causes the componentRef.current to be nulled
            // See https://github.com/microsoft/fluentui/issues/22844
            async.requestAnimationFrame(() => {
                const buttons = (rootRef.current as HTMLElement).getElementsByTagName('button');
                if (buttons && buttons.length > 0) {
                    buttons[0].focus();
                }
            });
        }
    }, [setFocus, rootRef, async]);

    // When the visibility, width or items change,
    // remeasure the command bar and shrink/grow accordingly
    const commandBarRef = React.useRef<ICommandBar>(null);
    React.useEffect(() => {
        commandBarRef.current && commandBarRef.current?.remeasure();
    }, [width, items, visible]);

    // In custom pages, the initial size of the ResizeGroup is zero,
    // so we only render once we have the items bound
    const itemsBound = items.length > 0;

    return (
        <ThemeProvider applyTo="none" theme={theme} ref={rootRef} style={rootStyle}>
            {itemsBound && (
                <CommandBarCustom
                    componentRef={commandBarRef}
                    className={'PowerCATCommandBar'}
                    tabIndex={tabIndex}
                    styles={commandBarStyle}
                    items={commandBarItems.rootItems}
                    overflowItems={commandBarItems.overflowItems}
                    overflowButtonProps={overflowProps}
                    farItems={commandBarItems.farItems}
                    ariaLabel={ariaLabel ? ariaLabel : 'Command Bar'}
                />
            )}
        </ThemeProvider>
    );
});
CanvasCommandBar.displayName = 'CanvasCommandBar';
