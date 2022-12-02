import { ISpinButtonProps } from '@fluentui/react/lib/SpinButton';

export interface ISpinButtonComponentProps extends ISpinButtonProps {
    label: string;
    defaultValue: string;
    themeJSON?: string;
    width?: number;
    height?: number;
    incrementButtonAriaLabel: string;
    decrementButtonAriaLabel: string;
    iconName?: string;
    disabled?: boolean;
    min: number;
    max: number;
    step: number;
    suffix: string;
    setFocus?: string;
    error?: boolean;
    onChanged: (newValue: string) => void;
}
