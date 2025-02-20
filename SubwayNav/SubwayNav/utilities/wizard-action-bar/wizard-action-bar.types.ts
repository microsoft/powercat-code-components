// @ts-nocheck
import type {
    IButtonProps,
    IButtonStyles,
    IRenderFunction,
    IStyle,
    IStyleFunctionOrObject,
    IStyleSet,
    ITheme,
} from '@fluentui/react';

import type { IWizardStepProps } from '../wizard/wizard.types';

export interface IWizardActionBarProps {
    /**
     * Action to execute when back is clicked
     */
    backAction?: IWizardStepButtonProps;
    /**
     * Action to execute when main action is clicked
     */
    mainAction?: IWizardStepButtonProps;
    /**
     * Action to execute when Save and Close is clicked
     */
    savecloseAction?: IWizardStepButtonProps;
    /**
     * Action to execute when cancel is clicked
     */
    cancelAction?: IWizardStepButtonProps;
    /**
     * The step the wizard is currently on
     */
    currentStep: IWizardStepProps;
    /**
     * Render area for the left side, previous and next buttons
     */
    onRenderLeftButtons?: IRenderFunction<IWizardActionBarProps> | React.ReactNode;
    /**
     * Render area for the right side, cancel
     */
    onRenderRightButtons?: IRenderFunction<IWizardActionBarProps> | React.ReactNode;
    /**
     * Determines whether the action bar is loading
     * @default false
     */
    isLoading?: boolean;
    /**
     * Any custom styles provided by the consumers
     */
    styles?: IStyleFunctionOrObject<IWizardActionBarStyleProps, IWizardActionBarStyles>;
    /**
     * Theme provided by higher order compnent
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

export interface IWizardActionBarStyleProps {
    /**
     * Theme provided by higher order component
     */
    theme: ITheme;
    /**
     * Flg indicating if the WAB should be in narrow mode or not
     */
    isNarrow: boolean;
}

export interface IWizardActionBarStyles {
    /**
     * Styles for the component's container
     */
    root: IStyle;
    /**
     * Flex wrapper for the buttons on the left hand side
     */
    leftButtonsWrapper: IStyle;
    /**
     * Flex wrapper for the buttons on the right hand side
     */
    rightButtonsWrapper: IStyle;
    /**
     * Space column to keep the buttons aligned with the content
     */
    spacer: IStyle;
    /**
     * Wrapper for button area
     */
    buttonSection: IStyle;
    /**
     * Styles for the subcomponents
     */
    subComponentStyles: Partial<IWizardActionBarSubComponentStyles>;
}

export interface IWizardActionBarSubComponentStyles {
    /**
     * Styles for the back button
     */
    back: IStyleSet<IButtonStyles>;
    /**
     * Styles for the main button
     */
    main: IStyleSet<IButtonStyles>;
    /**
     * Styles for the save and close button
     */
    saveclose: IStyleSet<IButtonStyles>;
    /**
     * Styles for the cancel button
     */
    cancel: IStyleSet<IButtonStyles>;
}

export interface IWizardStepButtonProps extends Pick<IButtonProps, Exclude<keyof IButtonProps, 'onClick' | 'title'>> {
    /**
     * Defines the function that is executed on clicking this action
     */
    onClick: (
        currentStep: IWizardStepProps,
        event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLElement>,
    ) => void;

    /**
     * @deprecated Title is the wrong attribute to use to assign button text.
     * It's NOT accessible.
     * Please use the 'text' instead.
     */
    title?: string;
}
