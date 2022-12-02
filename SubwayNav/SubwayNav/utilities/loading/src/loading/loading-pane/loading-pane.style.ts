import { AnimationClassNames, FontWeights } from '@fluentui/react';

import type { ILoadingPaneStyleProps, ILoadingPaneStyles } from './loading-pane.types';
import { LoadingState } from './loading-pane.types';

export const textDivMinHeight = '19px';

export const loadingAnimationDimension = 125;

export const getLoadingPaneStyles = (props: ILoadingPaneStyleProps): ILoadingPaneStyles => {
    const { theme, loadingState, isFluentSpinner } = props;

    let loadingAnimation: string | undefined;

    switch (loadingState) {
        case LoadingState.notLoading:
            loadingAnimation = '';

            break;
        case LoadingState.loading:
            loadingAnimation = AnimationClassNames.fadeIn100;

            break;
        case LoadingState.hidingLoading:
            loadingAnimation = AnimationClassNames.fadeOut100;
    }

    return {
        loadingDiv: [
            {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: theme.semanticColors.bodyBackground,
                height: '100%',
                width: '100%',
                top: 0,
            },
            loadingAnimation,
        ],
        primaryLoadingTextStyles: [
            theme.fonts.medium,
            {
                marginTop: '18px',
                fontWeight: FontWeights.semibold,
                textAlign: 'center',
                minHeight: textDivMinHeight, // keeps the spinner and primary text from jumping when the text fades in
            },
        ],
        secondaryLoadingTextStyles: [
            theme.fonts.medium,
            {
                marginTop: '8px',
                textAlign: 'center',
                minHeight: textDivMinHeight, // keeps the spinner and primary text from jumping when the text fades in
            },
            AnimationClassNames.fadeIn100,
        ],
        dataVisAnimation: [
            {
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center',
            },
            !isFluentSpinner && {
                height: loadingAnimationDimension,
                width: loadingAnimationDimension,
            },
            isFluentSpinner && {
                marginTop: 62,
            },
        ],
    };
};
