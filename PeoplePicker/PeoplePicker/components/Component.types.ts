import { IPersonaProps, IBasePicker, IRefObject } from '@fluentui/react';
export interface CanvasPeoplePickerProps {
    width?: number;
    height?: number;
    suggestedPeople: IPersonaProps[];
    defaultSelected: IPersonaProps[];
    disabled?: boolean;
    tabIndex?: number;
    ariaLabel?: string;
    themeJSON?: string;
    setFocus?: string;
    visible?: boolean;
    isPickerDisabled: boolean;
    showSecondaryText: boolean;
    peoplepickerType: string;
    error?: boolean;
    componentRef?: IRefObject<IBasePicker<IPersonaProps>>;
    onResize?: (width: number, height: number) => void;
    accessibilityLabel?: string;
    filterSuggestions: (search: string) => Promise<IPersonaProps[]> | IPersonaProps[];
    onPersonSelect: (items: IPersonaProps[]) => void;
    updateSearchTerm: (searchTerm: string) => void;
    onFocus: () => void;
    onBlur: () => void;
    minimumFilterLength: number;
    keepTypingMessage: string;
    noresultfoundText: string;
    suggestionsHeaderText: string;
    hintText: string;
    maxPeople: number;
}

export interface ICustomPersonaProps {
    PersonaKey: string;
    PersonaName: string;
    PersonaImgUrl?: string;
    PersonaImageAlt?: string;
    PersonaRole?: string;
    PersonaPresence?: number;
}

export interface IExtendedPersonaProps {
    imageUrl?: string;
    imageInitials?: string;
    text?: string;
    secondaryText?: string;
    tertiaryText?: string;
    optionalText?: string;
    presence?: number;
    isValid?: boolean;
    canExpand?: boolean;
    key: string | number;
}

/*specifying events types here until it is unlocked by platform*/
export interface IPropBag<T> extends ComponentFramework.Context<T> {
    parameters: T;
    events: IEventBag;
}
export declare type IEventBag = Record<string, () => void>;
