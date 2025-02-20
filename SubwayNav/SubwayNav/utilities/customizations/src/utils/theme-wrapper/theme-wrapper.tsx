// @ts-nocheck
import type { FunctionComponent, ReactElement } from 'react';

import type { IM365Theme } from '../../customizations/m365-theme.types';
import { useM365Theme } from '../use-m365-theme';
import type { IThemeWrapperProps } from './theme-wrapper.types';

export const ThemeWrapper: FunctionComponent<IThemeWrapperProps> = (props: IThemeWrapperProps): ReactElement => {
    const theme = useM365Theme();

    return _renderContent(theme);

    function _renderContent(_theme: IM365Theme): ReactElement {
        return props.children(_theme);
    }
};
