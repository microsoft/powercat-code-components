import * as React from 'react';
import { GaugeChart, IGaugeChartProps } from '@fluentui/react-charting';
import { IPartialTheme, ThemeProvider, createTheme } from '@fluentui/react';

export type IGaugeChartCanvasProps = IGaugeChartProps & { themeJSON: string };

export const CanvasGaugeChart = React.memo((props: IGaugeChartCanvasProps) => {
    const { themeJSON, ...rest } = props;
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
            <GaugeChart {...rest} />
        </ThemeProvider>
    );
});
CanvasGaugeChart.displayName = 'CanvasGaugeChart';
