// @ts-nocheck
import { ScreenWidthMinLarge } from '@fluentui/react';
import { clone } from 'ramda';

import type { IWizardStepLinkProps } from '../setup-wizard-action-bar-v2/index';
import type { ISubwayNavNodeProps } from '../subway-node/index';
import { SubwayNavNodeState } from '../subway-node/index';
import type { IDestinationStep, IStepChange, IWizardProps, IWizardStepIndex, IWizardStepProps } from '../wizard/index';
import type { IWizardStepButtonProps } from '../wizard-action-bar/index';

/**
 * Marks the current step to your specification, moves to the next logical step, marks it as current.
 * Returns a deep cloned, updated array and the next step. NextStep may be returned as undefined if
 * there is no possible next step.
 * @param steps The array of steps
 * @param setCurrentStepAs The state you'd like to leave the current step in after you've left.
 * @param setParentStepAs This only gets applied in the case of a last sub step. If left undefined falls back to
 * setCurrentStepAs.
 * */
export function goToNextStep<T extends ISubwayNavNodeProps>(
    steps: T[],
    setCurrentStepAs: SubwayNavNodeState,
    setParentStepAs?: SubwayNavNodeState,
): IStepChange<T> {
    if (
        setCurrentStepAs === SubwayNavNodeState.Current ||
        setCurrentStepAs === SubwayNavNodeState.CurrentWithSubSteps
    ) {
        throw new Error('Cannot set the original current step to current or CurrentWithSubSteps');
    }

    // clone the original array so we don't mutate it.
    const returnSteps = clone(steps);
    const currentStep = getCurrentStep(returnSteps);

    if (!currentStep) {
        throw new Error("It looks like we couldn't find the current step.");
    }

    const parentStep = getParentStep(returnSteps, currentStep);

    if (!currentStep.isSubStep && setParentStepAs && parentStep === undefined) {
        console.warn(
            "It looks like you've passed in setParentStepAs in a scenario where it will not be applied. setParentStepAs is only to be used when the step you're leaving is the last of an array of sub steps.",
        );
    }

    const currentStepIndex = getStepIndex(steps, currentStep.id);
    const getNextStepResult = getNextStep(returnSteps, currentStep.id);
    let nextStepReturnVal: ISubwayNavNodeProps | undefined = undefined;

    if (getNextStepResult) {
        nextStepReturnVal = getNextStepResult.destinationStep;
    }

    if (currentStep.isSubStep) {
        // mark the current sub step
        returnSteps[currentStepIndex.stepIndex].subSteps![currentStepIndex.subStepIndex!].state = setCurrentStepAs;

        // Is the current sub step the last of the sub steps?
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (isLastOfSubSteps(parentStep!.subSteps!, currentStep.id)) {
            // This is a last sub step so we need to address the parent.
            returnSteps[currentStepIndex.stepIndex].state = setParentStepAs ? setParentStepAs : setCurrentStepAs;

            // the next major step has sub steps, set the sub steps
            if (returnSteps[currentStepIndex.stepIndex + 1].subSteps) {
                returnSteps[currentStepIndex.stepIndex + 1].state = SubwayNavNodeState.CurrentWithSubSteps;
                returnSteps[currentStepIndex.stepIndex + 1].subSteps![0].state = SubwayNavNodeState.Current;
            } else {
                // The next major step does not have sub steps, simply set it
                returnSteps[currentStepIndex.stepIndex + 1].state = SubwayNavNodeState.Current;
            }
        } else {
            // If it is not the last sub step
            returnSteps[currentStepIndex.stepIndex].subSteps![currentStepIndex.subStepIndex! + 1].state =
                SubwayNavNodeState.Current;
        }
    } else {
        // update the current state before we move on
        returnSteps[currentStepIndex.stepIndex].state = setCurrentStepAs;

        if (getNextStepResult) {
            const nextStepIndex = getStepIndex(steps, getNextStepResult.destinationStep.id);

            // only set the next one when there is a next one
            if (
                nextStepIndex.stepIndex !== undefined &&
                nextStepIndex.subStepIndex !== undefined &&
                returnSteps[nextStepIndex.stepIndex].subSteps
            ) {
                returnSteps[nextStepIndex.stepIndex].state = SubwayNavNodeState.CurrentWithSubSteps;
                returnSteps[nextStepIndex.stepIndex].subSteps![0].state = SubwayNavNodeState.Current;
            } else if (nextStepIndex.stepIndex !== undefined) {
                returnSteps[nextStepIndex.stepIndex].state = SubwayNavNodeState.Current;
            }
        }
    }

    return {
        steps: returnSteps,
        newCurrentStep: nextStepReturnVal,
    } as IStepChange<T>;
}

