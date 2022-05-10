import { PivotItem, IPivot, IFocusZoneProps, createTheme, IPartialTheme, ThemeProvider } from '@fluentui/react';
import * as React from 'react';
import { Pivot as CustomPivot } from '../fluentui-fork/Pivot/Pivot';
import { PivotLink, PivotProps } from './Component.types';
import { useAsync } from '@fluentui/react-hooks';

export const CanvasPivot = React.memo((props: PivotProps) => {
    const { items, onSelected, tabIndex, ariaLabel, selectedKey, setFocus, linkSize, linkFormat, themeJSON } = props;

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

    return (
        <ThemeProvider applyTo="none" theme={theme}>
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
            >
                {pivotItems}
            </CustomPivot>
        </ThemeProvider>
    );
});
CanvasPivot.displayName = 'CanvasPivot';
