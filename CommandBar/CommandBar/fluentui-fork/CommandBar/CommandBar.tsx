/* eslint-disable */
/* istanbul ignore file */
import * as React from 'react';
import { styled } from '@fluentui/react';
import { CommandBarBase } from './CommandBar.base';
import { getStyles } from './CommandBar.styles';
import type { ICommandBarProps, ICommandBarStyleProps, ICommandBarStyles } from '@fluentui/react';

// Create a CommandBar variant which uses these default styles and this styled subcomponent.
export const CommandBar: React.FunctionComponent<ICommandBarProps> = styled<
  ICommandBarProps,
  ICommandBarStyleProps,
  ICommandBarStyles
>(CommandBarBase, getStyles, undefined, {
  scope: 'CommandBar',
});