/**
 * Marks the current step to your specification, moves to the previous logical step, marks it as current.
 * Returns a deep cloned, updated array and the previous step. PreviousStep may be returned as undefined if there is no
 * possible next step
 * @param steps The array of steps
 * @param setCurrentStepAs The state you'd like to leave the current step in after you've left.
 * @param setParentStepAs This only gets applied in the case of a last sub step. If left undefined falls back to
 * setCurrentStepAs.
 */
export function goToPreviousStep<T extends ISubwayNavNodeProps>(
    steps: T[],
    setCurrentStepAs: SubwayNavNodeState,
    setParentStepAs?: SubwayNavNodeState,
): IStepChange<T> {
    if (
        setCurrentStepAs === SubwayNavNodeState.Current ||
        setCurrentStepAs === SubwayNavNodeState.CurrentWithSubSteps
    ) {
        throw new Error('Cannot set the original current back current or CurrentWithSubSteps.');
    }

    if (!canGoToPreviousStep(steps)) {
        throw new Error("Looks like you can't go to a previous step");
    }

    // clone the original array so we don't mutate it.
    const returnSteps = clone(steps);
    const currentStep = getCurrentStep(returnSteps);

    if (!currentStep) {
        throw new Error("It looks like we couldn't find the current step.");
    }

    const parentStep = getParentStep(returnSteps, currentStep);

    if (!currentStep.isSubStep && setParentStepAs && parentStep === undefined) {
        console.warn(
            'It looks like you\'ve passed in setParentStepAs in a scenario where it will not be applied. setParentStepAs is only to be used when the step you\'re leaving is the first of an array of sub steps.',
        );
    }

    const currentStepIndex = getStepIndex(steps, currentStep.id);
    const previousStep = getPreviousStep(steps, currentStep.id);
    const previousStepIndex = getStepIndex(steps, previousStep!.destinationStep.id);

    // Easy case: both current and previous are sub steps of the same parent
    if (
        currentStepIndex.stepIndex === previousStepIndex.stepIndex &&
        currentStepIndex.subStepIndex !== undefined &&
        currentStepIndex.subStepIndex > 0 &&
        previousStepIndex.subStepIndex !== undefined
    ) {
        returnSteps[currentStepIndex.stepIndex].subSteps![currentStepIndex.subStepIndex].state = setCurrentStepAs;
        returnSteps[previousStepIndex.stepIndex].subSteps![previousStepIndex.subStepIndex].state =
            SubwayNavNodeState.Current;

        return {
            steps: returnSteps,
            newCurrentStep: previousStep!.destinationStep,
        } as IStepChange<T>;
    }

    // Also simple case: previous and current are both major steps with no sub steps
    if (previousStepIndex.subStepIndex === undefined && currentStepIndex.subStepIndex === undefined) {
        returnSteps[previousStepIndex.stepIndex].state = SubwayNavNodeState.Current;
        returnSteps[currentStepIndex.stepIndex].state = setCurrentStepAs;

        return {
            steps: returnSteps,
            newCurrentStep: previousStep!.destinationStep,
        } as IStepChange<T>;
    }

    // Trickier case: current is a first sub step
    if (currentStepIndex.subStepIndex !== undefined && currentStepIndex.subStepIndex === 0) {
        // set the current sub step and it's parent.
        returnSteps[currentStepIndex.stepIndex].subSteps![currentStepIndex.subStepIndex].state = setCurrentStepAs;
        returnSteps[currentStepIndex.stepIndex].state = setParentStepAs ? setParentStepAs : setCurrentStepAs;

        // if the previous step has no sub steps
        if (previousStepIndex.subStepIndex === undefined) {
            returnSteps[previousStepIndex.stepIndex].state = SubwayNavNodeState.Current;

            return {
                steps: returnSteps,
                newCurrentStep: previousStep!.destinationStep,
            } as IStepChange<T>;
        } else {
            returnSteps[previousStepIndex.stepIndex].state = SubwayNavNodeState.CurrentWithSubSteps;
            returnSteps[previousStepIndex.stepIndex].subSteps![previousStepIndex.subStepIndex].state =
                SubwayNavNodeState.Current;

            return {
                steps: returnSteps,
                newCurrentStep: previousStep!.destinationStep,
            } as IStepChange<T>;
        }
    }

    // Current step is a major step, but the previous step is a sub step
    if (currentStepIndex.subStepIndex === undefined && previousStepIndex.subStepIndex !== undefined) {
        returnSteps[currentStepIndex.stepIndex].state = setCurrentStepAs;
        returnSteps[previousStepIndex.stepIndex].state = SubwayNavNodeState.CurrentWithSubSteps;
        returnSteps[previousStepIndex.stepIndex].subSteps![previousStepIndex.subStepIndex].state =
            SubwayNavNodeState.Current;
    }

    return {
        steps: returnSteps,
        newCurrentStep: previousStep!.destinationStep,
    } as IStepChange<T>;
}

