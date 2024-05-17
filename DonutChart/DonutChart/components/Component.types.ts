import { IDonutChartProps, IChartDataPoint } from '@fluentui/react-charting';

export interface ICanvasDonutChartProps extends IDonutChartProps {
    chartTitle: string;
    chartData: IChartDataPoint[];
    themeJSON?: string;
    chartKey: string;
}
