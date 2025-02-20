// @ts-nocheck
/* eslint-disable @typescript-eslint/no-namespace */
import type { ICustomizations, ITheme } from '@fluentui/react';
import { createTheme } from '@fluentui/react';
import type { IM365ExtendedSemanticColors } from '../customizations/src';
import { M365Styles } from '../customizations/src';

import { M365PPACStyles } from '../ppacStyles/m365-ppac-styles';

export namespace PPACDarkColorPalette {
    export const themePrimary = '#ff8cff';
    export const themeLighterAlt = '#09030a';
    export const themeLighter = '#230d29';
    export const themeLight = '#42184d';
    export const themeTertiary = '#842f99';
    export const themeSecondary = '#c146e0';
    export const themeDarkAlt = '#f56aff';
    export const themeDark = '#e479ff';
    export const themeDarker = '#eb9cff';
    export const neutralLighterAlt = '#323232';
    export const neutralLighter = '#3a3a3a';
    export const neutralLight = '#484848';
    export const neutralQuaternaryAlt = '#505050';
    export const neutralQuaternary = '#575757';
    export const neutralTertiaryAlt = '#706f75';
    export const neutralTertiary = '#989593';
    export const neutralSecondary = '#fbfbfb';
    export const neutralPrimaryAlt = '#fcfcfc';
    export const neutralPrimary = '#f8f8f8';
    export const neutralDark = '#fdfdfd';
    export const black = '#fefefe';
    export const white = '#292929';

    // Warnings and Errors
    export const errorText = '#FF531F';
    export const errorBackground = '#3B1E1E';
    export const blockingBackground = '#3B1E1E';
    export const warningBackground = '#30250A';
    export const warningHighlight = '#FFB900';
    export const successBackground = '#24290F';

    // Extended colors
    export const severeWarningBackground = '#3B200C'; // Actually an extension color

    export const dashboardBackdrop = '#303030';
    export const panelBackground = '#292929';
    export const overlayBackground = 'rgba(0,0,0,.4)';
    export const navBackground = '#292929';

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

const p = PPACDarkColorPalette;
const primaryButtonBackgroundOverride = '#8D0292';

const extendedSemanticColors: Partial<IM365ExtendedSemanticColors> = {
    ////////////////////////////////
    ///   Base mapping changes
    ////////////////////////////////
    bodyStandoutBackground: p.neutralQuaternaryAlt,
    bodyTextChecked: p.neutralDark,
    primaryButtonBackground: primaryButtonBackgroundOverride,
    primaryButtonText: p.black,
    primaryButtonTextHovered: p.black,
    primaryButtonTextPressed: p.black,
    primaryButtonTextDisabled: '#4F4F4F',
    primaryButtonBackgroundDisabled: '#444444',
    accentButtonText: p.black,
    accentButtonBackground: primaryButtonBackgroundOverride,
    inputForegroundChecked: p.black,
    menuHeader: p.neutralPrimary,
    menuIcon: p.themeDarkAlt,
    listItemBackgroundChecked: p.neutralQuaternaryAlt,
    listItemBackgroundCheckedHovered: p.neutralQuaternary,
    link: p.themeDarkAlt,
    inputBackgroundChecked: primaryButtonBackgroundOverride,

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
    filterPillPressed: p.neutralLighter,
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

export namespace PPACDarkThemeDepths {
    export const depth0 = '0 0 0 0 transparent';
    export const depth4 = '0 1.6px 3.6px 0 rgba(0, 0, 0, 0.66), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.54)';
    export const depth8 = '0 6.4px 14.4px 0 rgba(0, 0, 0, 0.66), 0 1.2px 3.6px 0 rgba(0, 0, 0, 0.54)';
    export const depth16 = '0 12.8px 28.8px 0 rgba(0, 0, 0, 0.66), 0 2.4px 7.2px 0 rgba(0, 0, 0, 0.54)';
    export const depth64 = '0 25.6px 40px 0 rgba(0, 0, 0, 0.66), 0 4.8px 14.4px 0 rgba(0, 0, 0, 0.54)';
}

export const PPACDarkTheme: Partial<ICustomizations> = {
    settings: {
        theme: createTheme({
            palette: { ...PPACDarkColorPalette },
            effects: {
                elevation4: PPACDarkThemeDepths.depth4,
                elevation8: PPACDarkThemeDepths.depth8,
                elevation16: PPACDarkThemeDepths.depth16,
                elevation64: PPACDarkThemeDepths.depth64,
            },
            semanticColors: extendedSemanticColors,
        }),
    },
};

export const PPACActualDarkTheme: ITheme = createTheme({
    palette: { ...PPACDarkColorPalette },
    semanticColors: extendedSemanticColors,
});

// Re-exporting since the original is actually a customizations object.
export const PPACDarkCustomizations: Partial<ICustomizations> = PPACDarkTheme;
export const PPACDarkCustomizationsWithStyles: Partial<ICustomizations> = {
    settings: PPACDarkTheme.settings,
    scopedSettings: { ...M365Styles, ...M365PPACStyles },
};
