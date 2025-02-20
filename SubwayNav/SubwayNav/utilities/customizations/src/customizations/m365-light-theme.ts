// @ts-nocheck
import type { ICustomizations, ITheme } from '@fluentui/react';
import { createTheme } from '@fluentui/react';

import type { IM365ExtendedSemanticColors } from './m365-extended-semantic-slots.types';
import { M365Styles } from './styles/m365-styles';

// Todo: 5138
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace M365LightColorPalette {
    export const themePrimary = '#0078D4';
    export const themeLighterAlt = '#F3F9FD';
    export const themeLighter = '#D0E7F8';
    export const themeLight = '#A9D3F2';
    export const themeTertiary = '#5CA9E5';
    export const themeSecondary = '#1A86D9'; // Required by Fabric palette, only used in ShimmerWave
    export const themeDarkAlt = '#006CBE';
    export const themeDark = '#005BA1';
    export const themeDarker = '#004377';
    export const neutralLighterAlt = '#F0F0F0';
    export const neutralLighter = '#EDEDED';
    export const neutralLight = '#E8E8E8';
    export const neutralQuaternaryAlt = '#E1E1E1';
    export const neutralQuaternary = '#D2D2D2';
    export const neutralTertiaryAlt = '#C8C8C8';
    export const neutralTertiary = '#A1A1A1';
    export const neutralSecondary = '#484644';
    export const neutralPrimaryAlt = '#8D8B8A';
    export const neutralPrimary = '#323130';
    export const neutralDark = '#605E5C';
    export const black = '#000000';
    export const white = '#FFFFFF';

    // Warnings and errors
    export const errorText = '#990000';
    export const errorBackground = '#FDE7E9';
    export const blockingBackground = '#FDE7E9';
    export const warningBackground = '#FFF4CE';
    export const warningHighlight = '#FFB900';
    export const successBackground = '#DFF6DD';

    // Extended colors

    export const severeWarningBackground = '#FEE6DD';
    export const severeWarningIcon = '#C53601';

    export const dashboardBackdrop = '#DADADA';
    export const overlayBackground = 'rgba(0,0,0,.4)';
    export const navBackground = '#E9E9E9';

    export const dataVis1 = '#0099BC';
    export const dataVis2 = '#77004D';
    export const dataVis3 = '#4F68ED';
    export const dataVis4 = '#AE8C00';
    export const dataVis5 = '#004E8C';
    export const dataVis6 = '#881798';
    export const dataVis7 = '#E43BA6';
    export const dataVis8 = '#0E7878';
    export const dataVis9 = '#8764b8';
    export const dataVis10 = '#814E29';

    export const criticalStatus = '#610000';
    export const highStatus = '#990000';
    export const mediumStatus = '#E60000';
    export const lowStatus = '#F56A00';
    export const goodStatus = '#107C10';
    export const unknownStatus = '#949494';
    export const insightLow = '#768DF1';
    export const insightMedium = '#4F6BED';
    export const insightHigh = '#3B52B4';
    export const neutralRisk = '#DADADA';

    export const needHelpBackground = '#00838C';
    export const needHelpBackgroundPressed = '#006B73';
    // @deprecated - will remain in place but may not be a valid value.
    export const contextualAlertBackground = '#5522E0';

    export const whiteTranslucent40 = 'rgba(255,255,255,.4)';

    export const tagBackgroundLowImpact = '#F3F2F1';
    export const tagBackgroundRecommendation = '#D3F4ED';
    export const tagBackgroundInsight = '#C7D3FF';
}

const p = M365LightColorPalette;

