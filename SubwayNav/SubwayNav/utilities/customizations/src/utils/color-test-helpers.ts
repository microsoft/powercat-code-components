/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable jest/no-export */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { IColor } from '@fluentui/react';
import { getColorFromString, getContrastRatio } from '@fluentui/react';

import type { IM365ExtendedSemanticColors } from '../customizations';
import type { IM365Theme } from '../customizations/m365-theme.types';

export const defaultAllowedVariance = 0.5;
export const minimumContrastRatio = 4.5;
export const dataVisContrastRatio = 3.0;

export interface ISemanticTestCombination {
    foregroundSemanticSlot: string;

    backgroundSemanticSlot: string;

    minimumContrastRatio?: number;

    logContrastRatio?: boolean;
}

export const testISemanticTestCombination = (combination: ISemanticTestCombination, theme: IM365Theme) => {
    const foregroundHex: string =
        theme.semanticColors[combination.foregroundSemanticSlot as keyof IM365ExtendedSemanticColors];
    const backgroundHex: string =
        theme.semanticColors[combination.backgroundSemanticSlot as keyof IM365ExtendedSemanticColors];

    test(`${combination.foregroundSemanticSlot} on ${combination.backgroundSemanticSlot}`, () => {
        expect(
            colorCombinationMeetsContrastRequirements(
                foregroundHex,
                backgroundHex,
                combination.foregroundSemanticSlot,
                combination.backgroundSemanticSlot,
                combination.minimumContrastRatio ?? 4.5,
                combination.logContrastRatio,
            ),
        ).toBe(true);
    });
};

export const colorCombinationMeetsContrastRequirements = (
    foregroundHex: string,
    backgroundHex: string,
    foregroundName: string,
    backgroundName: string,
    expectedContrastRatio: number = minimumContrastRatio,
    logContrastRatio = false,
) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const backgroundColor: IColor = getColorFromString(backgroundHex)!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const foregroundColor: IColor = getColorFromString(foregroundHex)!;
    const resultContrastRatio = getContrastRatio(backgroundColor, foregroundColor);

    if (resultContrastRatio < expectedContrastRatio) {
        logColorContrast(
            foregroundName,
            backgroundName,
            foregroundHex,
            backgroundHex,
            resultContrastRatio,
            expectedContrastRatio,
        );

        return false;
    }

    // sometime we just wanna see the ratio regardless if we fail
    if (logContrastRatio) {
        logColorContrast(
            foregroundName,
            backgroundName,
            foregroundHex,
            backgroundHex,
            resultContrastRatio,
            expectedContrastRatio,
        );
    }

    return true;
};