/**
 * Goes from current step to another, setting the destination step as current.
 * Set all steps in between that are in a 'NotStarted' state as 'Skipped', leaving others untouched.
 * Operates under a couple of assumptions:
 *   - If the current step is a sub step, the destination step is never a sub step under a different parent.
 *     The user should only ever see sub steps that are direct siblings.
 *   - If the destination step is behind the current step, the steps in between do not need to be updated.
 *     They would have been update on the way to the current step.
 * Returns a deep cloned, updated array and the destination step.
 * Returns undefined if the destination is the same as the current
 * @param steps The array of steps
 * @param destinationID The destination step, usually the one the user wants to go to
 * @param setCurrentStepAs The state you'd like to set the current step as before you leave it
 * @param setParentStepAs This only gets if we're leaving the current family. If left undefined falls back
 * to setCurrentStepAs.
 */
export function goToStepById<T extends ISubwayNavNodeProps>(
    steps: T[],
    destinationID: string,
    setCurrentStepAs: SubwayNavNodeState,
    setParentStepAs?: SubwayNavNodeState,
): IStepChange<T> {
    // clone the steps so we don't modify the array
    const returnSteps = clone(steps);

    // find out if the destination step is ahead or behind current step
    const currentStepIndex = getStepIndex(steps, getCurrentStep(steps).id);
    const destinationStepIndex = getStepIndex(steps, destinationID);

    if (destinationStepIndex.stepIndex === -1) {
        console.warn('It looks like you passed in a destination step ID that does not exist');

        return {
            steps: steps,
            newCurrentStep: undefined,
        } as IStepChange<T>;
    }

    const isDestinationStepForwards = isDestinationStepAhead(currentStepIndex, destinationStepIndex);

    if (
        currentStepIndex.stepIndex === destinationStepIndex.stepIndex &&
        currentStepIndex.subStepIndex !== undefined &&
        destinationStepIndex.subStepIndex !== undefined &&
        currentStepIndex.subStepIndex === destinationStepIndex.subStepIndex
    ) {
        console.warn("It looks you're trying to go to the current step.");

        // return original array since we're not changing it
        return {
            steps: steps,
            newCurrentStep: undefined,
        } as IStepChange<T>;
    }

    // mark current sub step, if necessary
    if (currentStepIndex.subStepIndex !== undefined && returnSteps[currentStepIndex.stepIndex].subSteps) {
        returnSteps[currentStepIndex.stepIndex].subSteps![currentStepIndex.subStepIndex].state = setCurrentStepAs;
    } else if (setParentStepAs) {
        console.warn(
            "It looks like you've passed in setParentStepAs in a scenario where it will not be applied. setParentStepAs is only to be used when the step you're leaving is in a different family than the current sub step.",
        );
    }

    // only mark the current major step if we're leaving it
    if (currentStepIndex.stepIndex !== destinationStepIndex.stepIndex) {
        returnSteps[currentStepIndex.stepIndex].state = setParentStepAs ? setParentStepAs : setCurrentStepAs;
    }

    // If we're going forwards, we need to mark any steps not started as 'skipped.'
    // Going backwards doesn't require any updating since they've already been updated.,
    // we don't need to touch them
    if (isDestinationStepForwards) {
        if (currentStepIndex.subStepIndex !== undefined) {
            // default to the assumption that the destination step is not a sibling.
            let lastSiblingSubStepIndexToTouch = returnSteps[currentStepIndex.stepIndex].subSteps!.length - 1;

            // if they are siblings, we should re-adjust and stop just before the destination
            if (
                currentStepIndex.stepIndex === destinationStepIndex.stepIndex &&
                destinationStepIndex.subStepIndex !== undefined
            ) {
                lastSiblingSubStepIndexToTouch = destinationStepIndex.subStepIndex - 1;
            }

            for (let k = currentStepIndex.subStepIndex; k <= lastSiblingSubStepIndexToTouch; k++) {
                if (returnSteps[currentStepIndex.stepIndex].subSteps![k].state === SubwayNavNodeState.NotStarted) {
                    returnSteps[currentStepIndex.stepIndex].subSteps![k].state = SubwayNavNodeState.Skipped;
                }
            }
        }

        // Now walk the rest of the steps
        for (let i = currentStepIndex.stepIndex + 1; i < destinationStepIndex.stepIndex; i++) {
            if (returnSteps[i].state === SubwayNavNodeState.NotStarted) {
                // skip any where no work has been done
                returnSteps[i].state = SubwayNavNodeState.Skipped;
            }

            if (returnSteps[i].subSteps) {
                for (let j = 0; j < returnSteps[i].subSteps!.length; j++) {
                    if (returnSteps[i].subSteps![j].state === SubwayNavNodeState.NotStarted) {
                        // skip any where no work has been done
                        returnSteps[i].subSteps![j].state = SubwayNavNodeState.Skipped;
                    }
                }
            }
        }
    }

    // Mark the destination step or sub steps appropriately.
    if (destinationStepIndex.subStepIndex !== undefined) {
        returnSteps[destinationStepIndex.stepIndex].state = SubwayNavNodeState.CurrentWithSubSteps;
        returnSteps[destinationStepIndex.stepIndex].subSteps![destinationStepIndex.subStepIndex].state =
            SubwayNavNodeState.Current;
    } else {
        if (returnSteps[destinationStepIndex.stepIndex].subSteps) {
            // If the destination step happens to have sub steps, we actually need to dive into the first one
            returnSteps[destinationStepIndex.stepIndex].state = SubwayNavNodeState.CurrentWithSubSteps;
            returnSteps[destinationStepIndex.stepIndex].subSteps![0].state = SubwayNavNodeState.Current;
        } else {
            returnSteps[destinationStepIndex.stepIndex].state = SubwayNavNodeState.Current;
        }
    }

    return {
        steps: returnSteps,
        newCurrentStep: getCurrentStep(returnSteps),
    } as IStepChange<T>;
}

