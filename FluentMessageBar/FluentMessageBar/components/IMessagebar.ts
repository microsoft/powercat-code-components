import { MessageBarIntent } from '@fluentui/react-components';
import { IToolbarItem } from './Toolbar/Component.types';

export interface IMessagebar {
    title: string;
    body: string;
    Url: string;
    linkText: string;
    messageBarIntent: MessageBarIntent;
    messageBarShape?: Shape,
    OnDismiss: () => void;
    // toolbar
    onResize?: (width:number,height: number) => void;
    height: number;
    width: number;
    items: IToolbarItem[];
    disabled: boolean;
    hideDismiss:boolean;
    onSelected: (item?: IToolbarItem, onSelectCalled?: boolean) => void;
    getPopoverRoot: () => HTMLElement;
}

export enum Shape {
    square = 'square',
    rounded = 'rounded'
}