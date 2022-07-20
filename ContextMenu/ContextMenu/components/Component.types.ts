export interface CanvasContextMenuItem {
    id: string;
    enabled?: boolean;
    name: string;
    iconName?: string;
    iconColor?: string;
    itemCount?: number;
    iconOnly?: boolean;
    visible?: boolean;
    parentItemKey?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    key: string;
    checked: boolean;
    isHeader?: boolean;
    divider?: boolean;
    topDivider?: boolean;
}

export interface CanvasContextMenuProps {
    width?: number;
    height?: number;
    text?: string;
    textColor?: string;
    iconSize?: number;
    iconColor?: string;
    hoverIconColor?: string;
    fontSize?: number;
    fontColor?: string;
    hoverFontColor?: string;
    borderColor?: string;
    hoverBorderColor?: string;
    borderRadius?: number;
    fillColor?: string;
    hoverFillColor?: string;
    showChevron?: boolean;
    justify?: 'center' | 'left' | 'right';
    items: CanvasContextMenuItem[];
    onSelected: (item?: CanvasContextMenuItem) => void;
    disabled?: boolean;
    tabIndex?: number;
    ariaLabel?: string;
    themeJSON?: string;
    setFocus?: string;
}
