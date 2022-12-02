export interface ISearchBoxComponentProps {
    width?: number;
    height?: number;
    onChanged: (newValue: string | undefined) => void;
    themeJSON?: string;
    ariaLabel?: string;
    underLined?: boolean;
    placeholderText?: string;
    iconName?: string;
    disabled?: boolean;
    disableAnimation?: boolean;
    setFocus?: string;
}