/**
 * Based on the array state, can the current step be moved forward.
 * Developers could use this to dictate the presence/enabledness of the 'back' button
 * @param steps The steps of concern
 */
export function canGoToPreviousStep<T extends ISubwayNavNodeProps[]>(steps: T): boolean {
    if (
        steps[0].state === SubwayNavNodeState.Current ||
        (steps[0].subSteps && steps[0].subSteps[0].state === SubwayNavNodeState.Current)
    ) {
        return false;
    }

    return true;
}

/**
 * Based on the array state, can the current step be moved forward
 * Developers could use this to dictate the presence/enabledness of the 'next' button
 * @param steps The steps of concern
 */
export function canGoToNextStep<T extends ISubwayNavNodeProps[]>(steps: T): boolean {
    if (steps[steps.length - 1].state === SubwayNavNodeState.Current) {
        return false;
    }

    const subSteps = steps[steps.length - 1].subSteps;

    if (subSteps && subSteps[subSteps.length - 1].state === SubwayNavNodeState.Current) {
        return false;
    }

    return true;
}

/**
 * Indiscriminately sets all steps and sub steps to SubwayNavNodeState.Completed
 * If isWizardComplete is true, it will also set the disabled and isVisuallyDisabled appropriately.
 * @param steps The steps to complete
 * @param isWizardComplete Defaults to false. If true, sets the steps to SubwayNavNodeState.WizardComplete
 * and isVisuallyDisabled to false
 */
export function completeAllSteps<T extends ISubwayNavNodeProps[]>(steps: T, isWizardComplete = false): T {
    const returnSteps = clone(steps);

    const setTo = !isWizardComplete ? SubwayNavNodeState.Completed : SubwayNavNodeState.WizardComplete;

    for (let i = 0; i < returnSteps.length; i++) {
        returnSteps[i].state = setTo;

        if (isWizardComplete) {
            returnSteps[i].disabled = true;
            returnSteps[i].isVisuallyDisabled = false;
        }

        if (returnSteps[i].subSteps) {
            for (let j = 0; j < returnSteps[i].subSteps!.length; j++) {
                returnSteps[i].subSteps![j].state = setTo;

                if (isWizardComplete) {
                    returnSteps[i].subSteps![j].disabled = true;
                    returnSteps[i].subSteps![j].isVisuallyDisabled = false;
                }
            }
        }
    }

    return returnSteps;
}

