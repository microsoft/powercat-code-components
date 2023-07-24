import * as React from 'react';
import { IMaskedTextFieldProps } from '@fluentui/react';

export interface ICanvasMaskedTextFieldProps extends IMaskedTextFieldProps {
    width: number;
    prefixValue: string;
    suffixValue: string;
    maskPattern: string;
    mask: string;
    onChange: (event?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => void;
    themeJSON?: string;
    setFocus?: string;
}
