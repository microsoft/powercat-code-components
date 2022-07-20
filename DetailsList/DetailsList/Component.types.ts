import { IColumn } from '@fluentui/react';

export interface IGridColumn extends IColumn {
    isBold?: boolean;
    tagColor?: string;
    tagBorderColor?: string;
    headerPaddingLeft?: number;
    cellType?: string;
    showAsSubTextOf?: string;
    subTextRow?: number;
    childColumns: IGridColumn[];
    isLabelAbove?: boolean;
    paddingLeft?: number;
    paddingTop?: number;
    multiValuesDelimiter?: string;
    firstMultiValueBold?: boolean;
    inlineLabel?: string;
    hideWhenBlank?: boolean;
    ariaTextColumn?: string;
    cellActionDisabledColumn?: string;
    imageWidth?: string;
    imagePadding?: number;
    verticalAligned?: string;
    horizontalAligned?: string;
}
