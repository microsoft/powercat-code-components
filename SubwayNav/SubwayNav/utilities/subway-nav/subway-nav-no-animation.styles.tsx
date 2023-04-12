/* eslint-disable */
/* istanbul ignore file */
// # FEATURE - Disable animation: Related changes are performed in this file
// any changes related to this feature will be prefixed with => // # FEATURE - Disable animation
// since this is not available OOTB in subwaynav of admin controls, hence it is driven by showAnimation property
// Note: This file is a copy of subway-nav.styles.tsx
import type { IStyle } from '@fluentui/react';
import { isIE11, keyframes } from '@fluentui/react';
import { throwOnUndefinedColor } from '../customizations/src/index';

import type { ISubwayNavNodeProps } from './subway-node.types';
import { SubwayNavNodeState } from './wizard.types';
import type {
  ISubwayNavItemStyleProps,
  ISubwayNavItemStyles,
  ISubwayNavStyleProps,
  ISubwayNavStyles,
} from './subway-nav.types';

const nolineFadeIn = keyframes({
  from: {
    opacity: '1.0',
  },
  to: {
    opacity: '1.0',
  },
});

const nofadeIn = keyframes({
  from: {
    opacity: '1.0',
    visibility: 'visible',
  },
  to: {
    opacity: '1.0',
  },
});

export const getSubwayNavNoAnimationStyles = (props: ISubwayNavStyleProps): ISubwayNavStyles => {
  const { steps, disabled, wizardComplete, theme } = props;
  let stepIndex = 0;
  let totalStepsVisible = steps.length;

  function getSelectedStep(nodeSteps: ISubwayNavNodeProps[], isSubSteps: boolean): void {
    nodeSteps.some((step: ISubwayNavNodeProps, index: number) => {
      if (
        step.state === SubwayNavNodeState.Current ||
        step.state === SubwayNavNodeState.CurrentWithSubSteps
      ) {
        stepIndex += index + (isSubSteps ? 1 : 0);

        if (step.subSteps) {
          totalStepsVisible += step.subSteps.length;
          getSelectedStep(step.subSteps, true);
        }

        return true;
      } else {
        return false;
      }
    });
  }

  getSelectedStep(steps, false);
  const stepCompletedColor = throwOnUndefinedColor(
    theme.semanticColors.stepCompleted,
    'stepCompleted',
    'SubwayNav',
  );
  const wizardCompletedColor = throwOnUndefinedColor(
    theme.semanticColors.allStepsComplete,
    'allStepsComplete',
    'SubwayNav',
  );
  const notStartedColor = throwOnUndefinedColor(
    theme.semanticColors.stepNotStarted,
    'stepNotStarted',
    'SubwayNav',
  );

  // TODO: #1869
  // we have to cast to IStyle because -ms-grid isn't part of the display typedef
  const displayStyle = { display: isIE11() ? '-ms-grid' : 'grid' } as IStyle;

  return {
    root: [
      displayStyle,
      {
        // @ts-ignore Fabric doesn't support the MS specific grid rules
        MsGridColumns: '7px 2px minmax(0, 1fr)',
        gridTemplateColumns: '7px 2px minmax(0, 1fr)',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        position: 'relative',
        selectors: {
          ':before': {
            content: '\'\'',
            display: 'block',
            // @ts-ignore Fabric doesn't support the MS specific grid rules
            MsGridColumn: '2',
            gridColumn: '2',
            // @ts-ignore Fabric doesn't support the MS specific grid rules
            MsGridRow: '1',
            // @ts-ignore Fabric doesn't support the MS specific grid rules
            MsGridRowSpan: `${totalStepsVisible - 1}`,
            gridRow: `1 / ${totalStepsVisible}`,
            backgroundColor: wizardComplete ? wizardCompletedColor : notStartedColor,
            // # FEATURE - Disable animation
            animationName: nolineFadeIn,
            // # FEATURE - Disable animation
            animationDuration: '0s',
            position: 'static',
            opacity: disabled ? 0.5 : 1,
          },
          ':after': {
            content: '\'\'',
            display: stepIndex === 0 || wizardComplete ? 'none' : 'block',
            // @ts-ignore Fabric doesn't support the MS specific grid rules
            MsGridColumn: '2',
            gridColumn: '2',
            // @ts-ignore Fabric doesn't support the MS specific grid rules
            MsGridRow: '1',
            // @ts-ignore Fabric doesn't support the MS specific grid rules
            MsGridRowSpan: `${stepIndex}`,
            gridRow: `1 / ${stepIndex + 1}`,
            backgroundColor: stepCompletedColor,
            position: 'static',
          },
          '& > :not([data-substep="true"])': {
            marginBottom: '36px',
          },
          '& > [data-substep="true"]:nth-child(n)': {
            marginBottom: '27px',
          },
          '& > [data-substep="true"]:nth-child(n) + :not([data-substep="true"]):not(:last-child)':
          {
            marginTop: '12px',
            marginBottom: '36px',
          },
          '& > :last-child, & > [data-substep="true"]:last-child': {
            marginBottom: '0px',
          },
        },
      },
    ],
    subComponentStyles: {
      item: (itemProps: ISubwayNavItemStyleProps): ISubwayNavItemStyles => {
        const { index } = itemProps;

        return {
          root: {
            listStyle: 'none',
            opacity: 0,
            // # FEATURE - Disable animation
            animationName: nofadeIn,
            // # FEATURE - Disable animation
            animationDuration: '0s',
            animationFillMode: 'forwards',
            animationTimingFunction: 'cubic-bezier(.33, 0, .60, 1)',
            // @ts-ignore Fabric doesn't support the MS specific grid rules
            '-ms-grid-column': `${1}`,
            // @ts-ignore Fabric doesn't support the MS specific grid rules
            '-ms-grid-column-span': `${3}`,
            gridColumn: '1 / 4',
            // @ts-ignore Fabric doesn't support the MS specific grid rules
            '-ms-grid-row': `${index + 1}`,
            gridRow: `${index + 1}`,
            animationDelay: `0s`,
          },
        };
      },
    },
  };
};
