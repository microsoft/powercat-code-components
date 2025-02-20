// @ts-nocheck
import type { IRawStyle } from '@fluentui/react';
import { keyframes } from '@fluentui/react';

// For testing purpose.  To be removed
const testTiming = 0;

const slideInTimingFunction = 'cubic-bezier(.33,0,0,1)';
const fadeInTimingFunction = 'cubic-bezier(.33,0,.14,1)';

export const slideOutTimingFunction = 'cubic-bezier(.41,0,.67,1)';
const fadeOutTimingFunction = 'cubic-bezier(.01,0,.14,1)';

function _createAnimation(
    fadeNam: string,
    fadeTime: string,
    fadeFunc: string,
    fadeDelay: string,
    slideNam: string,
    slideTime: string,
    slideFunc: string,
    slideDelay: string,
): IRawStyle {
    const retAnim = {
        animation: `${fadeNam} ${fadeTime} ${fadeFunc} ${fadeDelay} forwards, ${slideNam} ${slideTime} ${slideFunc} ${slideDelay} forwards`,
    };

    return retAnim;
}

function _createSimpleAnimationString(
    slideNam: string,
    slideTime: string,
    slideFunc: string,
    slideDelay: string,
): string {
    return `${slideNam} ${slideTime} ${slideFunc} ${slideDelay} forwards`;
}

function _createSimpleAnimation(slideNam: string, slideTime: string, slideFunc: string, slideDelay: string): IRawStyle {
    const retAnim = {
        animation: `${slideNam} ${slideTime} ${slideFunc} ${slideDelay} forwards`,
    };

    return retAnim;
}

const SLIDE_UP_IN: string = _createSlideInY(790);
const SLIDE_UP_OUT: string = _createSlideOutY(-480);

const SLIDE_DOWN_IN: string = _createSlideInY(-480);
const SLIDE_DOWN_OUT: string = _createSlideOutY(790);

const SLIDE_LEFT_IN: string = _createSlideInX(500);
const SLIDE_LEFT_OUT: string = _createSlideOutX(-300);

const SLIDE_RIGHT_IN: string = _createSlideInX(-300);
const SLIDE_RIGHT_OUT: string = _createSlideOutX(500);

const SLIDE_LEFT_IN_100: string = _createSlideInX(100);
const SLIDE_RIGHT_IN_100: string = _createSlideInX(-100);

function _createSlideInY(fromY: number): string {
    return keyframes({
        from: { transform: `translateY(${fromY}px)` },
        to: { transform: 'translateY(0px)' },
    });
}

function _createSlideOutY(toY: number): string {
    return keyframes({
        to: { transform: `translateY(${toY}px)` },
    });
}

function _createSlideInX(fromX: number): string {
    return keyframes({
        from: { transform: `translateX(${fromX}px)` },
        to: { transform: 'translateX(0px)' },
    });
}

function _createSlideOutX(toX: number): string {
    return keyframes({
        to: { transform: `translateX(${toX}px)` },
    });
}

const FADE_IN: string = keyframes({
    to: { opacity: 1 },
});

const FADE_OUT: string = keyframes({
    to: { opacity: 0 },
});

export const wizardAnimationDurationMilliSec = 667 + testTiming * 1000;

const titleInAnimDuration = (0.667 + testTiming).toString() + 's';
const titleDescInAnimDuration = (0.617 + testTiming).toString() + 's';
const contentInAnimDuration = (0.567 + testTiming).toString() + 's';

const titleInAnimDelay = '0s';
const titleDescInAnimDelay = '0.05s';
const contentInAnimDelay = '0.1s';

const titleFadeInAnimDelay = '.250s';
const titleDescFadeInAnimDelay = '0.200s';
const contentFadeInAnimDelay = '0.150s';

const titleOutAnimDuration = (0.567 + testTiming).toString() + 's';
const titleDescOutAnimDuration = (0.617 + testTiming).toString() + 's';
const contentOutAnimDuration = (0.667 + testTiming).toString() + 's';
const backgroundAnimDuration = (0.667 + testTiming).toString() + 's';

const fadeAnimDuration = (0.417 + testTiming).toString() + 's';
const animationOutDelay = '0s';

