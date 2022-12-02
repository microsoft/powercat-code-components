import type { IEffects, IPalette, ITheme } from '@fluentui/react';

import type { IM365ExtendedSemanticColors } from './m365-extended-semantic-slots.types';

export interface IExtendedEffects extends IEffects {
    elevation2?: string;
    elevation28?: string;
    roundedCorner8?: string;
    roundedCornerCircle?: string;
}

export interface IExtendedPalette extends IPalette {
    grey74: string;
    grey96: string;
    grey38: string;
    grey26: string;
}

export interface IM365Theme extends ITheme {
    palette: IExtendedPalette;
    effects: IExtendedEffects;
    semanticColors: IM365ExtendedSemanticColors;
}
