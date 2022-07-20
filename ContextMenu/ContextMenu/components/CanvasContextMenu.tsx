import * as React from 'react';
import { CanvasContextMenuItem, CanvasContextMenuProps } from './Component.types';
import { useAsync } from '@fluentui/react-hooks';
import {
    createTheme,
    IPartialTheme,
    ThemeProvider,
    DefaultButton,
    IButton,
    IButtonProps,
    IContextualMenuItem,
    IButtonStyles,
} from '@fluentui/react';
import { getCommandsWithChildren } from './DatasetMapping';

export const CanvasContextMenu = React.memo((props: CanvasContextMenuProps) => {
    const { items, onSelected, disabled, setFocus, themeJSON, showChevron, tabIndex } = props;

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
        (ev?: React.MouseEvent<HTMLButtonElement>, item?: IContextualMenuItem | undefined) => {
            // If this is a check item, then prevent closing the menu
            if (item?.canCheck) ev?.preventDefault();
            onSelected(item?.data);
            return true;
        },
        [onSelected],
    );

    const buttonProps = React.useMemo(() => {
        const props = {} as Partial<IButtonProps>;
        if (items && items.length > 0) {
            const firstItem = items[0];
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
    }, [disabled, items, onClick, onSelected, showChevron]);

    return (
        <ThemeProvider applyTo="none" theme={theme} className={'PowerCATFluentContextMenu'}>
            <DefaultButton
                {...buttonProps}
                styles={getButtonStyles(props, items)}
                componentRef={componentRef}
                tabIndex={tabIndex}
            />
        </ThemeProvider>
    );
});
CanvasContextMenu.displayName = 'CanvasContextMenu';

function getButtonStyles(props: CanvasContextMenuProps, items: CanvasContextMenuItem[]) {
    return React.useMemo(() => {
        const rootItem = items && items.length > 0 ? items[0] : undefined;
        const iconColor = props.iconColor ?? rootItem?.iconColor ?? props.fontColor;
        const textColor = props.fontColor;
        const hoverTextColor = props.hoverFontColor ?? textColor;
        const fillColor = props.fillColor;
        const hoverFillColor = props.hoverFillColor ?? fillColor;
        const hoverIconColor = props.hoverIconColor ?? props.hoverFontColor ?? props.iconColor ?? props.fontColor;
        return {
            root: {
                width: props.width,
                height: props.height,
                backgroundColor: fillColor,
                borderColor: props.borderColor,
                color: textColor,
                borderRadius: props.borderRadius,
                borderWidth: props.fillColor ? 1 : undefined,
                borderStyle: props.fillColor ? 'solid' : undefined,
                fontSize: props.fontSize,
            },
            rootHovered: {
                backgroundColor: hoverFillColor,
                borderColor: props.hoverBorderColor,
                color: hoverTextColor,
            },
            rootPressed: {
                backgroundColor: hoverFillColor,
                color: hoverTextColor,
            },
            rootExpanded: {
                backgroundColor: fillColor,
                color: textColor,
            },
            rootExpandedHovered: {
                backgroundColor: hoverFillColor,
                borderColor: props.hoverBorderColor,
                color: hoverTextColor,
            },
            icon: {
                color: iconColor,
                fontSize: props.iconSize ?? props.fontSize,
            },
            iconHovered: {
                color: hoverIconColor,
            },
            iconExpandedHovered: {
                color: hoverIconColor,
            },
            label: {
                textAlign: props.justify,
            },
        } as IButtonStyles;
    }, [
        items,
        props.borderColor,
        props.borderRadius,
        props.fillColor,
        props.fontColor,
        props.fontSize,
        props.height,
        props.hoverBorderColor,
        props.hoverFillColor,
        props.hoverFontColor,
        props.hoverIconColor,
        props.iconColor,
        props.iconSize,
        props.justify,
        props.width,
    ]);
}