/**
 * Returns true when all steps are complete, false if at least one step is not complete.
 * @param steps The steps of concern.
 * Returns true if all steps & subSteps are marked as Completed or WizardComplete
 * Returns false if any step or subStep is not Completed or WizardComplete
 * param steps The steps of concern
 */
export function areAllStepsComplete<T extends ISubwayNavNodeProps[]>(steps: T): boolean {
    return steps.every((step) => {
        return isStepComplete(step) && areAllStepsComplete(step.subSteps ? step.subSteps : []);
    });
}

/**
 * Checks if a given state is in a state deemed "complete".
 * States are complete if they are either Completed or WizardComplete.
 * @param step The step to check
 * @returns True if step is complete, false otherwise.
 */
export function isStepComplete<T extends ISubwayNavNodeProps>(step: T): boolean {
    return step.state === SubwayNavNodeState.Completed || step.state === SubwayNavNodeState.WizardComplete;
}

/**
 * Indiscriminately sets all steps and sub steps to SubwayNaveNodeState.Error.
 * Also sets disabled and isVisuallyDisabled.
 * @param steps The steps to error
 * @param disabled Defaults to false
 * @param isVisuallyDisabled Defaults to false
 * @returns Returns a deeply cloned set of steps.
 */
export function errorAllSteps<T extends ISubwayNavNodeProps[]>(
    steps: T,
    disabled = false,
    isVisuallyDisabled = false,
): T {
    const returnSteps = clone(steps);

    for (let i = 0; i < returnSteps.length; i++) {
        returnSteps[i] = errorSingleStep(returnSteps[i], disabled, isVisuallyDisabled);

        if (returnSteps[i].subSteps) {
            for (let j = 0; j < returnSteps[i].subSteps!.length; j++) {
                returnSteps[i].subSteps![j] = errorSingleStep(
                    returnSteps[i].subSteps![j],
                    disabled,
                    isVisuallyDisabled,
                );
            }
        }
    }

    return returnSteps;
}

/**
 * Sets a given step to an error state.
 * Does mutate the original object.
 * @param step The step of concern
 * @param disabled if true, still appears in full color, but is not clickable.
 * @param isVisuallyDisabled If true, is 50% opaque to appear disabled.
 * @returns
 */
export function errorSingleStep<T extends ISubwayNavNodeProps>(
    step: T,
    disabled = false,
    isVisuallyDisabled = false,
): T {
    step.state = SubwayNavNodeState.Error;
    step.disabled = disabled;
    step.isVisuallyDisabled = isVisuallyDisabled;

    return step;
}

/**
 * Returns true if the destination step is ahead of the current step.
 * Returns false if the destination step is behind of the current step.
 * Returns undefined if they are the same step
 * @param currentStepIndex
 * @param destinationStepIndex
 */
export function isDestinationStepAhead(
    currentStepIndex: IWizardStepIndex,
    destinationStepIndex: IWizardStepIndex,
): boolean | undefined {
    // check for equivalence
    if (currentStepIndex.stepIndex === destinationStepIndex.stepIndex) {
        if (
            currentStepIndex.subStepIndex !== undefined &&
            destinationStepIndex.subStepIndex !== undefined &&
            currentStepIndex.subStepIndex === destinationStepIndex.subStepIndex
        ) {
            return undefined;
        }

        if (!currentStepIndex.subStepIndex && !destinationStepIndex.subStepIndex) {
            return undefined;
        }
    }

    if (currentStepIndex.stepIndex < destinationStepIndex.stepIndex) {
        return true;
    } else if (currentStepIndex.stepIndex === destinationStepIndex.stepIndex) {
        if (
            currentStepIndex.subStepIndex !== undefined &&
            destinationStepIndex.subStepIndex !== undefined &&
            currentStepIndex.subStepIndex < destinationStepIndex.subStepIndex
        ) {
            return true;
        }
    }

    // if none of these hit, it must be a backwards step.
    return false;
}

/**
 * Gets the first step in the array that is marked as Current or CurrentWithSubSteps
 * If no steps are marked as current, it simply returns the first step. If that step
 * has a sub step, it returns the first sub step.
 * @param steps
 */
