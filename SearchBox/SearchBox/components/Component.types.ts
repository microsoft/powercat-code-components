export interface ISearchBoxComponentProps {
    width?: number;
    height?: number;
    onChange: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
    themeJSON?: string;
    ariaLabel?: string;
    underLined?: boolean;
    placeholderText?: string;
    iconName?: string;
    disabled?: boolean;
    disableAnimation?: boolean;
    setFocus?: string;
    borderColor?: string;
    value?: string;
}
