// @ts-nocheck
import type { ISettings } from '@fluentui/react';

import { ButtonStyles } from './button.styles';
import { CheckStyles } from './check.styles';
import { CheckboxStyles } from './checkbox.styles';
import { ChoiceGroupOptionStyles } from './choice-group-option.styles';
import { DefaultButtonStyles } from './default-button.styles';
import { DetailsRowCheckStyles } from './detail-row-check.styles';
import { DetailsColumnStyles } from './details-list-column.styles';
import { DetailsRowStyles } from './details-row.styles';
import { DialogFooterStyles } from './dialog-footer.styles';
import { GroupHeaderStyles } from './group-header.styles';
import { OverlayStyles } from './overlay.styles';
import { PanelStyles } from './panel.styles';
import { PivotStyles } from './pivot.styles';
import { PrimaryButtonStyles } from './primary-button.styles';
import { SearchBoxStyles } from './search-box.styles';
import { SpinnerStyles } from './spinner.styles';

export const M365Styles: { [key: string]: ISettings } = {
    ActionButton: { styles: DefaultButtonStyles },
    Button: { styles: ButtonStyles },
    Check: { styles: CheckStyles },
    Checkbox: { styles: CheckboxStyles },
    ChoiceGroupOption: { styles: ChoiceGroupOptionStyles },
    CommandBarButton: { styles: DefaultButtonStyles },
    CompoundButton: { styles: DefaultButtonStyles },
    DefaultButton: { styles: DefaultButtonStyles },
    DetailsColumn: { styles: DetailsColumnStyles },
    DetailsRow: { styles: DetailsRowStyles },
    DetailsRowCheck: { styles: DetailsRowCheckStyles },
    DialogFooter: { styles: DialogFooterStyles },
    GroupHeader: { styles: GroupHeaderStyles },
    Overlay: { styles: OverlayStyles },
    Panel: { styles: PanelStyles },
    Pivot: { styles: PivotStyles },
    PrimaryButton: { styles: PrimaryButtonStyles },
    SearchBox: { styles: SearchBoxStyles },
    Spinner: { styles: SpinnerStyles },
};
