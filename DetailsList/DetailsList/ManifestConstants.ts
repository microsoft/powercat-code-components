export const enum RecordsColumns {
    RecordKey = 'RecordKey',
    RecordCanSelect = 'RecordCanSelect',
    RecordSelected = 'RecordSelected',
}

export const enum ColumnsColumns {
    ColDisplayName = 'ColDisplayName',
    ColName = 'ColName',
    ColWidth = 'ColWidth',
    ColSortable = 'ColSortable',
    ColSortBy = 'ColSortBy',
    ColHorizontalAlign = 'ColHorizontalAlign',
    ColVerticalAlign = 'ColVerticalAlign',
    ColMultiLine = 'ColMultiLine',
    ColIsBold = 'ColIsBold',
    ColTagColorColumn = 'ColTagColorColumn',
    ColTagBorderColorColumn = 'ColTagBorderColorColumn',
    ColResizable = 'ColResizable',
    ColHeaderPaddingLeft = 'ColHeaderPaddingLeft',
    ColCellType = 'ColCellType',
    ColShowAsSubTextOf = 'ColShowAsSubTextOf',
    ColPaddingTop = 'ColPaddingTop',
    ColPaddingLeft = 'ColPaddingLeft',
    ColLabelAbove = 'ColLabelAbove',
    ColMultiValueDelimiter = 'ColMultiValueDelimiter',
    ColFirstMultiValueBold = 'ColFirstMultiValueBold',
    ColInlineLabel = 'ColInlineLabel',
    ColHideWhenBlank = 'ColHideWhenBlank',
    ColSubTextRow = 'ColSubTextRow',
    ColAriaTextColumn = 'ColAriaTextColumn',
    ColCellActionDisabledColumn = 'ColCellActionDisabledColumn',
    ColImageWidth = 'ColImageWidth',
    ColImagePadding = 'ColImagePadding',
    ColRowHeader = 'ColRowHeader',
}

export const enum InputProperties {
    InputEvent = 'InputEvent',
}

export const enum InputEvents {
    SetFocus = 'SetFocus',
    SetFocusOnRow = 'SetFocusOnRow',
    SetFocusOnRowSetSelection = 'SetFocusOnRowSetSelection',
    ClearSelection = 'ClearSelection',
    SetSelection = 'SetSelection',
    SetFocusOnHeader = 'SetFocusOnHeader',
    LoadNextPage = 'LoadNextPage',
    LoadPreviousPage = 'LoadPreviousPage',
    LoadFirstPage = 'LoadFirstPage',
}

export const enum OutputEvents {
    Sort = 'Sort',
    CellAction = 'CellAction',
    OnRowSelectionChange = 'OnRowSelectionChange',
}

export const enum SortDirection {
    Ascending = '0',
    Descending = '1',
}

export const enum CellTypes {
    Expand = 'expand',
    Tag = 'tag',
    Image = 'image',
    ClickableImage = 'clickableimage',
    IndicatorTag = 'indicatortag',
    Link = 'link',
}
