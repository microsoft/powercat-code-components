import * as React from 'react';
import {
    ActionButton,
    createTheme,
    FontIcon,
    IButton,
    IButtonStyles,
    IconButton,
    IIconProps,
    IPartialTheme,
    mergeStyles,
    ThemeProvider,
    TooltipHost,
} from '@fluentui/react';
import { useAsync } from '@fluentui/react-hooks';

export interface IconComponentProps {
    width?: number;
    height?: number;
    iconName?: string;
    text?: string;
    tooltipContent?: string;
    onSelected: () => void;
    disabled?: boolean;
    tabIndex?: number;
    ariaLabel?: string;
    themeJSON?: string;
    setFocus?: string;
    justify?: string;
    renderType?: IconRenderType;
    iconSize?: number;
    iconColor?: string;
    hoverIconColor?: string;
    fontSize?: number;
    fontColor?: string;
    hoverFontColor?: string;
    borderColor?: string;
    hoverBorderColor?: string;
    borderRadius?: number;
    fillColor?: string;
    hoverFillColor?: string;
}

export enum IconRenderType {
    IconButon = 0,
    ActionButton = 1,
    Icon = 2,
}

export const IconComponent = React.memo((props: IconComponentProps) => {
    const { text, tooltipContent, disabled, onSelected, tabIndex, ariaLabel, setFocus, themeJSON, renderType } = props;
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

    const RenderButtonAs = getRenderTag(renderType);

    return (
        <ThemeProvider applyTo="none" theme={theme} className={getIconContainerStyle(props)}>
            <TooltipHost content={tooltipContent}>
                {renderType === IconRenderType.Icon && (
                    <FontIcon aria-label={props.ariaLabel} className={getIconClass(props)} iconName={props.iconName} />
                )}
                {renderType !== IconRenderType.Icon && (
                    <RenderButtonAs
                        componentRef={componentRef}
                        styles={getButtonStyles(props)}
                        iconProps={getIconProps(props)}
                        ariaLabel={ariaLabel}
                        disabled={disabled}
                        text={text}
                        onClick={onSelected}
                        tabIndex={tabIndex}
                    />
                )}
            </TooltipHost>
        </ThemeProvider>
    );
});

IconComponent.displayName = 'IconComponent';

function getRenderTag(type?: IconRenderType) {
    if (type === IconRenderType.IconButon) return IconButton;
    else return ActionButton;
}

function getIconProps(props: Partial<IconComponentProps>) {
    return {
        iconName: props.iconName,
        styles: {
            root: {
                color: props.iconColor ?? props.fontColor,
                fontSize: props.iconSize ?? props.fontSize,
            },
        },
    } as IIconProps;
}
function getIconContainerStyle(props: Partial<IconComponentProps>) {
    // Vertical center font icon
    return mergeStyles({
        height: props.height,
        display: 'flex',
        alignItems: 'center',
    });
}

function getIconClass(props: IconComponentProps) {
    return mergeStyles({
        fontSize: props.iconSize ?? props.fontSize,
        width: props.width,
        margin: 0,
        color: props.iconColor ?? props.fontColor,
        textAlign: props.justify,
    });
}

function getButtonStyles(props: IconComponentProps) {
    const styles = {
        root: {
            width: props.width,
            height: props.height,
            backgroundColor: props.fillColor ?? 'transparent',
            borderColor: props.borderColor,
            color: props.fontColor,
            borderRadius: props.borderRadius,
            borderWidth: props.fillColor ? 1 : undefined,
            borderStyle: props.fillColor ? 'solid' : undefined,
            fontSize: props.fontSize,
        },
        rootHovered: {
            backgroundColor: props.hoverFillColor,
            borderColor: props.hoverBorderColor,
            color: props.hoverFontColor ?? props.fontColor,
        },
        icon: { color: props.iconColor ?? props.fontColor, fontSize: props.iconSize ?? props.fontSize },
        iconHovered: { color: props.hoverIconColor ?? props.hoverFontColor ?? props.fontColor },
        flexContainer: { justifyContent: props.justify },
    } as IButtonStyles;

    if (props.renderType === IconRenderType.Icon) {
        // Hide text part so the icon can be centered using the flexbox
        styles.textContainer = { display: 'none' };
    }
    return styles;
}