export function getCurrentStep<T extends ISubwayNavNodeProps>(steps: T[]): T {
    let currentStep;
    let indexToShow = -1;

    steps.some((wizStep: ISubwayNavNodeProps) => {
        indexToShow++;

        if (wizStep.state === SubwayNavNodeState.Current) {
            currentStep = { ...wizStep };
            currentStep.index = indexToShow;

            return true;
        } else if (wizStep.state === SubwayNavNodeState.CurrentWithSubSteps) {
            // throw error if CurrentWithSubSteps is set without subSteps
            if (!wizStep.subSteps) {
                throw new Error('The state "CurrentWithSubSteps" must be used in conjunction with the "subSteps" prop');
            }

            const foundSubStep = wizStep.subSteps.some((wizSubStep: ISubwayNavNodeProps, index: number) => {
                indexToShow++;

                if (wizSubStep.state === SubwayNavNodeState.Current) {
                    currentStep = { ...wizSubStep };

                    return true;
                }

                return false;
            });

            if (!foundSubStep) {
                currentStep = { ...wizStep.subSteps[0] };
                currentStep.isSubStep = true;
                currentStep.isFirstSubStep = true;
                currentStep.index = indexToShow - wizStep.subSteps.length + 1;
            }

            return true;
        } else if (wizStep.subSteps) {
            indexToShow += wizStep.subSteps.length;
        }

        return false;
    });

    if (!currentStep) {
        // If no steps is set as "Current", just return the first step
        currentStep = { ...steps[0] };

        if (currentStep.subSteps && currentStep.subSteps.length > 0) {
            currentStep = { ...currentStep.subSteps[0] };
        }
    }

    return currentStep as T;
}

/**
 * Get step to show
 * If stepToShow is specified, immediately returns that step.
 * If the props are marked as complete and contain a wizardCompleteStep, returns that completed step
 * If neither stepsToShow nor wizardComplete steps are populated, returns getCurrentStep
 * @param props Wizard props
 */
export function getStepToShow(props: IWizardProps): IWizardStepProps {
    const { wizardComplete, wizardCompleteStep, stepToShow: stepToShowFromProps } = props;

    if (stepToShowFromProps) {
        return stepToShowFromProps;
    }

    let stepToShow;

    if (wizardComplete! && wizardCompleteStep) {
        stepToShow = wizardCompleteStep;
    } else {
        stepToShow = getCurrentStep(props.steps);
    }

    return stepToShow;
}

/**
 * Returns the next logical step from the currentStepID
 * If the next step is a sub step, also return that parentID
 * @param steps The array of steps
 * @param currentStepId The ID of the current step
 */
export function getNextStep<T extends ISubwayNavNodeProps>(
    steps: T[],
    currentStepId: string,
): IDestinationStep<T> | undefined {
    const currentStepIndex = getStepIndex(steps, currentStepId);

    // Make sure the current step isn't the last major or minor step
    if (
        currentStepIndex.stepIndex === steps.length - 1 &&
        (steps[currentStepIndex.stepIndex].subSteps === undefined ||
            (currentStepIndex.subStepIndex !== undefined &&
                currentStepIndex.subStepIndex === steps[currentStepIndex.stepIndex].subSteps!.length - 1))
    ) {
        return undefined;
    }

    // if there are sub steps after the current step, we want that step
    if (
        currentStepIndex.subStepIndex !== undefined &&
        currentStepIndex.subStepIndex + 1 < steps[currentStepIndex.stepIndex].subSteps!.length
    ) {
        return {
            destinationStep: steps[currentStepIndex.stepIndex].subSteps![currentStepIndex.subStepIndex + 1],
            parentId: steps[currentStepIndex.stepIndex].id,
        } as IDestinationStep<T>;
    } else {
        // Check the next major step
        // go to the next major step
        if (steps[currentStepIndex.stepIndex + 1].subSteps) {
            // it has sub steps, so return the first sub step as the step and the parent accordingly
            return {
                destinationStep: steps[currentStepIndex.stepIndex + 1].subSteps![0],
                parentId: steps[currentStepIndex.stepIndex + 1].id,
            } as IDestinationStep<T>;
        }

        // We know there are no sub steps, return the next major step only
        return {
            destinationStep: steps[currentStepIndex.stepIndex + 1],
            parentId: undefined,
        };
    }
}

/**
 * Returns the step previous to the current step. If the current step is the first step, returns undefined.
 * @param steps The array of steps
 * @param currentStepId The ID of the current step
 */
