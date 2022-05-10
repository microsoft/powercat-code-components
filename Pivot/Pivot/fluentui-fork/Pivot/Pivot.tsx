/* eslint-disable */
/* istanbul ignore file */
import * as React from 'react';
import { PivotBase } from './Pivot.base';
import { getStyles } from './Pivot.styles';
import { IPivotProps, IPivotStyleProps, IPivotStyles, styled } from '@fluentui/react';

/**
 * The Pivot control and related tabs pattern are used for navigating frequently accessed,
 * distinct content categories. Pivots allow for navigation between two or more content
 * views and relies on text headers to articulate the different sections of content.
 */
export const Pivot: React.FunctionComponent<IPivotProps> = styled<IPivotProps, IPivotStyleProps, IPivotStyles>(
  PivotBase,
  getStyles,
  undefined,
  {
    scope: 'Pivot',
  },
);
