import * as React from 'react';
import { CanvasContextMenuProps } from './Component.types';
import { useAsync } from '@fluentui/react-hooks';
import {
    createTheme,
    IPartialTheme,
    ThemeProvider,
    DefaultButton,
    IButton,
    IButtonProps,
    IContextualMenuItem,
    IStyle,
} from '@fluentui/react';
import { getCommandsWithChildren } from './DatasetMapping';

export const CanvasContextMenu = React.memo((props: CanvasContextMenuProps) => {
    const {
        items,
        onSelected,
        disabled,
        setFocus,
        themeJSON,
        width,
        height,
        showChevron,
        justify,
        tabIndex,
        borderColor,
        backgroundColor,
    } = props;

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    const componentRef = React.useRef<IButton>(null);
    const async = useAsync();
    React.useEffect(() => {
        if (setFocus && setFocus !== '' && componentRef) {
            async.requestAnimationFrame(() => {
                (componentRef as React.RefObject<IButton>).current?.focus();
            });
        }
    }, [setFocus, componentRef, async]);

    const onClick = React.useCallback(
        (ev?: unknown, item?: IContextualMenuItem | undefined) => {
            onSelected(item?.data);
            return true;
        },
        [onSelected],
    );

    const buttonProps = React.useMemo(() => {
        const props = {} as Partial<IButtonProps>;
        if (items && items.length > 0) {
            const firstItem = items[0];
            const style = {
                borderColor: borderColor,
                color: firstItem.textColor,
                backgroundColor: backgroundColor,
                width: width,
                height: height,
            } as IStyle;
            props.styles = {
                root: style,
                rootHovered: style,
                rootPressed: { color: firstItem.textColor },
                label: { textAlign: justify },
                icon: { color: firstItem.iconColor ?? firstItem.textColor },
            };
            props.iconProps = {
                iconName: firstItem.iconName,
            };
            props.disabled = disabled === true;
            props.text = firstItem.iconOnly ? '' : firstItem.name;
            props.onSelect = () => {
                // Since you can't raise the OnSelect event with no Selected Item
                // we use the first item to represent the root button click
                // so that it acts like a normal Button
                onSelected(firstItem);
            };
            const contextItems = getCommandsWithChildren(items.slice(1), disabled === true, onClick);
            if (contextItems && contextItems.length > 0) {
                props.menuProps = {
                    shouldFocusOnContainer: true,
                    items: contextItems,
                };
            }

            props.onRenderMenuIcon =
                showChevron === false
                    ? () => {
                          return null;
                      }
                    : undefined;

            return props;
        }
        return undefined;
    }, [disabled, height, items, justify, onClick, onSelected, showChevron, width, backgroundColor, borderColor]);

    return (
        <ThemeProvider applyTo="none" theme={theme} className={'PowerCATFluentContextMenu'}>
            <DefaultButton {...buttonProps} componentRef={componentRef} tabIndex={tabIndex} />
        </ThemeProvider>
    );
});
CanvasContextMenu.displayName = 'CanvasContextMenu';
