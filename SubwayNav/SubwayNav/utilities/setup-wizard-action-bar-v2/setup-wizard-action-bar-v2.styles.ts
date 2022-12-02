import { FontWeights } from '@fluentui/react';
import { detailPanelGutterWidth } from '../customizations/src/index';

import type { ISetupWizardActionBarV2StyleProps, ISetupWizardActionBarV2Styles } from './index';
import { subwayNavPadding, subwayNavWidthStyle } from '../wizard/index';
import { buttonAreaSpacing } from '../wizard-action-bar/index';

export const swabV2MinHeight = 86;
export const swabV2NarrowMinHeight = 62;
const swabV2ButtonBottomPadding = 26;

export const getSetupWizardActionBarV2Styles = (
    props: ISetupWizardActionBarV2StyleProps,
): ISetupWizardActionBarV2Styles => {
    const { theme, isNarrow } = props;
    const { semanticColors, fonts } = theme;

    const actionLinkStyle = {
        color: semanticColors.bodyText,
    };

    return {
        root: {
            display: 'flex',
            minHeight: isNarrow ? swabV2NarrowMinHeight : swabV2MinHeight,
            alignItems: 'flex-end', // bottom align
        },
        spacer: [subwayNavWidthStyle],
        buttonArea: [
            buttonAreaSpacing,
            {
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end', // bottom align
                paddingLeft: isNarrow ? detailPanelGutterWidth : subwayNavPadding,
                paddingRight: isNarrow ? detailPanelGutterWidth : subwayNavPadding,
            },
        ],
        subComponentStyles: {
            back: {
                root: [
                    fonts.medium,
                    actionLinkStyle,
                    {
                        paddingBottom: swabV2ButtonBottomPadding,
                    },
                ],
            },
            main: {
                root: [
                    isNarrow ? fonts.mediumPlus : fonts.xxLarge,
                    {
                        color: semanticColors.link,
                        fontWeight: FontWeights.bold,
                        // Accounting for the extra line height, keeps the bottom aligned
                        paddingBottom: swabV2ButtonBottomPadding - 4,
                    },
                ],
            },
            exit: {
                root: [
                    fonts.medium,
                    actionLinkStyle,
                    {
                        paddingBottom: swabV2ButtonBottomPadding,
                    },
                ],
            },
            iconButton: (() => {
                return { root: { marginBottom: 16 } };
            })(),
        },
    };
};
