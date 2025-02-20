// @ts-nocheck
import type { ICustomizations } from '@fluentui/react';
import { createTheme } from '@fluentui/react';

import type { IM365ExtendedSemanticColors } from './m365-extended-semantic-slots.types';
import { M365Styles } from './styles/m365-styles';

// Todo: 5138
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace M365DarkColorPalette {
    export const themePrimary = '#0078D4';
    export const themeLighterAlt = '#0C2031';
    export const themeLighter = '#092C47';
    export const themeLight = '#043862';
    export const themeTertiary = '#004C87';
    export const themeSecondary = '#1A86D9'; // Required by Fabric palette, only used in ShimmerWave
    export const themeDarkAlt = '#1890F1';
    export const themeDark = '#3AA0F3';
    export const themeDarker = '#6CB8F6';
    export const neutralLighterAlt = '#202020';
    export const neutralLighter = '#252525';
    export const neutralLight = '#292929';
    export const neutralQuaternaryAlt = '#323232';
    export const neutralQuaternary = '#3B3B3B';
    export const neutralTertiaryAlt = '#484848';
    export const neutralTertiary = '#797979';
    export const neutralSecondary = '#B3B3B3';
    export const neutralPrimaryAlt = '#E1E1E1';
    export const neutralPrimary = '#EDEDED';
    export const neutralDark = '#F3F3F3';
    export const black = '#FFFFFF'; // Note white and black are inverted in this theme
    export const white = '#141414';

    // Warnings and Errors
    export const errorText = '#FF3C00';
    export const errorBackground = '#3B1E1E';
    export const blockingBackground = '#3B1E1E';
    export const warningBackground = '#30250A';
    export const warningHighlight = '#FFB900';
    export const successBackground = '#24290F';

    // Extended colors
    export const severeWarningBackground = '#3B200C'; // Actually an extension color

    export const dashboardBackdrop = '#303030';
    export const panelBackground = '#212121';
    export const overlayBackground = 'rgba(0,0,0,.4)';
    export const navBackground = '#212121';

    export const dataVis1 = '#31B0CD';
    export const dataVis2 = '#AE4689';
    export const dataVis3 = '#768DF1';
    export const dataVis4 = '#C9A618';
    export const dataVis5 = '#286EA8';
    export const dataVis6 = '#A43FB1';
    export const dataVis7 = '#EF8CCB';
    export const dataVis8 = '#218B8B';
    export const dataVis9 = '#A083C9';
    export const dataVis10 = '#9C663F';

    export const criticalStatus = '#FF0505';
    export const highStatus = '#FF3C00';
    export const mediumStatus = '#FFAA00';
    export const lowStatus = '#F2F200';
    export const insightLow = '#4661D5';
    export const insightMedium = '#627CEF';
    export const insightHigh = '#99AAF5';
    export const neutralRisk = '#303030';

    export const goodStatus = '#009E00';
    export const unknownStatus = '#6B6B6B';

    export const needHelpBackground = '#00838C';
    export const needHelpBackgroundPressed = '#009BA6';
    // @deprecated - will remain in place but may not be a valid value.
    export const contextualAlertBackground = '#C0A9FF';

    export const whiteTranslucent40 = 'rgba(20,20,20,.4)';

    export const tagBackgroundLowImpact = '#323130';
    export const tagBackgroundMediumImpact = '#484644';
    export const tagBackgroundActiveWarning = '#E60000';
    export const tagBackgroundRecommendation = '#0C614C';
    export const tagBackgroundInsight = '#3B30BC';
}

const p = M365DarkColorPalette;

