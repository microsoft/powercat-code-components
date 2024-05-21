import * as React from 'react';
import { ProgressIndicator, createTheme, ThemeProvider, IPartialTheme, IProgressIndicatorProps } from '@fluentui/react';

export interface ICustomProgressIndicatorProps {
    label?: string;
    typeofIndidcator: string;
    description?: string;
    percentComplete: number;
    intervalIncrement?: number;
    themeJSON?: string;
    ariaLabel?: string;
    intervalDelay?: number;
    progressHidden?: boolean;
    barHeight?: number;
    width?: number;
    height?: number;
}

export const CanvasProgressIndicator = React.memo((props: ICustomProgressIndicatorProps) => {
    const { label, description, percentComplete, themeJSON, typeofIndidcator, progressHidden, barHeight } = props;

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    const progressIndidcatorProps = {
        styles: {
            root: { width: props.width },
        },
        progressHidden: progressHidden,
        barHeight: barHeight,
        label: label,
        description: description,
        ...(typeofIndidcator === 'Default Indicator' && { percentComplete: percentComplete / 100 }),
    } as IProgressIndicatorProps;

    return (
        <ThemeProvider theme={theme}>
            <ProgressIndicator {...progressIndidcatorProps} />
        </ThemeProvider>
    );
});
CanvasProgressIndicator.displayName = 'CanvasProgressIndicator';
