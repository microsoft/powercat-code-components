// @ts-nocheck
import type {
    IAnnouncedProps,
    ICalloutContentStyleProps,
    ICalloutContentStyles,
    ICalloutProps,
    IProgressIndicatorStyleProps,
    IProgressIndicatorStyles,
    IRenderFunction,
    IStyle,
    IStyleFunctionOrObject,
    ITheme,
} from '@fluentui/react';
import type { ICollapsibleProps, ICollapsibleStyle, ICollapsibleStyleProps } from '../collapsible/src/collapsible';
import type { IM365Theme } from '../customizations/src';
import type { ILoadingPaneProps, ILoadingPaneStyleProps, ILoadingPaneStyles } from '../loading/src/index';
import type { FlexibleHeader } from '../MainUtilities/src/index';

import type { ISubwayNavProps, ISubwayNavStyleProps } from '../subway-nav/subway-nav.types';
import type { ISubwayNavNodeProps } from '../subway-node/subway-node.types';

export interface IWizardProps {
    /**
     * List of steps in the wizard
     */
    steps: IWizardStepProps[];

    /**
     * Bool indicating if the wizard should appear in a complete state.
     * Sets the vertical lines to green.
     * Be sure to also run your step array through the 'completeAllSteps' utility method
     * to ensure they're in the proper state as well.
     */
    wizardComplete?: boolean;

    /*
     * Step that is not part of navigation, only shown when wizard is complete
     */
    wizardCompleteStep?: IWizardStepProps;

    /**
     * A specific step to be shown, useful when navigating to the wizard from some other place.
     */
    stepToShow?: IWizardStepProps;

    /**
     * @deprecated
     * Dictates wether a progress indicator is being shown at the bottom of the panel. Replaced with isLoading
     */
    showProgressIndicator?: boolean;

    /**
     * Dictates wether a Loading Pane is being shown at the bottom of the panel (formerly showProgressIndicator)
     */
    isLoading?: boolean;

    /**
     * Optional render function to allow consumers to override the default loading behavior.
     */
    onRenderContent?: IRenderFunction<IWizardProps>;

    /**
     * Optional render function to allow consumers to override the default loading behavior.
     */
    onRenderLoading?: IRenderFunction<IWizardProps>;

    /**
     * Props passed to the subway nav
     * Note that the steps props are superseded by WizardProps steps.
     */
    subwayNavProps?: Partial<ISubwayNavProps>;

    /**
     * Props for the collapsible component used in narrow mode
     */
    collapsibleProps?: Partial<ICollapsibleProps>;

    /**
     * Props for the callout component used in narrow mode
     */
    calloutProps?: Partial<ICalloutProps>;

    /**
     * Props for the LoadingPane component
     */
    loadingPaneProps?: ILoadingPaneProps;

    /**
     * If set to true, ignores the default focus behavior.
     * @default false
     * Focus will redirect to the content area on step changes
     * and when the loading pane is shown.
     */
    optOutOfFocusBehavior?: boolean;

    /**
     * Callback that gets fired when the wizard switches between narrow states.
     */
    onIsNarrowChanged?: (newNarrowValue: boolean) => void;

    /**
     * Any custom styles provided by the consumers
     */
    styles?: IStyleFunctionOrObject<IWizardStyleProps, IWizardStyles>;

    /**
     * Theme provided by the styled higher order component
     */
    theme?: ITheme;

    /**
     * Optional ResizeObserver object reference. This can be used in situations where
     * ResizeObserver isn't supported and a ponyfill is needed.
     * Consumers can also polyfill if desired but this scopes usage and won't modify the global object
     */
    resizeObserverRef?: { new (...args: any): ResizeObserver };

    /**
     * Optional aria-label for the SubwayNav's nav element wrapper.
     * We recommend providing a short descriptive label to differentiate
     * this nav from other nav elements on the page.
     */
    navAriaLabel?: string;
}

export interface IWizardState {
    /**
     * Flag for narrow mode
     */
    isNarrow: boolean;
    /**
     * Flag indicating if the content is taller than root
     * */
    isContentScrollBarPresent: boolean;
    /**
     * Is the callout that houses the nav in narrow mode expanded
     * Obviously only relevant when in narrow mode
     */
    isCalloutExpanded: boolean;
    /**
     * Flag used to hide the scroll bar while the collapsible is opening
     */
    hideCalloutOverFlow: boolean;
}

/**
 * State object for things that parent a wizard. IE FullPageWizard, PanelWizard & SetupWizard.
 * The child wizard should dictate isNarrow so the visuals stay coordinated.
 */
export interface IWizardParentState {
    /**
     * Flag for Narrow mode
     */
    isNarrow: boolean;
}

export interface IWizardStepProps extends ISubwayNavNodeProps {
    /**
     * This property is used for animation
     */
    isFirstSubStep?: boolean;

    /**
     * This is usually the form for a user to fill out.
     * In the case of a step containing subSteps,
     * it should be empty. The content is the sub steps.
     */
    wizardContent?: IWizardContentProps;

    /**
     * An array of sub steps to completed.
     * There should only ever be 2 levels.
     * No subSteps should ever have sub steps
     */
    subSteps?: IWizardStepProps[];