const extendedSemanticColors: Partial<IM365ExtendedSemanticColors> = {
    ////////////////////////////////
    ///   Base mapping changes
    ////////////////////////////////

    bodyStandoutBackground: p.neutralQuaternaryAlt,
    bodyTextChecked: p.neutralDark,
    primaryButtonText: p.black,
    primaryButtonTextHovered: p.black,
    primaryButtonTextPressed: p.black,
    primaryButtonTextDisabled: p.neutralTertiaryAlt,
    primaryButtonBackgroundDisabled: p.neutralLighter,
    accentButtonText: p.black,
    buttonBackground: p.neutralQuaternaryAlt,
    buttonBackgroundChecked: p.neutralLighter,
    buttonBackgroundHovered: p.neutralTertiaryAlt,
    buttonBackgroundCheckedHovered: p.neutralTertiaryAlt,
    buttonBackgroundPressed: p.neutralTertiary,
    buttonTextHovered: p.neutralPrimary,
    buttonTextDisabled: p.neutralTertiaryAlt,
    inputForegroundChecked: p.black,
    menuHeader: p.neutralPrimary,
    menuIcon: p.themeDarkAlt,
    listItemBackgroundChecked: p.neutralQuaternaryAlt,
    listItemBackgroundCheckedHovered: p.neutralQuaternary,
    link: p.themeDarkAlt,

    // Message bar colors
    messageText: p.neutralPrimary,
    messageLink: p.themeDarkAlt,
    messageLinkHovered: p.themeDarker,

    infoIcon: p.neutralSecondary,
    errorIcon: p.highStatus,
    blockingIcon: p.highStatus,
    successIcon: p.goodStatus,
    warningIcon: p.neutralPrimary,
    severeWarningIcon: p.mediumStatus,

    infoBackground: p.neutralLighter,
    errorBackground: p.errorBackground,
    blockingBackground: p.blockingBackground,
    warningBackground: p.warningBackground,
    severeWarningBackground: p.severeWarningBackground,
    successBackground: p.successBackground,

    // Error and warnings
    errorText: p.errorText,
    warningHighlight: p.warningHighlight,
    warningText: p.neutralPrimary,

    ////////////////////////////////
    // Extended colors
    ////////////////////////////////

    dashboardBackdrop: p.dashboardBackdrop,
    actionCardDashboardBorder: p.neutralPrimary,
    actionCardDashboardBorderHovered: p.neutralSecondary,
    gridItemDestinationBackground: p.neutralLighter,
    panelBackground: p.panelBackground,
    overlayBackground: p.overlayBackground,

    // Divider lines
    sectionDividerLine: p.neutralPrimary,
    primaryDividerLine: p.neutralTertiary,
    secondaryDividerLine: p.neutralTertiaryAlt,

    // Data vis
    dataVis1: p.dataVis1,
    dataVis2: p.dataVis2,
    dataVis3: p.dataVis3,
    dataVis4: p.dataVis4,
    dataVis5: p.dataVis5,
    dataVis6: p.dataVis6,
    dataVis7: p.dataVis7,
    dataVis8: p.dataVis8,
    dataVis9: p.dataVis9,
    dataVis10: p.dataVis10,

    // Text
    headerText: p.black,
    secondaryListText: p.neutralSecondary,

    // Nav
    navBackground: p.navBackground,
    navItemBackgroundHovered: p.neutralTertiaryAlt,
    navItemBackgroundPressed: p.neutralTertiary,

    // Status
    criticalStatus: p.criticalStatus,
    highStatus: p.highStatus,
    mediumStatus: p.mediumStatus,
    lowStatus: p.lowStatus,
    goodStatus: p.goodStatus,
    unknownStatus: p.unknownStatus,
    insightLow: p.insightLow,
    insightMedium: p.insightMedium,
    insightHigh: p.insightHigh,

    neutralRisk: p.neutralRisk,

    // Steps
    stepCompleted: p.themePrimary,
    stepCurrent: p.themePrimary,
    stepNotStarted: p.neutralTertiaryAlt,
    stepModifierBorder: p.themePrimary,
    stepHover: p.themeDark,
    stepPressed: p.themeDarker,
    stepError: p.highStatus,
    allStepsComplete: p.goodStatus,

    /* tslint:disable-next-line:deprecation */
    contextualAlertBackground: p.contextualAlertBackground,

    // Help + Feedback
    needHelpForeground: p.black,
    needHelpBackground: p.needHelpBackground,
    needHelpBackgroundPressed: p.needHelpBackgroundPressed,
    feedbackForeground: p.black,
    feedbackBackground: p.neutralTertiaryAlt,
    feedbackBackgroundPressed: p.neutralTertiary,

    // Because the Fabric controls bank on theme.palette.white/black inverting.
    alwaysWhite: p.black,
    alwaysBlack: p.white,

    // InPageFilter
    filterPillRest: p.neutralQuaternaryAlt,
    filterPillHover: p.neutralLight,
    filterPillPressed: p.neutralLighterAlt,
    filterPillEditedRest: p.themeDarkAlt,
    filterPillEditedHover: p.themeDark,
    filterPillEditedPressed: p.themeDarker,

    // Tag
    tagBackgroundInsight: p.tagBackgroundInsight,
    tagBackgroundLowImpact: p.tagBackgroundLowImpact,
    tagBackgroundMediumImpact: p.tagBackgroundMediumImpact,
    tagBackgroundHighImpact: p.neutralPrimary,
    tagBackgroundNew: p.themePrimary,
    tagBackgroundActiveWarning: p.tagBackgroundActiveWarning,
    tagBackgroundRecommendation: p.tagBackgroundRecommendation,
    tagTextInsight: p.neutralPrimary,
    tagTextLowImpact: p.neutralPrimary,
    tagTextMediumImpact: p.neutralPrimary,
    tagTextHighImpact: p.white,
    tagTextNew: p.black,
    tagTextActiveWarning: p.black,
};