/* Animation for Background */
export const backgroundSlideUpOutAnimation = _createSimpleAnimation(
    `${SLIDE_UP_OUT}`,
    backgroundAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const backgroundSlideUpInAnimation = _createSimpleAnimation(
    `${SLIDE_UP_IN}`,
    backgroundAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const backgroundSlideDownOutAnimation = _createSimpleAnimation(
    `${SLIDE_DOWN_OUT}`,
    backgroundAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const backgroundSlideDownInAnimation = _createSimpleAnimation(
    `${SLIDE_DOWN_IN}`,
    backgroundAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const backgroundSlideLeftAnimation = _createSimpleAnimationString(
    `${SLIDE_LEFT_IN_100}`,
    backgroundAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const backgroundSlideRightAnimation = _createSimpleAnimationString(
    `${SLIDE_RIGHT_IN_100}`,
    backgroundAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const backgroundSlideUpInAnimationStr = _createSimpleAnimationString(
    `${SLIDE_UP_IN}`,
    backgroundAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const backgroundSlideDownInAnimationStr = _createSimpleAnimationString(
    `${SLIDE_DOWN_IN}`,
    backgroundAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const backgroundSlideLeftAnimationStr = _createSimpleAnimationString(
    `${SLIDE_LEFT_IN_100}`,
    backgroundAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const backgroundSlideRightAnimationStr = _createSimpleAnimationString(
    `${SLIDE_RIGHT_IN_100}`,
    backgroundAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

/* Animation for Title */
export const titleSlideUpOutAnimation = _createAnimation(
    `${FADE_OUT}`,
    fadeAnimDuration,
    fadeOutTimingFunction,
    animationOutDelay,
    `${SLIDE_UP_OUT}`,
    titleOutAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const titleSlideUpInAnimation = _createAnimation(
    `${FADE_IN}`,
    fadeAnimDuration,
    fadeInTimingFunction,
    titleFadeInAnimDelay,
    `${SLIDE_UP_IN}`,
    titleInAnimDuration,
    slideInTimingFunction,
    titleInAnimDelay,
);

export const titleSlideDownOutAnimation = _createAnimation(
    `${FADE_OUT}`,
    fadeAnimDuration,
    fadeOutTimingFunction,
    animationOutDelay,
    `${SLIDE_DOWN_OUT}`,
    titleOutAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const titleSlideDownInAnimation = _createAnimation(
    `${FADE_IN}`,
    fadeAnimDuration,
    fadeInTimingFunction,
    titleFadeInAnimDelay,
    `${SLIDE_DOWN_IN}`,
    titleInAnimDuration,
    slideInTimingFunction,
    titleInAnimDelay,
);

/* Animation for Title description */
export const titleDescSlideUpOutAnimation = _createAnimation(
    `${FADE_OUT}`,
    fadeAnimDuration,
    fadeOutTimingFunction,
    animationOutDelay,
    `${SLIDE_UP_OUT}`,
    titleDescOutAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const titleDescSlideUpInAnimation = _createAnimation(
    `${FADE_IN}`,
    fadeAnimDuration,
    fadeInTimingFunction,
    titleDescFadeInAnimDelay,
    `${SLIDE_UP_IN}`,
    titleDescInAnimDuration,
    slideInTimingFunction,
    titleDescInAnimDelay,
);

export const titleDescSlideDownOutAnimation = _createAnimation(
    `${FADE_OUT}`,
    fadeAnimDuration,
    fadeOutTimingFunction,
    animationOutDelay,
    `${SLIDE_DOWN_OUT}`,
    titleDescOutAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const titleDescSlideDownInAnimation = _createAnimation(
    `${FADE_IN}`,
    fadeAnimDuration,
    fadeInTimingFunction,
    titleDescFadeInAnimDelay,
    `${SLIDE_DOWN_IN}`,
    titleDescInAnimDuration,
    slideInTimingFunction,
    titleDescInAnimDelay,
);

/* Animation for Content */
export const contentSlideUpOutAnimation = _createAnimation(
    `${FADE_OUT}`,
    fadeAnimDuration,
    fadeOutTimingFunction,
    animationOutDelay,
    SLIDE_UP_OUT,
    contentOutAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const contentSlideUpInAnimation = _createAnimation(
    `${FADE_IN}`,
    fadeAnimDuration,
    fadeInTimingFunction,
    contentFadeInAnimDelay,
    `${SLIDE_UP_IN}`,
    contentInAnimDuration,
    slideInTimingFunction,
    contentInAnimDelay,
);

export const contentSlideDownOutAnimation = _createAnimation(
    `${FADE_OUT}`,
    fadeAnimDuration,
    fadeOutTimingFunction,
    animationOutDelay,
    `${SLIDE_DOWN_OUT}`,
    contentOutAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const contentSlideDownInAnimation = _createAnimation(
    `${FADE_IN}`,
    fadeAnimDuration,
    fadeInTimingFunction,
    contentFadeInAnimDelay,
    `${SLIDE_DOWN_IN}`,
    contentInAnimDuration,
    slideInTimingFunction,
    contentInAnimDelay,
);

/* Left / Right Animations */

export const substepAnimationInDurationMilliSec = 580 + testTiming * 1000;

const substepContentInAnimDuration = (0.53 + testTiming).toString() + 's';
const substepContentInAnimDelay = '0.05s';
const substepContentFadeInAnimDelay = '0.250s';
const substepContentOutAnimDuration = (0.5 + testTiming).toString() + 's';

export const contentSlideLeftOutAnimation = _createAnimation(
    `${FADE_OUT}`,
    fadeAnimDuration,
    fadeOutTimingFunction,
    animationOutDelay,
    SLIDE_LEFT_OUT,
    substepContentOutAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const contentSlideLeftInAnimation = _createAnimation(
    `${FADE_IN}`,
    fadeAnimDuration,
    fadeInTimingFunction,
    substepContentFadeInAnimDelay,
    `${SLIDE_LEFT_IN}`,
    substepContentInAnimDuration,
    slideInTimingFunction,
    substepContentInAnimDelay,
);

export const contentSlideRightOutAnimation = _createAnimation(
    `${FADE_OUT}`,
    fadeAnimDuration,
    fadeOutTimingFunction,
    animationOutDelay,
    `${SLIDE_RIGHT_OUT}`,
    substepContentOutAnimDuration,
    slideOutTimingFunction,
    animationOutDelay,
);

export const contentSlideRightInAnimation = _createAnimation(
    `${FADE_IN}`,
    fadeAnimDuration,
    fadeInTimingFunction,
    substepContentFadeInAnimDelay,
    `${SLIDE_RIGHT_IN}`,
    substepContentInAnimDuration,
    slideInTimingFunction,
    substepContentInAnimDelay,
);
