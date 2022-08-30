<<<<<<< HEAD
import { IShimmerElement } from '@fluentui/react';

=======
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
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
<<<<<<< HEAD
    shimmerElements: IShimmerElement[];
    themeJSON?: string;
    spacebetweenShimmer?: string;
    rowCount?: number;
=======
    items: ICustomShimmerItem[];
    rowDetails: IShimmerRows[];
    themeJSON?: string;
    spacebetweenShimmer?: string;
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
}
