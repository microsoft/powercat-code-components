// @ts-nocheck
import type { IGetFocusStylesOptions, IStyle } from '@fluentui/react';
import { FontWeights, getFocusStyle } from '@fluentui/react';
import type { IM365Theme } from '../customizations/src';
import { addAlphaChannelToHex, throwOnUndefinedColor } from '../customizations/src';

import type {
    IconColorMap,
    IconRingColorMap,
    ISubwayNavNodeStyleProps,
    ISubwayNavNodeStyles,
    SubwayNavStateMap,
} from './subway-node.types';
import { IconNames, SubwayNavNodeState } from './subway-node.types';

export const itemSpacing = 27;
export const largeSubwayNavIconSize = 16;
export const smallSubwayNavIconSize = 8;

export const getIconMap = (isSubStep: boolean, Icon: string): SubwayNavStateMap => {
    return isSubStep
        ? {
              Completed: IconNames.StatusCircleCheckMark,
              CurrentWithSubSteps: undefined,
              Current: IconNames.FullCircleMask,
              Error: IconNames.StatusError,
              NotStarted: undefined,
              Skipped: undefined,
              Unsaved: IconNames.FullCircleMask,
              ViewedNotCompleted: IconNames.FullCircleMask,
              WizardComplete: IconNames.StatusCircleCheckMark,
              Custom: !Icon ? IconNames.FullCircleMask : Icon,
          }
        : {
              Completed: IconNames.CompletedSolid,
              CurrentWithSubSteps: IconNames.FullCircleMask,
              Current: IconNames.FullCircleMask,
              Error: IconNames.StatusErrorFull,
              NotStarted: undefined,
              Skipped: undefined,
              Unsaved: IconNames.FullCircleMask,
              ViewedNotCompleted: IconNames.FullCircleMask,
              WizardComplete: IconNames.CompletedSolid,
              Custom: !Icon ? IconNames.FullCircleMask : Icon,
          };
};

export const getIconColorMap = (isSubStep: boolean, theme: IM365Theme, prefferedColor: string): IconColorMap => {
    return isSubStep
        ? {
              Completed: throwOnUndefinedColor(theme.semanticColors.stepCompleted, 'stepCompleted', 'SubwayNode'),
              CurrentWithSubSteps: throwOnUndefinedColor(theme.semanticColors.stepCurrent, 'stepCurrent', 'SubwayNode'),
              Current: throwOnUndefinedColor(theme.semanticColors.stepCurrent, 'stepCurrent', 'SubwayNode'),
              Error: throwOnUndefinedColor(theme.semanticColors.stepError, 'stepError', 'SubwayNode'),
              NotStarted: 'transparent',
              Skipped: 'transparent',
              Unsaved: theme.palette.themeLighter,
              ViewedNotCompleted: theme.palette.accent,
              WizardComplete: throwOnUndefinedColor(
                  theme.semanticColors.allStepsComplete,
                  'allStepsComplete',
                  'SubwayNode',
              ),
              Custom: !prefferedColor ? throwOnUndefinedColor(theme.semanticColors.stepCurrent, 'stepCurrent', 'SubwayNode') : 
              throwOnUndefinedColor(prefferedColor, 'ItemColor', 'UserInput'),
          }
        : {
              Completed: throwOnUndefinedColor(theme.semanticColors.stepCompleted, 'stepCompleted', 'SubwayNode'),
              CurrentWithSubSteps: throwOnUndefinedColor(
                  theme.semanticColors.stepCompleted,
                  'stepCompleted',
                  'SubwayNode',
              ),
              Current: throwOnUndefinedColor(theme.semanticColors.stepCurrent, 'stepCurrent', 'SubwayNode'),
              Error: throwOnUndefinedColor(theme.semanticColors.stepError, 'stepError', 'SubwayNode'),
              NotStarted: 'transparent',
              Skipped: 'transparent',
              Unsaved: theme.palette.themeLighter,
              ViewedNotCompleted: theme.palette.accent,
              WizardComplete: throwOnUndefinedColor(
                  theme.semanticColors.allStepsComplete,
                  'allStepsComplete',
                  'SubwayNode',
              ),
              Custom: !prefferedColor ? throwOnUndefinedColor(theme.semanticColors.stepCurrent, 'stepCurrent', 'SubwayNode') : 
              throwOnUndefinedColor(prefferedColor, 'ItemColor', 'UserInput'),
          };
};

