export interface NavItem {
    id: string;
    enabled?: boolean;
    name: string;
    iconName?: string;
    iconColor?: string;
    visible?: boolean;
    parentItemKey?: string;
    url: string;
    links: NavItem[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    key: string;
    isExpanded: boolean;
}

export interface CanvasNavProps {
    width?: number;
    height?: number;
    items: NavItem[];
    nestedItems: NavItem[];
    onSelected: (item: NavItem) => void;
    disabled?: boolean;
    tabIndex?: number;
    ariaLabel?: string;
    themeJSON?: string;
    selectedKey?: string;
    setFocus?: string;
    collapseByDefault?: boolean;
}
