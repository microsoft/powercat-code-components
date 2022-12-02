import type { IIconProps, IRenderFunction, IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import type { IFlexibleHeader } from '../../../MainUtilities/src/type-helpers';
import type { ButtonHTMLAttributes } from 'react';

export interface ICollapsibleProps extends ButtonHTMLAttributes<HTMLButtonElement>, IFlexibleHeader {
    /**
     * String that renders as the Header text
     */
    title?: string;

    /**
     * Optional custom render function to run in place of default title render function
     * @default _onRenderTitle
     */
    onRenderTitle?: IRenderFunction<ICollapsibleProps>;

    /**
     * If set to true, Collapsible will initially render pre-expanded
     */
    isExpanded?: boolean;

    /**
     * If set to true, a red asterisk will render next to the Header text
     */
    isRequired?: boolean;

    /**
     * If set to true, Collapsible will initially render pre-expanded
     */
    defaultIsExpanded?: boolean;

    /**
     * Custom function to run upon toggling the Collapsible expanded state
     */
    onToggle?: (isExpanded: boolean) => void;

    /**
     * Aria label of the component for screen readers
     */
    ariaLabel?: string;

    /**
     * Props passed into the chevron icon
     */
    iconProps?: IIconProps;

    /**
     * Custom styling for individual elements within the DOM.
     */
    styles?: IStyleFunctionOrObject<ICollapsibleStyleProps, ICollapsibleStyle>;

    /**
     * Theme provided by High-Order Component.
     */
    theme?: ITheme;
}

export interface ICollapsibleStyle {
    /**
     * Parent root div
     */
    root: IStyle;

    /**
     * Styles for the title container
     */
    titleContainer: IStyle;

    /**
     * This is primarily used for animations. For button styling please use buttonProps prop
     */
    icon: IStyle;

    /**
     * Content Styling
     */
    content: IStyle;

    /**
     * Header button styling
     */
    headerButton: IStyle;

    /**
     * Header container styling
     */
    headerContainer: IStyle;

    /**
     * Header spacer styling
     */
    headerSpacer: IStyle;

    /**
     * Styling for the required asterisk
     */
    requiredMarker: IStyle;
}

export interface ICollapsibleStyleProps {
    /**
     * boolean to set expanded state of Collapsible
     */
    isExpanded: boolean;

    /**
     * boolean to indicate if Collapsible is required
     */
    isRequired: boolean;

    /**
     * boolean to indicate if the Collapsible is disabled
     */
    disabled: boolean;

    /**
     * Theme provided by High-Order Component.
     */
    theme: Partial<ITheme>;
}
