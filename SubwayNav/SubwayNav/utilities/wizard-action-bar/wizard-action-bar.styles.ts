import type { IStyle } from '@fluentui/react';
import { detailPanelGutterWidth } from '../customizations/src';

import { subwayNavPadding, subwayNavWidth, subwayNavWidthStyle } from '../wizard/index';
import type { IWizardActionBarStyleProps, IWizardActionBarStyles } from './index';

export const buttonMinHeight = 32;
export const buttonMargin = 16;
/**
 * This value keeps the buttons aligned to the content in the wizard.
 * Consumers could use this if they wanted to roll their own action bar
 * but still keep it aligned with the content.
 */
export const wizardContentLeftPadding = subwayNavWidth + subwayNavPadding * 2;

export const buttonAreaSpacing: IStyle = {
    paddingRight: subwayNavPadding,
    paddingLeft: subwayNavPadding,
    width: '100%',
};

export const generateButtonAreaSpacing = (isNarrow: boolean): IStyle => {
    return {
        paddingRight: isNarrow ? detailPanelGutterWidth : subwayNavPadding,
        paddingLeft: isNarrow ? detailPanelGutterWidth : subwayNavPadding,
        width: '100%',
    };
};

export const baseWABButtonSharedStyle: IStyle = {
    minWidth: 'fit-content',
    whiteSpace: 'nowrap',
    minHeight: buttonMinHeight,
    marginBottom: buttonMargin,
};
export const baseWABButtonMarginRightStyle: IStyle = {
    marginRight: buttonMargin,
};

export const getWizardActionBarStyles = (props: IWizardActionBarStyleProps): IWizardActionBarStyles => {
    const { isNarrow } = props;

    return {
        root: {
            display: 'flex',
            width: '100%',
        },
        spacer: subwayNavWidthStyle,
        buttonSection: [
            generateButtonAreaSpacing(isNarrow),
            {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                paddingTop: 17,
            },
        ],
        leftButtonsWrapper: { display: 'flex', flexWrap: isNarrow ? 'wrap' : 'nowrap' },
        rightButtonsWrapper: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: isNarrow ? 'wrap' : 'nowrap',
        },
        subComponentStyles: {
            back: (() => {
                return { root: [baseWABButtonSharedStyle, baseWABButtonMarginRightStyle] };
            })(),
            main: (() => {
                return { root: [baseWABButtonSharedStyle, baseWABButtonMarginRightStyle] };
            })(),
            saveclose: (() => {
                return { root: [baseWABButtonSharedStyle, baseWABButtonMarginRightStyle] }; // accounts for hover backplate
            })(),
            cancel: (() => {
                return { root: [baseWABButtonSharedStyle] }; // accounts for hover backplate
            })(),
        },
    };
};