export function getPreviousStep<T extends ISubwayNavNodeProps>(
    steps: T[],
    currentStepId: string,
): IDestinationStep<T> | undefined {
    const currentStepIndex = getStepIndex(steps, currentStepId);

    // We're on the zeroth step, and it either has no sub steps or we're on the zeroth sub steps.
    // There is no previous step
    if (
        currentStepIndex.stepIndex === 0 &&
        (steps[currentStepIndex.stepIndex].subSteps === undefined || currentStepIndex.subStepIndex === 0)
    ) {
        // There are no sub steps, we're on the last major step, return undefined
        return undefined;
    }

    // Easy case, we're on a first sub step,
    if (currentStepIndex.subStepIndex === 0) {
        // previous major step has no sub steps
        if (steps[currentStepIndex.stepIndex - 1].subSteps === undefined) {
            return {
                destinationStep: steps[currentStepIndex.stepIndex - 1],
            } as IDestinationStep<T>;
        } else {
            if (steps[currentStepIndex.stepIndex - 1].subSteps) {
                // the previous major steps has sub steps, so return the last one
                const subStepLength = steps[currentStepIndex.stepIndex - 1].subSteps!.length;

                return {
                    destinationStep: steps[currentStepIndex.stepIndex - 1].subSteps![subStepLength - 1],
                    parentId: steps[currentStepIndex.stepIndex - 1].id,
                } as IDestinationStep<T>;
            } else {
                // previous step has no sub steps, simple return the major step
                return {
                    destinationStep: steps[currentStepIndex.stepIndex - 1],
                } as IDestinationStep<T>;
            }
        }
    } else if (currentStepIndex.subStepIndex !== undefined && currentStepIndex.subStepIndex > 0) {
        return {
            destinationStep: steps[currentStepIndex.stepIndex].subSteps![currentStepIndex.subStepIndex - 1],
            parentId: steps[currentStepIndex.stepIndex].id,
        } as IDestinationStep<T>;
    }

    // we're on a major step, go back to either a major step or it's last sub step
    if (steps[currentStepIndex.stepIndex - 1].subSteps) {
        // the previous major steps has sub steps, so return the last one
        const subStepLength = steps[currentStepIndex.stepIndex - 1].subSteps!.length;

        return {
            destinationStep: steps[currentStepIndex.stepIndex - 1].subSteps![subStepLength - 1],
            parentId: steps[currentStepIndex.stepIndex - 1].id,
        } as IDestinationStep<T>;
    } else {
        // previous step has no sub steps, simple return the major step
        return {
            destinationStep: steps[currentStepIndex.stepIndex - 1],
        } as IDestinationStep<T>;
    }
}

/**
 * Gets the parent of a given sub step. If the stepToGet is not a subStep, returns undefined.
 * The subSteps isSubStep and parentID properties must be defined, otherwise returns undefined
 * @param steps The array of steps
 * @param stepToGet The ID of the target step
 */
export function getParentStep<T extends ISubwayNavNodeProps>(steps: T[], stepToGet: T): T | undefined {
    let parentStep: ISubwayNavNodeProps | undefined = undefined;

    if (!(stepToGet.isSubStep && stepToGet.parentId)) {
        return parentStep;
    }

    if (stepToGet.isSubStep) {
        parentStep = getStep(steps, stepToGet.parentId);
    }

    return parentStep as T;
}

/**
 * Gets a step from the array by the stepId. Returns undefined if the expected step does not exist.
 * @param steps The array of steps
 * @param stepId The ID of the step to get.
 */
export function getStep<T extends ISubwayNavNodeProps>(steps: T[], stepId: string): T | undefined {
    for (let i = 0; i < steps.length; i++) {
        if (steps[i].id === stepId) {
            return steps[i];
        }

        if (steps[i].subSteps) {
            for (let j = 0; j < steps[i].subSteps!.length; j++) {
                if (steps[i].subSteps![j].id === stepId) {
                    return steps[i].subSteps![j] as T;
                }
            }
        }
    }

    return undefined;
}

/**
 * Get the index of the id.
 * Returns -1 if stepId is not found.
 * @param steps the steps to search
 * @param stepId the step to find.
 */
