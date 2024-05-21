import * as React from 'react';
import { StackedBarChart, IStackedBarChartProps } from '@fluentui/react-charting';
import { IPartialTheme, ThemeProvider, createTheme } from '@fluentui/react';

export interface ICanvasStackedBarChartProps extends IStackedBarChartProps {
    themeJSON?: string;
}

export const StackedBarChartControl = React.memo((props: ICanvasStackedBarChartProps) => {
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
            <StackedBarChart {...rest} />
        </ThemeProvider>
    );
});
StackedBarChartControl.displayName = 'StackedBarChartControl';
