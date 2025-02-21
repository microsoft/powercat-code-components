// @ts-nocheck
import { classNamesFunction, DefaultButton, PrimaryButton } from '@fluentui/react';
import type { FC } from 'react';
import * as React from 'react';
// @ts-ignore
import { generateWizardClickHandler, generateWizardClickHandler1, shouldWizardBeNarrow } from '../utilities/common';
import type {
    IWizardActionBarProps,
    IWizardActionBarStyleProps,
    IWizardActionBarStyles,
} from './wizard-action-bar.types';

const getClassNames = classNamesFunction<IWizardActionBarStyleProps, IWizardActionBarStyles>();

export const WizardActionBarBase: FC<IWizardActionBarProps> = (props: IWizardActionBarProps) => {
    const {
        currentStep,
        backAction,
        mainAction,
        savecloseAction,
        cancelAction,
        styles,
        theme,
        resizeObserverRef,
        isLoading,
    } = props;
    const rootRef = React.useRef<HTMLDivElement>(null);

    const [isNarrow, setIsNarrow] = React.useState(false);

    React.useEffect(() => {
        const rootDiv = rootRef.current;

        if (rootDiv) {
            // if we are passed a constructor for a ponyfill, use that instead
            const ROConstructor = resizeObserverRef ? resizeObserverRef : ResizeObserver;
            const resizeObserver = new ROConstructor((entries: ReadonlyArray<ResizeObserverEntry>) => {
                const rootDivWidth = entries[0].contentRect.width;

                if (!isNarrow && shouldWizardBeNarrow(rootDivWidth)) {
                    setIsNarrow(true);
                } else if (isNarrow && !shouldWizardBeNarrow(rootDivWidth)) {
                    setIsNarrow(false);
                }
            });

            resizeObserver.observe(rootDiv);

            return () => {
                resizeObserver.disconnect();
            };
        }

        return;
    });

    const classNames = getClassNames(styles, { theme: theme!, isNarrow: isNarrow });

    // tslint:disable:deprecation // we've intentionally deprecated title, but keep it working
    const backActionText = backAction?.text ?? backAction?.title;
    const mainActionText = mainAction?.text ?? mainAction?.title;
    const savecloseActionText = savecloseAction?.text ?? savecloseAction?.title;
    const cancelActionText = cancelAction?.text ?? cancelAction?.title;
    // tslint:disable:deprecation

    const _onRenderLeftButtons = (): JSX.Element => {
        return (
            <div className={classNames.leftButtonsWrapper}>
                {backAction && (
                    <DefaultButton
                        disabled={isLoading}
                        {...backAction}
                        text={backActionText}
                        // Title is one of the few native attributes that shouldn't ever be used.
                        title={undefined} // it was used implicitly in a previous implementation.
                        styles={classNames.subComponentStyles.back!()}
                        onClick={generateWizardClickHandler1(backAction, currentStep)}
                    />
                )}
                {mainAction && (
                    <PrimaryButton
                        disabled={isLoading}
                        {...mainAction}
                        text={mainActionText}
                        // Title is one of the few native attributes that shouldn't ever be used.
                        title={undefined} // it was used implicitly in a previous implementation.
                        styles={classNames.subComponentStyles.main!()}
                        onClick={generateWizardClickHandler1(mainAction, currentStep)}
                    />
                )}
            </div>
        );
    };

    const _onRenderRightButtons = (): JSX.Element => {
        return (
            <div className={classNames.rightButtonsWrapper}>
                {savecloseAction && (
                    <DefaultButton
                        disabled={isLoading}
                        {...savecloseAction}
                        text={savecloseActionText}
                        // Title is one of the few native attributes that shouldn't ever be used.
                        title={undefined} // it was used implicitly in a previous implementation.
                        styles={classNames.subComponentStyles.saveclose!()}
                        onClick={generateWizardClickHandler1(savecloseAction, currentStep)}
                    />
                )}

                {cancelAction && (
                    <DefaultButton
                        disabled={isLoading}
                        {...cancelAction}
                        text={cancelActionText}
                        // Title is one of the few native attributes that shouldn't ever be used.
                        title={undefined} // it was used implicitly in a previous implementation.
                        styles={classNames.subComponentStyles.cancel!()}
                        onClick={generateWizardClickHandler1(cancelAction, currentStep)}
                    />
                )}
            </div>
        );
    };

    const { onRenderLeftButtons = _onRenderLeftButtons, onRenderRightButtons = _onRenderRightButtons } = props;

    return (
        <div className={classNames.root} ref={rootRef}>
            {!isNarrow && <div className={classNames.spacer} />}
            <div className={classNames.buttonSection}>
                <>
                    {typeof onRenderLeftButtons === 'function'
                        ? onRenderLeftButtons(props, _onRenderLeftButtons)
                        : onRenderLeftButtons}
                </>
                <>
                    {typeof onRenderRightButtons === 'function'
                        ? onRenderRightButtons(props, _onRenderRightButtons)
                        : onRenderRightButtons}
                </>
            </div>
        </div>
    );
};