export function getStepIndex<T extends ISubwayNavNodeProps>(steps: T[], stepId: string): IWizardStepIndex {
    // Loop through the top level and any sub steps
    // if id matches, return that index.
    for (let i = 0; i < steps.length; i++) {
        if (steps[i].id === stepId) {
            // we found a match in a major step
            return {
                stepIndex: i,
            };
        }

        // no match yet, check the sub steps
        if (steps[i].subSteps) {
            for (let j = 0; j < steps[i].subSteps!.length; j++) {
                if (steps[i].subSteps![j].id === stepId) {
                    return {
                        stepIndex: i,
                        subStepIndex: j,
                    };
                }
            }
        }
    }

    return { stepIndex: -1 };
}

/**
 * Checks if all a given steps' sub steps are marked as completed.
 * @param step The step of concern
 */
export function hasCompletedSubSteps<T extends ISubwayNavNodeProps[]>(subSteps: T): boolean {
    // if all steps are completed or current, count main as completed
    return subSteps.some((subStep: ISubwayNavNodeProps) => {
        return subStep.state === SubwayNavNodeState.Completed;
    });
}

/**
 * Returns true if the given step is the last in an array of sub steps, false otherwise
 * @param subSteps The array of sub steps in question
 * @param id The id of the step of concern
 */
export function isLastOfSubSteps<T extends ISubwayNavNodeProps[]>(subSteps: T, id: string): boolean {
    if (subSteps[subSteps.length - 1].id === id) {
        return true;
    }

    return false;
}

/**
 * Returns true if the given step is the last sub step in array of sub steps, false otherwise
 * @param subSteps The array of sub steps in question. Note this should be a SUB array, not the whole array.
 * @param id The id of the step of concern
 */
export function isFirstOfSubSteps<T extends ISubwayNavNodeProps>(subSteps: T, id: string): boolean {
    if (subSteps[0].id === id) {
        return true;
    }

    return false;
}

/**
 * Decides wether or not the wizard should be narrow or not.
 * @param wizardWidth The current width of the wizard, usually the wizardContentNavContainer
 */
export function shouldWizardBeNarrow(wizardWidth: number): boolean {
    if (wizardWidth < ScreenWidthMinLarge) {
        return true;
    }

    return false;
}

/**
 * Generates click handlers for WAB and SWABv2
 * @param wizardLinkOrButtonProps Props for the wizard link or button steps
 * @param currentStep The current step the the wizard is showing.
 */
export const generateWizardClickHandler = (
    wizardLinkOrButtonProps: IWizardStepLinkProps | IWizardStepButtonProps,
    currentStep: IWizardStepProps,
): ((event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLElement>) => void) => {
    return (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLElement>) => {
        wizardLinkOrButtonProps.onClick(currentStep, event);
    };
};

export const wrapStepClickWithCloseFunction = (
    originalProps: ISubwayNavNodeProps,
    closeFunction: () => void,
    originalClick?: (props: ISubwayNavNodeProps) => void,
): ((props: ISubwayNavNodeProps) => void) => {
    return (props: ISubwayNavNodeProps) => {
        const { disabled } = originalProps;

        // The main wizard subway nav uses styles to disable pointer events when it's complete.
        // We still need to be able to close the collapsible)
        closeFunction();

        if (originalClick !== undefined && (disabled === undefined || disabled === false)) {
            originalClick(originalProps);
        }
    };
};

/**
 * Helper method to determine if isContentScrollBarPresent should be turned to false.
 * @param scrollHeight Height of the scrollable area
 * @param clientHeight Height of the visible content area
 * @param isContentScrollBarPresent current status of the scrollbar presence
 * @returns true if isContentScrollBarPresent should be turned to false.
 * False if it should be left alone.
 */
export const shouldHideScrollBarPresence = (
    scrollHeight: number,
    clientHeight: number,
    isContentScrollBarPresent: boolean,
) => {
    return scrollHeight < clientHeight && isContentScrollBarPresent;
    // if the scrollable area is less than the client height,
    // don't account for the scroll bar presence, because it's not.
};

/**
 * Helper method to determine if isContentScrollBarPresent should be turned to true.
 * @param scrollHeight Height of the scrollable area
 * @param clientHeight Height of the visible content area
 * @param isContentScrollBarPresent current status of the scrollbar presence
 * @returns true if isContentScrollBarPresent should be turned to false.
 * False if it should be left alone.
 */
export const shouldShowScrollBarPresence = (
    scrollHeight: number,
    clientHeight: number,
    isContentScrollBarPresent: boolean,
) => {
    return scrollHeight >= clientHeight && !isContentScrollBarPresent;
};
