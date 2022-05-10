export interface CanvasContextMenuItem {
    id: string;
    enabled?: boolean;
    name: string;
    iconName?: string;
    iconColor?: string;
    textColor?: string;
    itemCount?: number;
    iconOnly?: boolean;
    visible?: boolean;
    parentItemKey?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    key: string;
    checked: boolean;
}

export interface CanvasContextMenuProps {
    width?: number;
    height?: number;
    text?: string;
    textColor?: string;
    iconName?: string;
    iconColor?: string;
    borderColor?: string;
    backgroundColor?: string;
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
