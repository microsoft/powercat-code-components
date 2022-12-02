import type { IBreadcrumbStyles, IStyle } from '@fluentui/react';
import { FontWeights, keyframes } from '@fluentui/react';
import {
  detailPanelGutterWidth,
  throwOnUndefinedColor,
} from '../customizations/src';

import {
  slideOutTimingFunction,
  wizardAnimationDurationMilliSec,
} from '../utilities/index';
import type {
  IWizardStyleProps,
  IWizardStyles,
  IWizardTitleStyleProps,
} from './wizard.types';

export const wizardContentMaxWidth = 712;
export const subwayNavWidth = 351;
export const subwayNavPadding = 48;
export const wizardContentSectionTopPadding = 16;

export const subwayNavWidthStyle: IStyle = {
    width: '33%',
  maxWidth: 456,
  paddingLeft: subwayNavPadding,
  paddingRight: subwayNavPadding,
};

const loadingContentDisplay: IStyle = {
  display: 'none',
};

export const getWizardStyles = (props: IWizardStyleProps): IWizardStyles => {
  const {
    stepBackgroundIndex,
    isLastStepSubStep,
    isSubStep,
    isNarrow,
    isContentScrollBarPresent,
    isLoading,
    theme,
        props;
  const backgroundImageUrl = props.backgroundImageUrl;

    let backgroundAnimation = '';
  let backgroundStartIndex = 0;

    if (isSubStep && isLastStepSubStep) {
    if (props.clickedForward) {
      backgroundStartIndex = stepBackgroundIndex - 1;
        } else {
      backgroundStartIndex = stepBackgroundIndex + 1;
        }

        backgroundAnimation = keyframes({
      to: { backgroundPosition: `left ${stepBackgroundIndex * -100}px top` },
    });
  } else {
    if (props.clickedForward) {
      backgroundAnimation = keyframes({
        from: { backgroundPosition: 'left top 790px' },
        to: { backgroundPosition: 'left top 0px' },
      });
    } else {
      backgroundAnimation = keyframes({
        from: { backgroundPosition: 'left top -790px' },
        to: { backgroundPosition: 'left top 0px' },
      });
    }
  }

    let contentSectionRightPadding = isNarrow ? detailPanelGutterWidth : subwayNavPadding;

    if (!isNarrow && isContentScrollBarPresent) {
    contentSectionRightPadding = subwayNavPadding - 16;
    }

    return {
    wizardContentNavContainer: [
            {
        display: 'flex',
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        flexDirection: isNarrow ? 'column' : 'row',
                position: 'relative',
      },
      backgroundImageUrl && {
        backgroundImage: `url(${backgroundImageUrl})`,
                backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
                animation: `${backgroundAnimation} ${wizardAnimationDurationMilliSec}ms ${slideOutTimingFunction} forwards`,
                backgroundPosition: `left ${backgroundStartIndex * -100}px top`,
      },
    ],
    wizardProgress: {}, // deprecated, no effect anymore.
    subwayNavSection: [
      subwayNavWidthStyle,
      {
        paddingTop: '40px',
        borderRight: `1px solid ${props.theme.semanticColors.bodyDivider}`,
        overflowY: isNarrow ? 'visible' : 'auto',
            },
    ],
    contentSection: [
            {
        paddingTop: 16,
        paddingLeft: isNarrow ? detailPanelGutterWidth : subwayNavPadding,
                paddingRight: contentSectionRightPadding,
        paddingBottom: subwayNavPadding,
                display: 'flex',
        flexDirection: 'column',
        width: isNarrow ? 'unset' : '100%',
      },
      !isNarrow && {
        overflowY: 'auto',
        position: 'relative',
            },
      isNarrow && {
        overflowY: 'visible',
      },
      isLoading && {
        alignItems: 'center',
      },
    ],
    contentTitle: [
      theme.fonts.xxLarge,
      { maxWidth: wizardContentMaxWidth, fontWeight: FontWeights.bold },
      /* doing this instead of react's conditional rendering so that consuming teams
      can still perform data operations with the items during the loading state */
      isLoading && loadingContentDisplay,
        ],
    content: [
      { maxWidth: wizardContentMaxWidth },
      /* doing this instead of react's conditional rendering so that consuming teams
      can still perform data operations with the items during the loading state */
            isLoading && loadingContentDisplay,
    ],
        collapsibleContainer: {
      opacity: isLoading ? 0.5 : 1,
      position: 'sticky',
            top: 0,
      zIndex: 100000, // there seems to be an issue with textFields specifically rolling over this element.
        },
    subComponentStyles: {
      collapsible: {
        root: {
          borderTop: '0',
          backgroundColor: theme.semanticColors.bodyBackground,
                },
        titleContainer: {
          width: '100%',
        },
        headerButton: {
          paddingBottom: 12,
          borderBottom: `1px solid ${theme.semanticColors.bodyDivider}`,
                    paddingLeft: detailPanelGutterWidth,
          paddingRight: detailPanelGutterWidth,
                },
        content: {
          paddingBottom: 0,
        },
      },
      calloutContent: {
                root: {
          backgroundColor: theme.semanticColors.bodyBackground,
                },
            },
      narrowSubwayNav: {
                root: {
          padding: detailPanelGutterWidth,
                },
      },
      progressIndicator: {}, // this is now deprecated and does nothing
      loadingPane: {
                loadingDiv: {
          backgroundColor: 'transparent',
                    alignItems: 'center',
          width: `calc(100% - ${subwayNavPadding}px)`,
                },
      },
    },
  };
};

export const getWizardTitleStyles = (props: IWizardTitleStyleProps): IStyle => {
    const { componentName, theme, isNarrow } = props;

    throwOnUndefinedColor(theme.semanticColors.headerText, 'headerText', componentName);

    return [
    theme.fonts.medium,
        {
      fontWeight: FontWeights.bold,
      lineHeight: '22px',
            display: 'flex',
      alignItems: 'center',
      color: theme.semanticColors.headerText,
      paddingTop: 12,
            paddingBottom: 12,
      paddingLeft: isNarrow ? detailPanelGutterWidth : subwayNavPadding,
    },
    ];
};

export const wizardBreadcrumbStyles: Partial<IBreadcrumbStyles> = {
    item: {
    fontWeight: FontWeights.bold,
        selectors: {
      '&:last-child *': {
        fontWeight: FontWeights.bold,
            },
    },
  },
  itemLink: {
    fontWeight: FontWeights.bold,
        selectors: {
      '&:last-child *': {
        fontWeight: FontWeights.bold,
            },
        },
  },
};
