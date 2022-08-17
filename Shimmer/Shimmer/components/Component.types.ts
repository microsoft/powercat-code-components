export interface ICustomShimmerItem {
    id: string;
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    key: string;
    height: number;
    width: string;
    verticalAlign: string;
    rowkey: string;
}

export interface IShimmerRows {
    id: string;
    key: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    order: number;
    count: number;
    width: number;
}

export interface IShimmerProps {
    width?: number;
    height?: number;
    items: ICustomShimmerItem[];
    rowDetails: IShimmerRows[];
    themeJSON?: string;
    spacebetweenShimmer?: string;
}
