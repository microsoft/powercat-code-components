// @ts-nocheck
import type { ITheme } from '@fluentui/react';
import type { ReactElement } from 'react';

export interface IThemeWrapperProps {
    /**
     * Function that injects the current context's theme and returns elements
     */
    children: (theme: ITheme) => ReactElement;
}
