import { styled } from '@fluentui/react';
import type { FunctionComponent } from 'react';

import { CollapsibleBase } from './collapsible.base';
import { getCollapsibleStyles } from './collapsible.style';
import type { ICollapsibleProps, ICollapsibleStyle } from './collapsible.types';

export const Collapsible: FunctionComponent<ICollapsibleProps> = styled<ICollapsibleProps, any, ICollapsibleStyle>(
    CollapsibleBase,
    getCollapsibleStyles,
    undefined,
    { scope: 'Collapsible' },
);
