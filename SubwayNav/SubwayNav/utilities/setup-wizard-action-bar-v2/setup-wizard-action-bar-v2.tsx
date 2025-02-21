// @ts-nocheck
import { styled } from '@fluentui/react';
import type { FC } from 'react';

import { SetupWizardActionBarBaseV2 } from './setup-wizard-action-bar-v2.base';
import { getSetupWizardActionBarV2Styles } from './setup-wizard-action-bar-v2.styles';
import type {
    ISetupWizardActionBarV2Props,
    ISetupWizardActionBarV2StyleProps,
    ISetupWizardActionBarV2Styles,
} from './setup-wizard-action-bar-v2.types';

export const SetupWizardActionBarV2: FC<ISetupWizardActionBarV2Props> = styled<
    ISetupWizardActionBarV2Props,
    ISetupWizardActionBarV2StyleProps,
    ISetupWizardActionBarV2Styles
>(SetupWizardActionBarBaseV2, getSetupWizardActionBarV2Styles, undefined, {
    scope: 'SetupWizardActionBarV2',
});
