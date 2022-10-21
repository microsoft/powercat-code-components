/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

//import { ISearchBoxProps } from '@fluentui/react'

export interface ISearchBoxComponentProps {
    width?: number;
    height?: number;
    onChanged: (newValue: string | undefined) => void;
    themeJSON?: string;
    ariaLabel?: string;
}
