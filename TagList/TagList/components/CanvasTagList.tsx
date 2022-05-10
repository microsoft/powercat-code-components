import {
    ITagItemStyleProps,
    ITagItemStyles,
    ThemeProvider,
    IStyleFunctionOrObject,
    createTheme,
    IPartialTheme,
} from '@fluentui/react';
import * as React from 'react';
import { Tag } from './Tag';
import { TagListItem, CanvasTagListProps } from './Component.types';
import useResizeObserver from '@react-hook/resize-observer';

export const CanvasTagList = React.memo((props: CanvasTagListProps) => {
    const {
        items,
        width,
        height,
        maxHeight,
        itemMaxWidth,
        disabled,
        tabIndex,
        themeJSON,
        justify,
        onResize,
        itemHeight,
        fontSize,
        borderRadius,
    } = props;

    const containerStyle: React.CSSProperties = React.useMemo(() => {
        return {
            maxWidth: width ? width : '100%',
            position: 'relative',
            display: 'flex',
            maxHeight: maxHeight || height,
            overflowY: 'auto',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
        };
    }, [height, maxHeight, width]);

    const tagStyles: IStyleFunctionOrObject<ITagItemStyleProps, ITagItemStyles> = React.useMemo(() => {
        return {
            root: {
                maxWidth: itemMaxWidth || '100%',
                minWidth: undefined,
                justifyContent: justify ?? 'left',
                borderRadius: borderRadius ?? undefined,
                lineHeight: itemHeight ?? undefined,
                height: itemHeight ?? undefined,
                fontSize: fontSize ?? undefined,
            },
            text: {
                minWidth: undefined,
            },
        };
    }, [itemMaxWidth, justify, borderRadius, itemHeight, fontSize]);

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    const target = React.useRef<HTMLElement>(null);
    useResizeObserver(target, (entry) => {
        if (onResize) onResize(entry.contentRect.width, entry.contentRect.height);
    });

    return (
        <>
            <ThemeProvider theme={theme} applyTo="none" style={containerStyle} ref={target}>
                {items &&
                    items.map((item: TagListItem, index: number) => (
                        <Tag
                            key={item.id}
                            tabIndex={disabled ? -1 : tabIndex}
                            styles={tagStyles}
                            index={index}
                            item={item}
                            textColor={item.textColor}
                            borderColor={item.borderColor}
                            backgroundColor={item.backgroundColor}
                            iconName={item.iconName}
                            iconColor={item.iconColor}
                            disabled={disabled === true || item.enabled === false}
                            aria-setsize={items.length}
                            maxLength={300}
                        >
                            {item.name}
                        </Tag>
                    ))}
            </ThemeProvider>
        </>
    );
});
CanvasTagList.displayName = 'CanvasTagList';
