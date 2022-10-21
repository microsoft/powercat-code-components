import * as React from 'react';
import { Persona, createTheme, ThemeProvider, IPartialTheme } from '@fluentui/react';
import { IPersonaprops } from './Component.types';

export const CanvasPersona = React.memo((props: IPersonaprops) => {
    const { themeJSON } = props;

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    return (
        <ThemeProvider theme={theme}>
            <Persona {...props} />
        </ThemeProvider>
    );
});
CanvasPersona.displayName = 'CanvasProgressIndicator';
