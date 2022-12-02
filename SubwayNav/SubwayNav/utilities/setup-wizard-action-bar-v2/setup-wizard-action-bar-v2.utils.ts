import type { IContextualMenuItem } from '@fluentui/react';
import { getId } from '@fluentui/react';

import { generateWizardClickHandler } from '../utilities/index';
import type { IWizardStepProps } from '../wizard/index';
import type { IWizardStepLinkProps } from './setup-wizard-action-bar-v2.types';

export const generateContextualMenuItemFromLink = (
    linkProps: IWizardStepLinkProps,
    currentStep: IWizardStepProps,
): IContextualMenuItem => {
    const { contextualMenuItemProps } = linkProps;

    return {
        text: linkProps.children,
        key: getId(),
        onClick: generateWizardClickHandler(linkProps, currentStep),
        ...contextualMenuItemProps,
    };
};