const extendedSemanticColors: Partial<IM365ExtendedSemanticColors> = {
    ////////////////////////////////
    ///   Base mapping changes
    ////////////////////////////////
    bodyTextChecked: p.neutralDark,
    disabledSubtext: p.neutralQuaternary,
    disabledBodySubtext: p.neutralTertiaryAlt,
    primaryButtonTextDisabled: p.neutralTertiary,
    bodyStandoutBackground: p.neutralLighter,
    buttonBackground: p.neutralLight,
    buttonBackgroundHovered: p.neutralTertiaryAlt,
    buttonBackgroundPressed: p.neutralTertiary,
    buttonTextHovered: p.neutralPrimary,
    buttonTextChecked: p.neutralSecondary,
    buttonTextPressed: p.neutralPrimary,
    buttonTextDisabled: p.neutralTertiary,
    menuHeader: p.neutralPrimary,
    listItemBackgroundChecked: p.neutralQuaternaryAlt,
    listItemBackgroundCheckedHovered: p.neutralQuaternary,
    link: p.themeDarkAlt,

    // Errors and warnings
    errorText: p.errorText,
    warningHighlight: p.warningHighlight,
    warningText: p.neutralPrimary,

    // Message bar colors
    messageText: p.neutralPrimary,
    messageLink: p.themeDarkAlt,
    messageLinkHovered: p.themeDarker,

    infoIcon: p.neutralSecondary,
    errorIcon: p.highStatus,
    blockingIcon: p.highStatus,
    successIcon: p.goodStatus,
    warningIcon: p.neutralPrimary,
    severeWarningIcon: p.severeWarningIcon,

    infoBackground: p.neutralLighter,
    errorBackground: p.errorBackground,
    blockingBackground: p.blockingBackground,
    warningBackground: p.warningBackground,
    severeWarningBackground: p.severeWarningBackground,
    successBackground: p.successBackground,

    ////////////////////////////////
    // Extended colors
    ////////////////////////////////

    dashboardBackdrop: p.dashboardBackdrop,
    actionCardDashboardBorder: 'transparent', // no need in light theme since we have shadows
    actionCardDashboardBorderHovered: 'transparent', // no need in light theme since we have shadows
    gridItemDestinationBackground: p.neutralQuaternary,
    panelBackground: p.white, // same as bodyBackground in this theme
    overlayBackground: p.overlayBackground,

    // Divider lines
    sectionDividerLine: p.neutralPrimary,
    primaryDividerLine: p.neutralTertiaryAlt,
    secondaryDividerLine: p.neutralQuaternaryAlt,

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
    navItemBackgroundHovered: p.neutralQuaternary,
    navItemBackgroundPressed: p.neutralTertiaryAlt,

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
    stepNotStarted: p.unknownStatus,
    stepModifierBorder: p.themePrimary,
    stepHover: p.themeDark,
    stepPressed: p.themeDarker,
    stepError: p.highStatus,
    allStepsComplete: p.goodStatus,
    /* tslint:disable-next-line:deprecation */
    contextualAlertBackground: p.contextualAlertBackground,

    // Help + Feedback
    needHelpForeground: p.white,
    needHelpBackground: p.needHelpBackground,
    needHelpBackgroundPressed: p.needHelpBackgroundPressed,
    feedbackForeground: p.white,
    feedbackBackground: p.neutralDark,
    feedbackBackgroundPressed: p.neutralSecondary,

    // Because the Fabric controls bank on theme.palette.white/black inverting.
    alwaysWhite: p.white,
    alwaysBlack: p.black,

    // InPageFilter
    filterPillRest: p.neutralLighter,
    filterPillHover: p.neutralLight,
    filterPillPressed: p.neutralQuaternaryAlt,
    filterPillEditedRest: p.themeLighter,
    filterPillEditedHover: p.themeLight,
    filterPillEditedPressed: p.themeTertiary,

    // Tag
    tagBackgroundInsight: p.tagBackgroundInsight,
    tagBackgroundLowImpact: p.tagBackgroundLowImpact,
    tagBackgroundMediumImpact: p.neutralTertiaryAlt,
    tagBackgroundHighImpact: p.neutralPrimary,
    tagBackgroundNew: p.themePrimary,
    tagBackgroundActiveWarning: p.highStatus,
    tagBackgroundRecommendation: p.tagBackgroundRecommendation,
    tagTextInsight: p.neutralPrimary,
    tagTextLowImpact: p.neutralPrimary,
    tagTextMediumImpact: p.neutralPrimary,
    tagTextHighImpact: p.white,
    tagTextNew: p.white,
    tagTextActiveWarning: p.white,
};

export const M365LightTheme: ICustomizations = {
    settings: {
        theme: createTheme({
            palette: { ...M365LightColorPalette },
            semanticColors: extendedSemanticColors,
        }),
    },
    scopedSettings: {},
};

export const M365ActualLightTheme: ITheme = createTheme({
    palette: { ...M365LightColorPalette },
    semanticColors: extendedSemanticColors,
    components: M365Styles,
});

// Re-exporting since the original is actually a customizations object.
export const M365LightCustomizations: ICustomizations = M365LightTheme;
export const M365LightCustomizationsWithStyles: ICustomizations = {
    settings: M365LightTheme.settings,
    scopedSettings: M365Styles,
};

/**
 * @deprecated This value is exported solely for test purposes.
 * Please properly instantiate a theme instead of using this value directly.
 */
export const LightExtendedSemanticColorsForTest = extendedSemanticColors;