// Todo: 5138
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace M365DarkThemeDepths {
    export const depth0 = '0 0 0 0 transparent';
    export const depth4 = '0 1.6px 3.6px 0 rgba(0, 0, 0, 0.66), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.54)';
    export const depth8 = '0 6.4px 14.4px 0 rgba(0, 0, 0, 0.66), 0 1.2px 3.6px 0 rgba(0, 0, 0, 0.54)';
    export const depth16 = '0 12.8px 28.8px 0 rgba(0, 0, 0, 0.66), 0 2.4px 7.2px 0 rgba(0, 0, 0, 0.54)';
    export const depth64 = '0 25.6px 40px 0 rgba(0, 0, 0, 0.66), 0 4.8px 14.4px 0 rgba(0, 0, 0, 0.54)';
}

export const M365DarkTheme: ICustomizations = {
    settings: {
        theme: createTheme({
            palette: { ...M365DarkColorPalette },
            effects: {
                elevation4: M365DarkThemeDepths.depth4,
                elevation8: M365DarkThemeDepths.depth8,
                elevation16: M365DarkThemeDepths.depth16,
                elevation64: M365DarkThemeDepths.depth64,
            },
            semanticColors: extendedSemanticColors,
        }),
    },
    scopedSettings: {},
};

export const M365ActualDarkTheme = createTheme({
    palette: { ...M365DarkColorPalette },
    effects: {
        elevation4: M365DarkThemeDepths.depth4,
        elevation8: M365DarkThemeDepths.depth8,
        elevation16: M365DarkThemeDepths.depth16,
        elevation64: M365DarkThemeDepths.depth64,
    },
    semanticColors: extendedSemanticColors,
    components: M365Styles,
});

// Re-exporting since the original is actually a customizations object.
export const M365DarkCustomizations: ICustomizations = M365DarkTheme;
export const M365DarkCustomizationsWithStyles: ICustomizations = {
    settings: M365DarkTheme.settings,
    scopedSettings: M365Styles,
};

/**
 * @deprecated This value is exported solely for test purposes.
 * Please properly instantiate a theme instead of using this value directly.
 */
export const DarkExtendedSemanticColorsForTest = extendedSemanticColors;
