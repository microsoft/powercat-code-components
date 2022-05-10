export interface TagListItem {
    id: string;
    enabled?: boolean;
    name: string;
    iconName?: string;
    iconColor?: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    iconOnly?: boolean;
    visible?: boolean;
    parentItemKey?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    key: string;
}

export interface CanvasTagListProps {
    width?: number;
    height?: number;
    items: TagListItem[];
    disabled?: boolean;
    tabIndex?: number;
    ariaLabel?: string;
    themeJSON?: string;
    itemMaxWidth?: number;
    maxHeight?: number;
    itemHeight?: number;
    fontSize?: number;
    borderRadius?: number;
    justify?: 'center' | 'left' | 'right';
    onResize?: (width: number, height: number) => void;
}