    /**
     * Url for the back ground image that scrolls behind the content area
     */
    backgroundImageUrl?: string;

    /**
     * The buttons for the user to click through the wizard.
     * We highly recommend using either the WizardActionBar or the SetupWizardActionBarV2.
     */
    footerElement: JSX.Element;

    /**
     * Props for the announced component.
     * This is critical for users with screen readers
     * Be sure to set the message property to the same as the content title.
     */
    announcedProps?: IAnnouncedProps;
}

export interface IWizardStepIndex {
    /**
     * The zero based index of the major step
     */
    stepIndex: number;

    /**
     * If provided, the zero based index of the minor step
     * Note that because this is a number and can be zero, if(subStepIndex) is not a valid presence test,
     * You must use if(subStepIndex == undefined)
     */
    subStepIndex?: number;
}

export interface IWizardContentProps {
    /**
     * The header element level
     * @default: 'h2'
     */
    contentTitleElementAs?: FlexibleHeader;

    /**
     * The title element
     */
    contentTitleElement?: JSX.Element;

    /**
     * The content to fill out.
     */
    content: JSX.Element;
}

/**
 * Returned by a few of the wizard utils
 */
export interface IStepChange<T extends ISubwayNavNodeProps> {
    /**
     * The modified array of steps
     */
    steps: T[];
    /**
     * The step that is now the new current
     */
    newCurrentStep: T | undefined;
}

/**
 * Returned by a few of the wizard utils functions
 */
export interface IDestinationStep<T extends ISubwayNavNodeProps> {
    /**
     * The destination step of where you want to go
     */
    destinationStep: T;

    /**
     * If the destination is a sub step,
     * include the parent ID
     */
    parentId?: string;
}

export interface IWizardTitleProps {
    title: string;
}

export interface IWizardStyleProps {
    /**
     * Flag indicating wether or not the component is in a narrow mode or not
     */
    isNarrow: boolean;
    /**
     * Flag indicating wether or not the content area is taller than the root
     */
    isContentScrollBarPresent: boolean;
    /**
     * Flag indicating if the current step is a sub step
     */
    isSubStep: boolean;
    /**
     * Flag indicating if the current step is a sub step.
     */
    isFirstSubStep: boolean;
    /**
     * Controls the directionality entrance and exit animations of the background image
     * true for bottom up
     * false for top down
     */
    clickedForward: boolean;
    /**
     * Url for the background image
     */
    backgroundImageUrl: string;

    /**
     * Flag for the step background index
     */
    stepBackgroundIndex: number;
    /**
     * Flag controlling wether or not the last step is a sub step
     */
    isLastStepSubStep: boolean;
    /**
     * Flag indicating if the wizard is in a loading state or not.
     */
    isLoading: boolean;
    /**
     * Flag for wether or not the wizard is complete
     * @deprecated this behavior is now handled by the subway nav components individually
     */
    wizardComplete?: boolean;
    /**
     * Theme passed by higher order component for colors and fonts
     */
    theme: ITheme;
}

export interface IWizardTitleStyleProps {
    /**
     * Theme provided by higher order component
     */
    theme: IM365Theme;

    /**
     * Calling component name, used for potential error messages
     */
    componentName: string;

    /**
     * Indicates if the heading is in narrow mode
     */
    isNarrow: boolean;
}

// Styles for the wizard component
export interface IWizardStyles {
    /**
     * Styles for the root container
     * Keeping legacy name to minimize breaking changes
     */
    wizardContentNavContainer: IStyle;

    /**
     * Progress indicator for the wizard
     * @deprecated deprecated and no longer has any effect.
     *
     */
    wizardProgress: IStyle;

    /**
     * Styles for the subway nav container
     */
    subwayNavSection: IStyle;

    /**
     * Styles for the content section container
     */
    contentSection: IStyle;
    /**
     * Styles for the content title
     */
    contentTitle: IStyle;
    /**
     * Styles for the Interactive content container
     */
    content: IStyle;
    /**
     * Styles for the collapsible where the subway nav lives in narrow mode
     */
    collapsibleContainer: IStyle;
    /**
     * Styles for the components sub component styles
     */
    subComponentStyles: IWizardSubComponentStyles;
}

export interface IWizardSubComponentStyles {
    /**
     * Styles for the subway nav when in narrow mode
     */
    // you can't strongly type this to a component which also has subComponentStyles
    // tslint:disable-next-line:no-any
    narrowSubwayNav: IStyleFunctionOrObject<ISubwayNavStyleProps, any>;
    /**
     * Styles for the collapsible that acts as a drop down for subway nav
     */
    collapsible: IStyleFunctionOrObject<ICollapsibleStyleProps, ICollapsibleStyle>;
    /**
     * Styles for the callout that's displayed in narrow mode
     */
    calloutContent: IStyleFunctionOrObject<ICalloutContentStyleProps, ICalloutContentStyles>;
    /**
     * Styles for the progress indicator
     */
    progressIndicator: IStyleFunctionOrObject<IProgressIndicatorStyleProps, IProgressIndicatorStyles>;
    /**
     * Styles for the loading pane
     */
    loadingPane: IStyleFunctionOrObject<ILoadingPaneStyleProps, ILoadingPaneStyles>;
}
