import { styled } from '@fluentui/react';
import type * as React from 'react';
import type { FunctionComponent } from 'react';

import { LoadingPaneBase } from './loading-pane.base';
import { getLoadingPaneStyles } from './loading-pane.style';
import type { ILoadingPaneProps, ILoadingPaneStyleProps, ILoadingPaneStyles } from './loading-pane.types';

export const LoadingPane: FunctionComponent<ILoadingPaneProps> = styled<
    ILoadingPaneProps,
    ILoadingPaneStyleProps,
    ILoadingPaneStyles
>(LoadingPaneBase, getLoadingPaneStyles, undefined, { scope: 'LoadingPane' });
