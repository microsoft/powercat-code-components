/* eslint-disable */
/* istanbul ignore file */
import { styled } from '@fluentui/react';
import type { FC } from 'react';

import { SubwayNavBase } from './subway-nav.base';
import { getSubwayNavStyles } from './subway-nav.styles';
import { getSubwayNavNoAnimationStyles } from './subway-nav-no-animation.styles';
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

export const SubwayNavNoAnimation: FC<ISubwayNavProps> = styled<
  ISubwayNavProps,
  ISubwayNavStyleProps,
  ISubwayNavStyles
>(SubwayNavBase, getSubwayNavNoAnimationStyles, undefined, { scope: 'SubwayNav' });
