// @ts-nocheck
import type { IColor } from '@fluentui/react';
import {
    BaseSlots,
    createTheme,
    getColorFromString,
    isDark,
    ThemeGenerator,
    themeRulesStandardCreator,
} from '@fluentui/react';

import type { IDataVisColor } from './get-new-data-vis.types';

export const generateExtendedDataVisColors = (
    baseColor: string | IColor,
    backgroundColor: string | IColor,
): IDataVisColor => {
    const themeRules = themeRulesStandardCreator();

    const isBackgroundColorDark = isDark(
        (typeof backgroundColor === 'string' ? getColorFromString(backgroundColor) : backgroundColor)!,
    );

    ThemeGenerator.setSlot(
        themeRules[BaseSlots[BaseSlots.primaryColor]],
        baseColor,
        !isBackgroundColorDark,
        true,
        true,
    );

    const themeAsJson = ThemeGenerator.getThemeAsJson(themeRules);

    const { palette } = createTheme({
        ...{ palette: themeAsJson },
    });

    const {
        themeDarker,
        themeDark,
        themeDarkAlt,
        themePrimary,
        themeSecondary,
        themeTertiary,
        themeLight,
        themeLighter,
        themeLighterAlt,
    } = palette;

    return {
        themeDarker,
        themeDark,
        themeDarkAlt,
        themePrimary,
        themeSecondary,
        themeTertiary,
        themeLight,
        themeLighter,
        themeLighterAlt,
    };
};

export const generateExtendedDataVisColorsArray = (
    baseColor: string | IColor,
    backgroundColor: string | IColor,
): string[] => {
    const {
        themeDarker,
        themeDark,
        themeDarkAlt,
        themePrimary,
        themeSecondary,
        themeTertiary,
        themeLight,
        themeLighter,
        themeLighterAlt,
    } = generateExtendedDataVisColors(baseColor, backgroundColor);

    return [
        themeDarker,
        themeDark,
        themeDarkAlt,
        themePrimary,
        themeSecondary,
        themeTertiary,
        themeLight,
        themeLighter,
        themeLighterAlt,
    ];
};

export const generateExtendedDataVisColor = (
    baseColor: string | IColor,
    backgroundColor: string | IColor,
    step: number,
): string => {
    return generateExtendedDataVisColorsArray(baseColor, backgroundColor)[step];
};
