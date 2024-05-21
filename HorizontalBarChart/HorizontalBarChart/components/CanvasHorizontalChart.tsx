import * as React from 'react';
import { HorizontalBarChart, IHorizontalBarChartProps } from '@fluentui/react-charting';
import { IPartialTheme, ThemeProvider, createTheme } from '@fluentui/react';

export interface ICanvasHorizontalBarChartProps extends IHorizontalBarChartProps {
    themeJSON?: string;
}

export const CanvasHorizontalChart = React.memo((props: ICanvasHorizontalBarChartProps) => {
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
        <ThemeProvider theme={theme} style={{ backgroundColor: 'transparent' }}>
            <HorizontalBarChart {...rest} />
        </ThemeProvider>
    );
});
CanvasHorizontalChart.displayName = 'CanvasHorizontalChart';
