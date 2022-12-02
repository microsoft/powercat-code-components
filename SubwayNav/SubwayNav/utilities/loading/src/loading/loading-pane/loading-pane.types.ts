import type { IAnnouncedProps, ISpinnerProps, IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import type { IM365Theme } from '../../../../customizations/src/index';

export interface ILoadingPaneProps extends React.RefAttributes<HTMLDivElement> {
    /**
     * Boolean to engage the loading behavior
     */
    isLoading?: boolean;
    /**
     * Props for the default fluent loading spinner
     */
    spinnerProps?: Partial<ISpinnerProps>;
    /**
     * A custom spinner if you want something other than our presets.
     * Supercedes any value in loadingAnimationType
     */
    customLoadingAnimation?: React.ReactNode;
    /**
     * The type of animation displayed.
     * @default to FluentSpinner
     */
    loadingAnimationType?: LoadingAnimationType;
    /**
     * Alternative status label for screen reader
     */
    animationAriaLabel?: string;
    /*
     * String for the primary loading text
     */
    primaryLoadingText?: React.ReactNode;
    /*
     * String for the secondary loading text
     */
    secondaryLoadingText?: React.ReactNode;
    /**
     * Props to pass through to the underlying Announced
     */
    announcedProps?: Partial<IAnnouncedProps>;
    /**
     * Custom styling for individual elements within the DOM.
     */
    styles?: IStyleFunctionOrObject<ILoadingPaneStyleProps, ILoadingPaneStyles>;
    /**
     * Theme provided by High-Order Component.
     */
    theme?: IM365Theme;
}

export interface ILoadingPaneStyleProps {
    /**
     * 3 state loading to account for fade in behavior
     */
    loadingState: LoadingState;

    /**
     * Controls the height/width of the element sorounding the spinner.
     * If false, sets to 125x125, otherwise it's left unspecified
     */
    isFluentSpinner: boolean;

    /**
     * Theme provided by High-Order Component.
     */
    theme: IM365Theme;
}

export interface ILoadingPaneStyles {
    /**
     * Styles for the div that shows over the content
     */
    loadingDiv: IStyle;
    /**
     * Style for the primary loading text
     */
    primaryLoadingTextStyles: IStyle;
    /**
     * Style for the secondar loading text
     */
    secondaryLoadingTextStyles: IStyle;
    /**
     * Style for the hidden helper element to aid with screen readers.
     */
    dataVisAnimation?: IStyle;
}

export enum LoadingAnimationType {
    FluentSpinner = 'FluentSpinner', // default
    Donut = 'Donut',
    VerticalBar = 'VerticalBar',
    HorizontalBar = 'HorizontalBar',
    Line = 'Line',
    Shimmer = 'Shimmer',
}

export enum LoadingState {
    notLoading,
    loading,
    hidingLoading,
}
