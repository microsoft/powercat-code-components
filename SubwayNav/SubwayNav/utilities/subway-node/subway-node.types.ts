import type {
    IIconRecord,
    IProcessedStyleSet,
    IStyle,
    IStyleFunctionOrObject,
    ITooltipHostProps,
} from '@fluentui/react';
import type { IM365Theme } from '../customizations/src';
import type * as React from 'react';

export interface ISubwayNavNodeProps extends React.AllHTMLAttributes<HTMLButtonElement> {
    /**
     * Unique ID for the given step
     */
    id: string;

    /**
     * Optional ID for the parent of the step.
     * to aid in data operations
     */
    parentId?: string;

    /**
     * Visual index used for animations
     */
    index?: number;

    /**
     * Label for the step.
     */
    label: string;

    /**
     * State of the step
     */
    state: SubwayNavNodeState;

    /**
     *  If state is equal to "Custom", this prop will be used to determine the Icon type (Fluent UI)
     */
    itemIcon: string;

    /**
     *  If state is equal to "Custom", this prop will be used to determine the Icon's color
     */
    itemColor: string;

    /**
     * AriaLabel of the icon
     */
    iconAriaLabel?: string;

    /**
     *  Flag to indicate if step is disabled
     * @defaults to false.
     * */
    disabled?: boolean;

    /**
     * By default, when nodes are disabled they remain solid colored.
     * This is for the case of the Wizard, when future steps are disabled to prevent
     * the user from clicking ahead.
     *
     * When set to true, the component will gray out when it's disabled.
     * When set to false, it will remain solid, but be unclickable when disabled.
     *
     * @default false
     */
    isVisuallyDisabled?: boolean;

    /**
     * What type of element to render the main element as. Defaults to button.
     */
    rootAs?: React.ElementType;

    /**
     * Handler to be executed on click of a step
     */
    onClickStep?: (props: ISubwayNavNodeProps) => void;

    /**
     * Sub steps in the step
     */
    subSteps?: ISubwayNavNodeProps[];

    /**
     * Prop to that determines the type of step to render
     */
    isSubStep?: boolean;

    /**
     * Optional custom icon record that can be passed into the control
     */
    iconRecord?: IIconRecord;

    /**
     * Optional render function for sub step focus zone and sub steps
     */
    onRenderSubSteps?: (props: ISubwayNavNodeProps, parentIndex: number) => JSX.Element | null;

    /**
     * Optional render function for the step's icon
     */
    onRenderStepIcon?: (
        props: ISubwayNavNodeProps,
        classNames: IProcessedStyleSet<ISubwayNavNodeStyles>,
        iconRecord?: IIconRecord,
    ) => JSX.Element;

    /**
     * Optional render function for the step. Note this doesn't include the wrapping li element. This is by design
     */
    onRenderStep?: (
        props: ISubwayNavNodeProps,
        classNames: IProcessedStyleSet<ISubwayNavNodeStyles>,
        iconRecord?: IIconRecord,
        defaultOnRenderStepIcon?: ISubwayNavNodeProps['onRenderStepIcon'],
    ) => JSX.Element;

    /*
     * Optional TooltipHost props
     * @deprecated - Tooltip is no longer supported and is a no-op. The text now wraps.
     */
    tooltipHostProps?: ITooltipHostProps;

    /**
     * Theme provided by higher order component
     */
    theme?: IM365Theme;

    /**
     * Any custom styles provided by the consumers
     */
    styles?: IStyleFunctionOrObject<ISubwayNavNodeStyleProps, ISubwayNavNodeStyles>;

    /**
     * (Optional) Any additional properties to apply to the rendered node.
     */
    [propertyName: string]: any;
}

/**
 * Possible states of a given step
 */
export enum SubwayNavNodeState {
    NotStarted = 'NotStarted',
    Current = 'Current',
    CurrentWithSubSteps = 'CurrentWithSubSteps',
    Completed = 'Completed',
    ViewedNotCompleted = 'ViewedNotCompleted',
    Unsaved = 'Unsaved',
    Skipped = 'Skipped',
    Error = 'Error',
    WizardComplete = 'WizardComplete',
    Custom = 'Custom',
}

/**
 * Styles for the Subway Nav component
 */
export interface ISubwayNavNodeStyles {
    /**
     * Overall root of the node
     */
    root: IStyle;

    /**
     * The container within which the icon for a node is rendered
     */
    iconContainer: IStyle;

    /**
     * The icon to render for a node
     */
    icon: IStyle;

    /**
     * The ring that is rendered over the icon
     */
    iconRing: IStyle;

    /**
     * The ring that is rendered over the icon
     */
    iconBackPlate: IStyle;

    /**
     * Flex spacer that is used to help support RTL instead of margins
     */
    spacer: IStyle;

    /**
     * The label of the node in the normal state
     */
    label: IStyle;

    /**
     * The label of the node in the selected state
     */
    labelSelected: IStyle;

    /**
     * Wrapper for the labels to enable animations and positioning
     */
    labelWrapper: IStyle;
}

/**
 * Props for style customizations
 */
export interface ISubwayNavNodeStyleProps {
    /**
     * Flag to indicate if the step is a sub step of another
     */
    isSubStep: boolean;

    /**
     * Flag to indicate if step is disabled
     */
    disabled: boolean;

    /**
     * Flag to indicate if the step should be visually disabled as well.
     */
    isVisuallyDisabled: boolean;

    /**
     *  State of the step
     */
    state: SubwayNavNodeState;

    /**
     *  If state is equal to "Custom", this prop will be used to determine the Icon type (Fluent UI)
     */
    itemIcon: string;

    /**
     *  If state is equal to "Custom", this prop will be used to determine the Icon's color
     */
    itemColor: string;

    /**
     * Icon record prop used in style merging
     */
    iconRecord: IIconRecord;

    /**
     * Prop to help determine what style of step to render
     */
    hasSubSteps: boolean;

    /**
     * A visual index used to determine animation timings
     */
    index: number;

    /**
     * Theme provided by higher order component
     */
    theme: IM365Theme;
}

export const IconNames = {
    FullCircleMask: 'FullCircleMask',
    CompletedSolid: 'CompletedSolid',
    StatusErrorFull: 'StatusErrorFull',
    StatusError: 'StatusCircleErrorX', // for sub step
    StatusCircleCheckMark: 'StatusCircleCheckMark', // for sub step
};

/**
 *  Type that maps its keys to each state
 */
export type SubwayNavStateMap = { [key in SubwayNavNodeState]: string | undefined };

/**
 * Mapping that contains Icon color definitions for each state
 */
export type IconColorMap = { [key in SubwayNavNodeState]: string };

/**
 * Mapping that contains Icon ring color definitions
 */
export type IconRingColorMap = { [key in SubwayNavNodeState]: string };
