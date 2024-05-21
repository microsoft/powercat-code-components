import * as React from 'react';
import { DonutChart, IChartProps } from '@fluentui/react-charting';
import { ICanvasDonutChartProps } from './Component.types';
import { IPartialTheme, ThemeProvider, createTheme } from '@fluentui/react';

export const CanvasDonutChart = React.memo((props: ICanvasDonutChartProps) => {
    const {
        chartTitle,
        chartData,
        hideLabels,
        innerRadius,
        showLabelsInPercent,
        styles,
        valueInsideDonut,
        themeJSON,
        chartKey,
    } = props;

    const data: IChartProps = {
        chartTitle: chartTitle,
        chartData: chartData,
    };

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
            <DonutChart
                data={data}
                innerRadius={innerRadius}
                legendProps={{
                    allowFocusOnLegends: true,
                }}
                key={chartKey}
                hideLabels={hideLabels}
                showLabelsInPercent={showLabelsInPercent}
                styles={styles}
                valueInsideDonut={valueInsideDonut}
                enableReflow={true}
                enabledLegendsWrapLines={true}
            />
        </ThemeProvider>
    );
});
CanvasDonutChart.displayName = 'CanvasDonutChart';
