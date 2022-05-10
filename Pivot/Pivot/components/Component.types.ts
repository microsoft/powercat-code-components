export interface PivotLink {
    id: string;
    enabled?: boolean;
    name: string;
    iconName?: string;
    iconColor?: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    itemCount?: number;
    visible?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    key: string;
    checked: boolean;
}

export interface PivotProps {
    width?: number;
    height?: number;
    items: PivotLink[];
    onSelected: (item: PivotLink) => void;
    disabled?: boolean;
    tabIndex?: number;
    ariaLabel?: string;
    themeJSON?: string;
    selectedKey?: string;
    setFocus?: string;
    linkSize: 'normal' | 'large';
    linkFormat: 'links' | 'tabs';
}
