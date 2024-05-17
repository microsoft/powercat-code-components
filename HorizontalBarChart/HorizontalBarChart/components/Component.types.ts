import { IDonutChartProps, IChartDataPoint } from '@fluentui/react-charting';

export interface ICanvasHorizontalChartProps extends IDonutChartProps {
    chartTitle: string;
    chartData: IChartDataPoint[];
    themeJSON?: string;
}
