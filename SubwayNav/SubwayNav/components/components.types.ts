import { ISubwayNavNodeProps } from '../utilities/subway-nav/subway-node.types';

export interface ISubNavItem {
    id: string;
    parentId?: string;
    index?: number;
    label: string;
    state: string;
    key: string;
    clickable?: boolean;
    disabled?: boolean;
    data: any;
    visuallyDisabled?: boolean;
}

export interface ICustomSubwayNavProps {
    ItemKey: string;
    ItemLabel: string;
    ItemState?: string;
    ItemDisabled?: boolean;
    ParentItemKey?: string;
    ItemVisuallyDisabled?: boolean;
}

export interface ISubNavProps {
    width?: number;
    height?: number;
    items: ISubNavItem[];
    onSelected: (item: ISubNavItem, steps: ISubwayNavNodeProps[]) => void;
    themeJSON?: string;
    ariaLabel?: string;
    setFocus?: string;
    tabIndex?: number;
    maxDisplayedItems?: number;
    overflowIndex?: number;
    applyDarkTheme?: boolean;
    disabled: boolean;
    wizardComplete: string;
    showAnimation?: boolean;
}
