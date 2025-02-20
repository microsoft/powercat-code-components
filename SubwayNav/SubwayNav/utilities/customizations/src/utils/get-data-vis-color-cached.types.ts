// @ts-nocheck
import type { IM365ExtendedSemanticColors } from '../customizations/m365-extended-semantic-slots.types';
import type { IM365Theme } from '../customizations/m365-theme.types';

export type GetDataVisColorCachedFunction = <T extends keyof IM365ExtendedSemanticColors>(
    theme: IM365Theme,
    key: string,
    itemKey: string,
    themeChangeKey?: T,
) => string;
