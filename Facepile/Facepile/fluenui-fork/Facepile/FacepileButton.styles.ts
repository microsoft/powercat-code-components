/* istanbul ignore file */
/* eslint-disable */
/* eslint-disable prettier/prettier */
import { concatStyleSets } from '@fluentui/react';
import { memoizeFunction } from '@fluentui/react';
import { getStyles as getBaseButtonStyles } from '../BaseButton.styles'
import type { ITheme } from '@fluentui/react';
import type { IButtonStyles } from '@fluentui/react';

export const getStyles = memoizeFunction(
  (theme: ITheme, className?: string, customStyles?: IButtonStyles): IButtonStyles => {
    const baseButtonStyles: IButtonStyles = getBaseButtonStyles(theme);

    const customButtonStyles = concatStyleSets(baseButtonStyles, customStyles)!;

    return {
      ...customButtonStyles,
      root: [baseButtonStyles.root, className, theme.fonts.medium, customStyles && customStyles.root],
    } as IButtonStyles;
  },
);