export const getIconRingColorMap = (theme: IM365Theme): IconRingColorMap => {
    return {
        Completed: 'transparent',
        CurrentWithSubSteps: 'transparent',
        Current: 'transparent',
        Error: 'transparent',
        NotStarted: throwOnUndefinedColor(theme.semanticColors.stepNotStarted, 'stepNotStarted', 'SubwayNode'),
        Skipped: theme.palette.accent,
        Unsaved: theme.palette.accent,
        ViewedNotCompleted: 'transparent',
        WizardComplete: 'transparent',
        Custom: 'transparent',
    };
};

export const getSubwayNodeStyles = (props: ISubwayNavNodeStyleProps): ISubwayNavNodeStyles => {
    const { disabled, isVisuallyDisabled, isSubStep, iconRecord, state, itemColor, theme } = props;
    const options: IGetFocusStylesOptions = {
        inset: undefined,
        position: undefined,
        highContrastStyle: {
            outlineColor: theme.semanticColors.focusBorder,
        },
        borderColor: 'transparent',
        outlineColor: undefined,
    };
    const iconColorMap = getIconColorMap(isSubStep, theme, itemColor)[state];
    const useSelectedStyle: boolean =
        state === SubwayNavNodeState.Current || state === SubwayNavNodeState.CurrentWithSubSteps;

    const commonLabelStyles: IStyle = [
        {
            transition: 'all .1s',
        },
    ];

    const isActuallyVisuallyDisabled = disabled && isVisuallyDisabled;
    const visualDisabledBehavior = (hexColor: string) => {
        return isActuallyVisuallyDisabled ? addAlphaChannelToHex(hexColor, 50) : hexColor;
    };

    // Apply the small size to all the substeps EXCEPT error and completed since they have special icons.
    const iconSize: number =
        isSubStep &&
        state !== SubwayNavNodeState.Error &&
        state !== SubwayNavNodeState.Completed &&
        state !== SubwayNavNodeState.WizardComplete
            ? smallSubwayNavIconSize
            : largeSubwayNavIconSize;

    return {
        root: [
            getFocusStyle(theme, options),
            {
                display: 'flex',
                alignItems: 'flex-start',
                cursor: disabled ? 'default' : 'pointer',
                background: 'none',
                width: '100%',
                border: 'none',
                textAlign: 'left',
                padding: 0,
            },
        ],
        iconContainer: [
            {
                flex: '0 0 16px',
                height: '16px',
                display: 'block',
                padding: isSubStep ? '0px' : '4px 0px',
                backgroundColor: theme.semanticColors.bodyBackground,
                boxSizing: 'content-box',
                overflow: 'visible',
            },
        ],
        icon: [
            iconRecord?.subset.className,
            {
                fill: visualDisabledBehavior(iconColorMap || getIconColorMap(isSubStep, theme, "")[state]),
                fontSize: iconSize,
            },
        ],
        iconBackPlate: [
            {
                fill: visualDisabledBehavior(theme.semanticColors.accentButtonText),
            },
        ],
        iconRing: [
            {
                stroke: getIconRingColorMap(theme)[state],
                fill: 'none',
                opacity: isActuallyVisuallyDisabled ? 0.5 : undefined,
                strokeWidth: 2,
                fontSize: iconSize,
            },
        ],
        spacer: [{ flex: '0 0 12px' }],
        label: [
            commonLabelStyles,
            {
                opacity: useSelectedStyle ? 0 : 1,
            },
        ],
        labelSelected: [
            commonLabelStyles,
            {
                opacity: useSelectedStyle ? 1 : 0,
                fontWeight: FontWeights.bold,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
            },
        ],
        labelWrapper: [
            isSubStep ? theme.fonts.small : theme.fonts.medium,
            {
                flex: '1 1 auto',
                color: visualDisabledBehavior(theme.semanticColors.bodyText),
                backgroundColor: theme.semanticColors.bodyBackground,
                position: 'relative',
                marginTop: isSubStep ? '-0.05em' : '0.15em',
            },
        ],
    };
};
