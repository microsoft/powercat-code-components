import type {
    IButtonProps,
    IButtonStyles,
    IContextualMenuItem,
    ILinkProps,
    ILinkStyleProps,
    ILinkStyles,
    IStyle,
    IStyleFunctionOrObject,
    IStyleSet,
    ITheme,
} from '@fluentui/react';

import type { IWizardStepProps } from '../wizard/wizard.types';

export interface ISetupWizardActionBarV2Props {
    /**
     * Action to execute when back is clicked
     */
    backLinkProps?: IWizardStepLinkProps;
    /**
     * Action to execute when main action is clicked
     */
    mainLinkProps: IWizardStepLinkProps;
    /**
     * Action to execute when exit is clicked
     */
    exitLinkProps?: IWizardStepLinkProps;
    /**
     * The step the wizard is currently on
     */
    currentStep: IWizardStepProps;
    /**
     * Additional props for the icon button shown in narrow mode.
     */
    iconButtonProps?: Partial<IButtonProps>;
    /**
     * Determines whether the action bar is loading
     * @default false
     */
    isLoading?: boolean;
    /**
     * Any custom styles provided by the consumers
     */
    styles?: IStyleFunctionOrObject<ISetupWizardActionBarV2StyleProps, ISetupWizardActionBarV2Styles>;
    /**
     * Theme provided by higher order component
     */
    theme?: ITheme;
    /**
     * Optional ResizeObserver object reference. This can be used in situations where
     * ResizeObserver isn't supported and a ponyfill is needed.
     * Consumers can also polyfill if desired but this scopes usage and won't modify the global object
     */
    // tslint:disable-next-line:no-any
    resizeObserverRef?: { new (...args: any): ResizeObserver };
}

export interface ISetupWizardActionBarV2Styles {
    /**
     * Styles for the component's container
     */
    root: IStyle;
    /**
     * Style for the left most element
     */
    spacer: IStyle;
    /**
     * Style for the wrapper around the second two buttons
     */
    buttonArea: IStyle;
    /**
     * Styles for the subcomponents
     */
    subComponentStyles: Partial<ISetupWizardActionBarV2SubComponentStyles>;
}
// TODO 1035 Replace Pick<Exclude< with Omit in SetupWizardActionBarV2 after TS 3.5 upgrade
export interface IWizardStepLinkProps extends Pick<ILinkProps, Exclude<keyof ILinkProps, 'onClick'>> {
    /**
     * Defines the function that is executed on clicking this action
     */
    onClick: (
        currentStep: IWizardStepProps,
        event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLElement>,
    ) => void;

    /*
     * Props for when the item is put in a context menu in narrow mode
     */
    contextualMenuItemProps?: Partial<IContextualMenuItem>;
}

export interface ISetupWizardActionBarV2SubComponentStyles {
    /**
     * Styles for the back link
     */
    back: IStyleFunctionOrObject<ILinkStyleProps, ILinkStyles>;
    /**
     * Styles for the main action link
     */
    main: IStyleFunctionOrObject<ILinkStyleProps, ILinkStyles>;
    /**
     * Styles for the exit link
     */
    exit: IStyleFunctionOrObject<ILinkStyleProps, ILinkStyles>;
    /**
     * Styles for the icon button shown in narrow mode
     */
    iconButton: IStyleSet<IButtonStyles>;
}

export interface ISetupWizardActionBarV2StyleProps {
    /**
     * Flag indicating if the SWAB is in narrow mode or not
     */
    isNarrow: boolean;
    /**
     * Theme provided by higher order component
     */
    theme: ITheme;
}
