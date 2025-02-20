// @ts-nocheck
import { styled } from '@fluentui/react';
import type { FC } from 'react';

import { WizardActionBarBase } from './wizard-action-bar.base';
import { getWizardActionBarStyles } from './wizard-action-bar.styles';
import type {
    IWizardActionBarProps,
    IWizardActionBarStyleProps,
    IWizardActionBarStyles,
} from './wizard-action-bar.types';

export const WizardActionBar: FC<IWizardActionBarProps> = styled<
    IWizardActionBarProps,
    IWizardActionBarStyleProps,
    IWizardActionBarStyles
>(WizardActionBarBase, getWizardActionBarStyles, undefined, { scope: 'WizardActionBar' });