const logColorContrast = (
    firstName: string,
    secondName: string,
    firstHex: string,
    secondHex: string,
    ratio: number,
    expected: number,
) => {
    console.log(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${firstName.toString()} : ${secondName.toString()}\n${firstHex.toString()} : ${secondHex.toString()} :\nResult  : ${ratio}\nExpected: ${expected}`,
    );
};

export const overrideDefaultTests = (
    originalTestSuite: ISemanticTestCombination[],
    testOverrides: ISemanticTestCombination[],
) => {
    const returnTests: ISemanticTestCombination[] = originalTestSuite;

    originalTestSuite.forEach((originalTestCase, originalTestCaseIndex) => {
        testOverrides.forEach((testOverrideCase) => {
            if (
                originalTestCase.backgroundSemanticSlot === testOverrideCase.backgroundSemanticSlot &&
                originalTestCase.foregroundSemanticSlot === testOverrideCase.foregroundSemanticSlot
            ) {
                returnTests[originalTestCaseIndex].minimumContrastRatio = testOverrideCase.minimumContrastRatio;
                returnTests[originalTestCaseIndex].logContrastRatio =
                    testOverrideCase.logContrastRatio || originalTestCase.logContrastRatio;
            }
        });
    });

    return returnTests;
};

export const defaultLightTestCases: ISemanticTestCombination[] = [
    {
        foregroundSemanticSlot: 'bodyText',
        backgroundSemanticSlot: 'bodyBackground',
    },
    {
        foregroundSemanticSlot: 'bodyText',
        backgroundSemanticSlot: 'bodyStandoutBackground',
    },
    {
        foregroundSemanticSlot: 'bodyText',
        backgroundSemanticSlot: 'bodyFrameBackground',
    },
    {
        foregroundSemanticSlot: 'bodyText',
        backgroundSemanticSlot: 'defaultStateBackground',
    },
    {
        foregroundSemanticSlot: 'bodySubtext',
        backgroundSemanticSlot: 'bodyBackground',
    },
    {
        foregroundSemanticSlot: 'bodySubtext',
        backgroundSemanticSlot: 'bodyStandoutBackground',
    },
    {
        foregroundSemanticSlot: 'bodySubtext',
        backgroundSemanticSlot: 'bodyFrameBackground',
    },
    {
        foregroundSemanticSlot: 'bodySubtext',
        backgroundSemanticSlot: 'defaultStateBackground',
    },
    {
        foregroundSemanticSlot: 'headerText',
        backgroundSemanticSlot: 'bodyStandoutBackground',
    },
    {
        foregroundSemanticSlot: 'headerText',
        backgroundSemanticSlot: 'bodyFrameBackground',
    },
    {
        foregroundSemanticSlot: 'headerText',
        backgroundSemanticSlot: 'defaultStateBackground',
    },
    {
        foregroundSemanticSlot: 'bodyTextChecked',
        backgroundSemanticSlot: 'bodyBackground',
    },
    {
        foregroundSemanticSlot: 'bodyTextChecked',
        backgroundSemanticSlot: 'bodyStandoutBackground',
    },
    {
        foregroundSemanticSlot: 'bodyTextChecked',
        backgroundSemanticSlot: 'bodyFrameBackground',
    },
    {
        foregroundSemanticSlot: 'bodyTextChecked',
        backgroundSemanticSlot: 'defaultStateBackground',
    },
    {
        foregroundSemanticSlot: 'disabledBodyText',
        backgroundSemanticSlot: 'bodyBackground',
        minimumContrastRatio: 2.5,
    },
    {
        foregroundSemanticSlot: 'disabledBodyText',
        backgroundSemanticSlot: 'bodyStandoutBackground',
        minimumContrastRatio: 2.2,
    },
    {
        foregroundSemanticSlot: 'disabledBodyText',
        backgroundSemanticSlot: 'bodyFrameBackground',
        minimumContrastRatio: 2.5,
    },
    {
        foregroundSemanticSlot: 'disabledBodyText',
        backgroundSemanticSlot: 'defaultStateBackground',
        minimumContrastRatio: 2.2,
    },
    {
        foregroundSemanticSlot: 'actionLink',
        backgroundSemanticSlot: 'bodyBackground',
    },
    {
        foregroundSemanticSlot: 'actionLink',
        backgroundSemanticSlot: 'bodyStandoutBackground',
    },
    {
        foregroundSemanticSlot: 'actionLink',
        backgroundSemanticSlot: 'bodyFrameBackground',
    },
    {
        foregroundSemanticSlot: 'actionLink',
        backgroundSemanticSlot: 'defaultStateBackground',
    },
    {
        foregroundSemanticSlot: 'buttonText',
        backgroundSemanticSlot: 'buttonBackground',
    },
    {
        foregroundSemanticSlot: 'buttonText',
        backgroundSemanticSlot: 'buttonBackgroundChecked',
    },
    {
        foregroundSemanticSlot: 'buttonText',
        backgroundSemanticSlot: 'buttonBackgroundHovered',
    },
    {
        foregroundSemanticSlot: 'buttonText',
        backgroundSemanticSlot: 'buttonBackgroundCheckedHovered',
    },
    {
        foregroundSemanticSlot: 'buttonText',
        backgroundSemanticSlot: 'buttonBackgroundPressed',
    },
    {
        foregroundSemanticSlot: 'buttonText',
        backgroundSemanticSlot: 'buttonBackgroundDisabled',
    },
    {
        foregroundSemanticSlot: 'buttonTextChecked',
        backgroundSemanticSlot: 'buttonBackground',
    },
    {
        foregroundSemanticSlot: 'buttonTextChecked',
        backgroundSemanticSlot: 'buttonBackgroundChecked',
    },
    {
        foregroundSemanticSlot: 'buttonTextChecked',
        backgroundSemanticSlot: 'buttonBackgroundHovered',
    },
    {
        foregroundSemanticSlot: 'buttonTextChecked',
        backgroundSemanticSlot: 'buttonBackgroundCheckedHovered',
    },
    {
        foregroundSemanticSlot: 'buttonTextChecked',
        backgroundSemanticSlot: 'buttonBackgroundPressed',
        minimumContrastRatio: 3.6,
    },
    {
        foregroundSemanticSlot: 'buttonTextChecked',
        backgroundSemanticSlot: 'buttonBackgroundDisabled',
    },
    {
        foregroundSemanticSlot: 'primaryButtonText',
        backgroundSemanticSlot: 'primaryButtonBackground',
    },
    {
        foregroundSemanticSlot: 'accentButtonText',
        backgroundSemanticSlot: 'accentButtonBackground',
    },
    {
        foregroundSemanticSlot: 'inputText',
        backgroundSemanticSlot: 'inputBackground',
    },
    {
        foregroundSemanticSlot: 'inputTextHovered',
        backgroundSemanticSlot: 'inputBackground',
    },
    {
        foregroundSemanticSlot: 'inputPlaceholderText',
        backgroundSemanticSlot: 'inputBackground',
    },
    {
        foregroundSemanticSlot: 'inputForegroundChecked',
        backgroundSemanticSlot: 'inputBackgroundChecked',
    },
    {
        foregroundSemanticSlot: 'listText',
        backgroundSemanticSlot: 'listBackground',
    },
    {
        foregroundSemanticSlot: 'buttonTextChecked',
        backgroundSemanticSlot: 'listItemBackgroundHovered',
    },
    {
        foregroundSemanticSlot: 'buttonTextChecked',
        backgroundSemanticSlot: 'listItemBackgroundChecked',
    },
    {
        foregroundSemanticSlot: 'buttonTextChecked',
        backgroundSemanticSlot: 'listItemBackgroundCheckedHovered',
    },
    {
        foregroundSemanticSlot: 'buttonTextChecked',
        backgroundSemanticSlot: 'listHeaderBackgroundHovered',
    },
    {
        foregroundSemanticSlot: 'buttonTextChecked',
        backgroundSemanticSlot: 'listHeaderBackgroundPressed',
    },
    {
        foregroundSemanticSlot: 'secondaryListText',
        backgroundSemanticSlot: 'listBackground',
    },
    {
        foregroundSemanticSlot: 'menuItemText',
        backgroundSemanticSlot: 'menuBackground',
    },
    {
        foregroundSemanticSlot: 'menuItemText',
        backgroundSemanticSlot: 'menuItemBackgroundHovered',
    },
    {
        foregroundSemanticSlot: 'menuItemTextHovered',
        backgroundSemanticSlot: 'menuItemBackgroundHovered',
    },
    {
        foregroundSemanticSlot: 'menuItemTextHovered',
        backgroundSemanticSlot: 'menuItemBackgroundPressed',
    },
    {
        foregroundSemanticSlot: 'menuIcon',
        backgroundSemanticSlot: 'menuBackground',
    },
    {
        foregroundSemanticSlot: 'menuHeader',
        backgroundSemanticSlot: 'menuBackground',
    },
    {
        foregroundSemanticSlot: 'stepCompleted',
        backgroundSemanticSlot: 'bodyBackground',
    },
    {
        foregroundSemanticSlot: 'stepCurrent',
        backgroundSemanticSlot: 'bodyBackground',
    },
    {
        foregroundSemanticSlot: 'stepNotStarted',
        backgroundSemanticSlot: 'bodyBackground',
        minimumContrastRatio: 3.0,
    },
    {
        foregroundSemanticSlot: 'stepModifierBorder',
        backgroundSemanticSlot: 'bodyBackground',
    },
    {
        foregroundSemanticSlot: 'stepHover',
        backgroundSemanticSlot: 'bodyBackground',
    },
    {
        foregroundSemanticSlot: 'stepPressed',
        backgroundSemanticSlot: 'bodyBackground',
    },
    {
        foregroundSemanticSlot: 'allStepsComplete',
        backgroundSemanticSlot: 'bodyBackground',
    },
    {
        foregroundSemanticSlot: 'needHelpForeground',
        backgroundSemanticSlot: 'needHelpBackground',
    },
    {
        foregroundSemanticSlot: 'feedbackForeground',
        backgroundSemanticSlot: 'feedbackBackground',
    },
    {
        foregroundSemanticSlot: 'feedbackForeground',
        backgroundSemanticSlot: 'feedbackBackgroundPressed',
    },
    {
        foregroundSemanticSlot: 'tagBackgroundLowImpact',
        backgroundSemanticSlot: 'tagTextLowImpact',
    },
    {
        foregroundSemanticSlot: 'tagBackgroundMediumImpact',
        backgroundSemanticSlot: 'tagTextMediumImpact',
    },
    {
        foregroundSemanticSlot: 'tagBackgroundHighImpact',
        backgroundSemanticSlot: 'tagTextHighImpact',
    },
    {
        foregroundSemanticSlot: 'tagBackgroundNew',
        backgroundSemanticSlot: 'tagTextNew',
    },
    {
        foregroundSemanticSlot: 'tagBackgroundActiveWarning',
        backgroundSemanticSlot: 'tagTextActiveWarning',
    },
    {
        foregroundSemanticSlot: 'tagBackgroundRecommendation',
        backgroundSemanticSlot: 'bodyText',
    },
    {
        foregroundSemanticSlot: 'tagBackgroundInsight',
        backgroundSemanticSlot: 'tagTextInsight',
    },
    {
        foregroundSemanticSlot: 'insightLow',
        backgroundSemanticSlot: 'bodyBackground',
        minimumContrastRatio: 3,
    },
    {
        foregroundSemanticSlot: 'insightMedium',
        backgroundSemanticSlot: 'bodyBackground',
    },
    {
        foregroundSemanticSlot: 'insightHigh',
        backgroundSemanticSlot: 'bodyBackground',
    },
    {
        foregroundSemanticSlot: 'neutralRisk',
        backgroundSemanticSlot: 'bodyBackground',
        minimumContrastRatio: 1.3,
    },
];

export const defaultDarkTestCases = overrideDefaultTests(defaultLightTestCases, [
    {
        foregroundSemanticSlot: 'buttonText',
        backgroundSemanticSlot: 'buttonBackgroundPressed',
        minimumContrastRatio: 3.7,
    },
    {
        foregroundSemanticSlot: 'stepCompleted',
        backgroundSemanticSlot: 'bodyBackground',
        minimumContrastRatio: 4.0,
    },
    {
        foregroundSemanticSlot: 'stepCurrent',
        backgroundSemanticSlot: 'bodyBackground',
        minimumContrastRatio: 4.0,
    },
    {
        foregroundSemanticSlot: 'stepNotStarted',
        backgroundSemanticSlot: 'bodyBackground',
        minimumContrastRatio: 2.0,
    },
    {
        foregroundSemanticSlot: 'stepModifierBorder',
        backgroundSemanticSlot: 'bodyBackground',
        minimumContrastRatio: 4.0,
    },
    {
        foregroundSemanticSlot: 'feedbackForeground',
        backgroundSemanticSlot: 'feedbackBackgroundPressed',
        minimumContrastRatio: 4.3,
    },
]);
