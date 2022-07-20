export interface CanvasCommandItem {
    id: string;
    enabled?: boolean;
    name: string;
    iconName?: string;
    iconColor?: string;
    itemCount?: number;
    farItem?: boolean;
    overflow?: boolean;
    iconOnly?: boolean;
    visible?: boolean;
    parentItemKey?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    key: string;
    checked?: boolean;
    split?: boolean;
    isHeader?: boolean;
    divider?: boolean;
    topDivider?: boolean;
}

export interface CanvasCommandBarProps {
    width?: number;
    height?: number;
    items: CanvasCommandItem[];
    onSelected: (item: CanvasCommandItem) => void;
    disabled?: boolean;
    tabIndex?: number;
    ariaLabel?: string;
    themeJSON?: string;
    setFocus?: string;
    visible?: boolean;
}
