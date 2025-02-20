// @ts-nocheck
/* eslint-disable */
/* istanbul ignore file */
import type { IFocusZoneProps, IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import type { IM365Theme } from '../customizations/src';

import type { ISubwayNavNodeProps, SubwayNavStateMap } from './subway-node.types';

export interface ISubwayNavProps {
  /**
   * Steps to render.
   */
  steps: ISubwayNavNodeProps[];

  /**
   * Wizard complete flag
   * Sets the vertical lines to green.
   * Be sure to also run your step array through the 'completeAllSteps' utility method
   * to ensure they're in the proper state as well.
   */
  wizardComplete?: boolean;

  /**
   * Flag indicating if the whole subway nav should appear as disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Option function to override rendering of steps
   */
  onRenderSteps?: (props: ISubwayNavProps) => JSX.Element[];

  /**
   * Props for the FocusZone within the component
   */
  focusZoneProps?: IFocusZoneProps;

  /**
   * Props for mapping localized strings to step/substep state
   */
  stateAriaLabels?: SubwayNavStateMap;
  /**
   * Any custom styles provided by the consumers
   */
  styles?: IStyleFunctionOrObject<ISubwayNavStyleProps, ISubwayNavStyles>;

  /**
   * Theme provided by higher order component
   */
  theme?: IM365Theme;
  // # FEATURE - Disable animation
  /**
   * To show or hide initial animation effect
   */
  showAnimation?: boolean;
}

export interface ISubwayNavStyles {
  /**
   * The root of the subway nav
   */
  root: IStyle;

  /**
   * SubComponent styles for the SubwayNav
   */
  subComponentStyles: ISubwayNavSubComponentStyles;
}

export interface ISubwayNavSubComponentStyles {
  /**
   * Styles for the list item that contains each step.
   */
  item: IStyleFunctionOrObject<ISubwayNavItemStyleProps, ISubwayNavItemStyles>;
}

export interface ISubwayNavItemStyles {
  root: IStyle;
}

export interface ISubwayNavItemStyleProps {
  /**
   * The index of the item within the nav
   */
  index: number;

  /**
   * the id of the item, this is to ensure we don't memoize when we shouldn't
   */
  id: string;
}

export interface ISubwayNavStyleProps {
  /**
   * Steps to render.
   */
  steps: ISubwayNavNodeProps[];

  /**
   * Flag to show all steps in the subway nav as disabled.
   */
  disabled: boolean;

  /**
   * Wizard complete flag
   */
  wizardComplete?: boolean;

  /**
   * Theme provided by higher order component
   */
  theme: IM365Theme;
}
