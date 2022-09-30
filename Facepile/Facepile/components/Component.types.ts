import { PersonaSize, IFacepilePersona, OverflowButtonType } from '@fluentui/react';

export interface IFacepileprops {
    width?: number;
    height?: number;
    text?: string;
    textColor?: string;
    imagesFadeIn?: boolean;
    displayedPersonas?: number;
    personaSize: PersonaSize;
    items: ICustomFacepile[];
    disabled?: boolean;
    tabIndex?: number;
    ariaLabel?: string;
    themeJSON?: string;
    setFocus?: string;
    overflowButtonType?: OverflowButtonType;
    onSelected: (eventName: string, item?: IFacepilePersona) => void;
    showAddButton: boolean;
    overflowButtonAriaLabel: string;
    addbuttonAriaLabel: string;
}

export interface ICustomFacepile {
    id: string;
    key: string;
    personaName: string;
    imageUrl: string;
    presence: string;
    imageInitials?: string;
    initialsColor?: number;
    clickable: boolean;
    onClick?: (ev: unknown, persona?: IFacepilePersona) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
}
