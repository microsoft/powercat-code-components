/* eslint-disable */
/* istanbul ignore file */
import { styled } from '@fluentui/react';
import type { FC } from 'react';

import { SubwayNavBase } from './subway-nav.base';
import { getSubwayNavStyles } from './subway-nav.styles';
import type {
  ISubwayNavProps,
  ISubwayNavStyleProps,
  ISubwayNavStyles,
} from './subway-nav.types';

export const SubwayNav: FC<ISubwayNavProps> = styled<
  ISubwayNavProps,
  ISubwayNavStyleProps,
  ISubwayNavStyles
>(SubwayNavBase, getSubwayNavStyles, undefined, { scope: 'SubwayNav' });
