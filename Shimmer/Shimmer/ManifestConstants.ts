export const enum ManifestPropertyNames {
    dataset = 'dataset',
}

export const enum ItemColumns {
    Key = 'ItemKey',
    Type = 'ItemType',
    Height = 'ItemHeight',
    Width = 'ItemWidth',
    VerticalAlign = 'ItemVerticalAlign',
    RowKey = 'ItemRowKey',
}

export const enum RowColumns {
    Key = 'RowKey',
    Order = 'RowOrder',
    Count = 'RowCount',
    Width = 'RowWidth',
}

export const enum InputEvents {
    SetFocus = 'SetFocus',
    Reset = 'Reset',
}

export const enum InputProperties {
    SelectedKey = 'SelectedKey',
}

export class RenderTypes {
    static PivotLinks = '0';
    static PivotTabs = '1';
}

export class RenderSize {
    static Normal = '0';
    static Compact = '1';
    static Large = '2';
}
