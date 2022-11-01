/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

import { ISearchBoxProps } from '@fluentui/react'

export interface ISearchBoxComponentProps extends ISearchBoxProps {
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
}
