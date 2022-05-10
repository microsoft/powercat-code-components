export const enum ManifestPropertyNames {
    dataset = 'dataset',
}

export const enum ItemColumns {
    DisplayName = 'ItemDisplayName',
    Key = 'ItemKey',
    Enabled = 'ItemEnabled',
    IconName = 'ItemIconName',
    IconColor = 'ItemIconColor',
    TextColor = 'ItemTextColor',
    ParentKey = 'ItemParentKey',
    IconOnly = 'ItemIconOnly',
    Visible = 'ItemVisible',
    Checked = 'ItemChecked',
    ItemCount = 'ItemCount',
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
