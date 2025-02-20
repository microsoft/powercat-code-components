// @ts-nocheck
import type { ISemanticColors } from '@fluentui/react';

export interface IM365ExtendedSemanticColors extends ISemanticColors {
    // Data Vis
    dataVis1: string;
    dataVis2: string;
    dataVis3: string;
    dataVis4: string;
    dataVis5: string;
    dataVis6: string;
    dataVis7: string;
    dataVis8: string;
    dataVis9: string;
    dataVis10: string;

    // Text
    headerText: string;
    secondaryListText: string;

    // Dashboard related colors
    dashboardBackdrop: string;
    actionCardDashboardBorder: string;
    actionCardDashboardBorderHovered: string;

    gridItemDestinationBackground: string;

    panelBackground: string;
    overlayBackground: string;

    // Nav
    navBackground: string;
    navItemBackgroundHovered: string;
    navItemBackgroundPressed: string;

    // Divider lines
    sectionDividerLine: string;
    primaryDividerLine: string;
    secondaryDividerLine: string;

    // Status
    criticalStatus: string;
    highStatus: string;
    mediumStatus: string;
    lowStatus: string;
    goodStatus: string;
    unknownStatus: string;

    insightLow: string;
    insightMedium: string;
    insightHigh: string;

    neutralRisk: string;

    // Steps
    stepCompleted: string;
    stepCurrent: string;
    stepNotStarted: string;
    stepModifierBorder: string;
    stepHover: string;
    stepPressed: string;
    stepError: string;
    allStepsComplete: string;

    /**
     * @deprecated - This slot will remain in place but will not be updated.
     */
    contextualAlertBackground: string;

    // Help + Feedback
    needHelpForeground: string;
    needHelpBackground: string;
    needHelpBackgroundPressed: string;
    feedbackForeground: string;
    feedbackBackground: string;
    feedbackBackgroundPressed: string;

    // Because the Fabric controls bank on theme.palette.white/black inverting.
    alwaysWhite: string;
    alwaysBlack: string;

    // InPageFilter
    filterPillRest: string;
    filterPillHover: string;
    filterPillPressed: string;
    filterPillEditedRest: string;
    filterPillEditedHover: string;
    filterPillEditedPressed: string;

    // Tag
    tagBackgroundInsight: string;
    tagBackgroundLowImpact: string;
    tagBackgroundMediumImpact: string;
    tagBackgroundHighImpact: string;
    tagBackgroundNew: string;
    tagBackgroundActiveWarning: string;
    tagBackgroundRecommendation: string;
    tagTextInsight: string;
    tagTextLowImpact: string;
    tagTextMediumImpact: string;
    tagTextHighImpact: string;
    tagTextNew: string;
    tagTextActiveWarning: string;
}
