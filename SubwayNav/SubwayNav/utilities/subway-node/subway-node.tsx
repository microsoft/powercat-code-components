import { styled } from '@fluentui/react';
import type { FC } from 'react';

import { SubwayNodeBase } from './subway-node.base';
import { getSubwayNodeStyles } from './subway-node.styles';
import type { ISubwayNavNodeProps, ISubwayNavNodeStyleProps, ISubwayNavNodeStyles } from './subway-node.types';

export const SubwayNode: FC<ISubwayNavNodeProps> = styled<
    ISubwayNavNodeProps,
    ISubwayNavNodeStyleProps,
    ISubwayNavNodeStyles
>(SubwayNodeBase, getSubwayNodeStyles, undefined, { scope: 'SubwayNode' }, true);
