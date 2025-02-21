// @ts-nocheck
import { AnimationVariables, Announced, classNamesFunction, isIE11, Spinner, SpinnerSize } from '@fluentui/react';
import * as React from 'react';

import type { ILoadingPaneProps, ILoadingPaneStyleProps, ILoadingPaneStyles } from './loading-pane.types';
import { LoadingAnimationType, LoadingState } from './loading-pane.types';

const { useState, forwardRef } = React;

const getClassNames = classNamesFunction<ILoadingPaneStyleProps, ILoadingPaneStyles>();

// 95% code coverage as of 11/24/2020

export const LoadingPaneBase = forwardRef<HTMLDivElement, ILoadingPaneProps>((props, forwardedRef) => {
    const {
        isLoading,
        loadingAnimationType = LoadingAnimationType.FluentSpinner,
        animationAriaLabel,
        customLoadingAnimation,
        spinnerProps,
        announcedProps,
        primaryLoadingText,
        secondaryLoadingText,
        styles,
        theme,
    } = props;
    const [loadingState, setLoadingState] = useState(isLoading ? LoadingState.loading : LoadingState.notLoading);

    if (isLoading && loadingState !== LoadingState.loading) {
        setLoadingState(LoadingState.loading);
    } else if (props.isLoading === false && loadingState === LoadingState.loading) {
        setLoadingState(LoadingState.hidingLoading);

        setTimeout(() => {
            setLoadingState(LoadingState.notLoading);
        }, parseFloat(AnimationVariables.durationValue1) * 1000);
    }

    const isFluentSpinner = loadingAnimationType === LoadingAnimationType.FluentSpinner;

    const classNames = getClassNames(styles, {
        loadingState: loadingState,
        isFluentSpinner: isFluentSpinner,
        theme: theme!,
    });

    let loadingAnimation: React.ReactNode = <Spinner size={SpinnerSize.large} {...spinnerProps} />;

    if (customLoadingAnimation !== undefined) {
        loadingAnimation = customLoadingAnimation;
    }

    return (
        <>
            <Announced aria-live="assertive" {...announcedProps} />
            {(loadingState === LoadingState.loading || loadingState === LoadingState.hidingLoading) && (
                <div ref={forwardedRef} className={classNames.loadingDiv} tabIndex={-1}>
                    <div className={classNames.dataVisAnimation} aria-label={animationAriaLabel}>
                        {loadingAnimation}
                    </div>
                    {/* We always want these divs to show. Otherwise we get weird jumpyness when the text does come in */}
                    <div className={classNames.primaryLoadingTextStyles}>{primaryLoadingText}</div>
                    <div className={classNames.secondaryLoadingTextStyles}>{secondaryLoadingText}</div>
                </div>
            )}
        </>
    );
});

LoadingPaneBase.displayName = 'LoadingPane';
