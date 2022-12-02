import { styled } from '@fluentui/react';
import type { FC } from 'react';

import { WizardBase } from './wizard.base';
import { getWizardStyles } from './wizard.styles';
import type { IWizardProps, IWizardStyleProps, IWizardStyles } from './wizard.types';

export const Wizard: FC<IWizardProps> = styled<IWizardProps, IWizardStyleProps, IWizardStyles>(
    WizardBase,
    getWizardStyles,
    undefined,
    { scope: 'Wizard' },
);
