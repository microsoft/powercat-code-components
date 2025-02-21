// @ts-nocheck
import type { ICustomizerContext } from '@fluentui/react';
import { CustomizerContext } from '@fluentui/react';
import type { ComponentType, FunctionComponent } from 'react';
import * as React from 'react';

import type { IM365Theme } from '../customizations/m365-theme.types';

export interface IM365ThemeAwareProps {
    theme?: IM365Theme;
}

/**
 * @deprecated - This component will not be supported in v8. Please transition to useM365Theme
 * or ThemeWrapper components which will be supported in v8 and beyond.
 */
export function themed<P extends IM365ThemeAwareProps>(Component: ComponentType<P>): FunctionComponent<P> {
    return function ThemedComponent(props: Pick<P, Exclude<keyof P, keyof IM365ThemeAwareProps>>): JSX.Element {
        return <CustomizerContext.Consumer>{_renderContent}</CustomizerContext.Consumer>;

        function _renderContent(context: ICustomizerContext): JSX.Element {
            return <Component {...(props as P)} theme={context.customizations.settings.theme} />;
        }
    };
}
