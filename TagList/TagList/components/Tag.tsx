import { useId } from '@fluentui/react-hooks';
import {
    FontIcon,
    classNamesFunction,
    styled,
    ITagItemProps,
    ITagItemStyleProps,
    ITagItemStyles,
} from '@fluentui/react';
import { getStyles } from './TagItem.styles';
import * as React from 'react';

const getClassNames = classNamesFunction<ITagItemStyleProps, ITagItemStyles>();
export interface TagProps extends ITagItemProps {
    fontSize?: number;
    height?: number;
    iconName?: string;
    iconColor?: string;
    textColor?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: number;
}

// This is simlar to the TagItem in Fluent
export const TagComponent = (props: TagProps): JSX.Element => {
    const {
        theme,
        styles,
        iconColor,
        textColor,
        backgroundColor,
        borderColor,
        iconName,
        children,
        index,
        title = typeof props.children === 'string' ? props.children : props.item.name,
    } = props;

    const tagStyle = React.useMemo(() => {
        return {
            color: textColor,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: borderColor ? 1 : undefined,
            borderStyle: borderColor ? 'solid' : undefined,
        } as React.CSSProperties;
    }, [textColor, backgroundColor, borderColor]);

    const iconStyle = React.useMemo(() => {
        return {
            color: iconColor,
        } as React.CSSProperties;
    }, [iconColor]);

    const itemId = useId();
    const classNames = getClassNames(styles, {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        theme: theme!,
        disabled: true,
        selected: false,
    });

    return (
        <div className={classNames.root} style={tagStyle} role={'listitem'} aria-label={title} key={index}>
            {iconName && <FontIcon role="img" iconName={iconName} style={iconStyle} />}
            <span className={classNames.text} title={title} id={`${itemId}-text`}>
                {children}
            </span>
        </div>
    );
};

export const Tag = React.memo(
    styled<TagProps, ITagItemStyleProps, ITagItemStyles>(TagComponent, getStyles, undefined, {
        scope: 'TagItem',
    }),
);
