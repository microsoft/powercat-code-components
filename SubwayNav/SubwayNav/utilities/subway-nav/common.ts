// @ts-nocheck
import type { ISubwayNavNodeProps } from './subway-node.types';
import { SubwayNavNodeState } from './subway-node.types';
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
