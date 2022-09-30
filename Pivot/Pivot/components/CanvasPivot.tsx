import {
    PivotItem,
    IPivot,
    IFocusZoneProps,
    createTheme,
    IPartialTheme,
    ThemeProvider,
    IPivotStyles,
} from '@fluentui/react';
import * as React from 'react';
import { Pivot as CustomPivot } from '../fluentui-fork/Pivot/Pivot';
import { PivotLink, PivotProps } from './Component.types';
import { useAsync } from '@fluentui/react-hooks';

export const CanvasPivot = React.memo((props: PivotProps) => {
    const {
        items,
        onSelected,
        tabIndex,
        ariaLabel,
        selectedKey,
        setFocus,
        linkSize,
        linkFormat,
        themeJSON,
        width,
        height,
    } = props;

    const onLinkClick = React.useCallback(
        (item?: PivotItem) => {
            if (item) {
                const selectedItem = items.find((i) => i.key === item.props.itemKey);
                if (selectedItem) {
                    onSelected(selectedItem);
                }
            }
            return true;
        },
        [onSelected, items],
    );

    const pivotItems = React.useMemo(() => {
        return items
            .filter((i) => i.visible !== false)
            .map((i: PivotLink, index: number) => {
                return (
                    <PivotItem
                        key={i.key + index.toString()}
                        itemKey={i.key}
                        itemIcon={i.iconName}
                        headerText={i.name}
                        itemCount={i.itemCount}
                    />
                );
            });
    }, [items]);

    const focusZoneProps = React.useMemo(() => {
        return {
            tabIndex: tabIndex,
            shouldFocusInnerElementWhenReceivedFocus: true,
        } as IFocusZoneProps;
    }, [tabIndex]);

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    const componentRef = React.useRef<IPivot>(null);
    const async = useAsync();
    React.useEffect(() => {
        if (setFocus && setFocus !== '' && componentRef) {
            async.requestAnimationFrame(() => {
                (componentRef as React.RefObject<IPivot>).current?.focus();
            });
        }
    }, [setFocus, componentRef, async]);

    const pivotStyles = React.useMemo(() => {
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
        } as IPivotStyles;
    }, [height]);

    const rootStyle = React.useMemo(() => {
        return {
            display: 'block',
            position: 'absolute',
            width: width,
            height: height,
        } as React.CSSProperties;
    }, [width, height]);

    return (
        <ThemeProvider applyTo="none" theme={theme} style={rootStyle}>
            <CustomPivot
                className="PowerCATFluentPivot"
                componentRef={componentRef}
                aria-label={ariaLabel}
                onLinkClick={onLinkClick}
                selectedKey={selectedKey}
                focusZoneProps={focusZoneProps}
                linkFormat={linkFormat === 'links' ? 'links' : 'tabs'}
                linkSize={linkSize === 'large' ? 'large' : 'normal'}
                overflowBehavior={'menu'}
                styles={pivotStyles}
            >
                {pivotItems}
            </CustomPivot>
        </ThemeProvider>
    );
});
CanvasPivot.displayName = 'CanvasPivot';
