import * as React from 'react';
import { useState } from 'react';
import { ThemeProvider, createTheme, ITheme, IFocusZoneProps } from '@fluentui/react';
import { ISubwayNavNodeProps, SubwayNavNodeState } from '../utilities/subway-nav/subway-node.types';
import { goToStepById, completeAllSteps, errorAllSteps } from '../utilities/utilities';
import {
    SubwayNav as CustomSubwayNav,
    SubwayNavNoAnimation as CustomSubwayNavNoAnimation,
} from '../utilities/subway-nav/subway-nav';
import { ISubNavItem, ISubNavProps } from './components.types';

import { M365Styles, IM365ExtendedSemanticColors } from '../utilities/customizations/src';
import { useAsync, usePrevious } from '@fluentui/react-hooks';
import { getSubwayNavNodeState, getSubwayNavNodeStatus } from './DatasetMapping';
import { PPACActualLightTheme, PPACActualDarkTheme } from '../utilities/themes';
import { ISubwayNavProps } from '../utilities/subway-nav/subway-nav.types';

// reference : https://admincontrolsdemoapps.blob.core.windows.net/demo-app/latest/DemoApp/index.html#/examples/subwaynav

const ariaLabelStrings = {
    NotStarted: 'Not Started',
    Current: 'Current',
    CurrentWithSubSteps: 'Current With Sub Steps',
    Completed: 'Completed',
    ViewedNotCompleted: 'Viewed Not Completed',
    Unsaved: 'Unsaved',
    Skipped: 'Skipped',
    Error: 'Error',
    WizardComplete: 'Wizard Complete',
    Custom: 'Custom',
};

export const CanvasSubwayNav = React.memo((props: ISubNavProps): React.ReactElement => {
    const {
        items,
        themeJSON,
        onSelected,
        setFocus,
        applyDarkTheme,
        tabIndex,
        disabled,
        wizardComplete,
        showAnimation,
    } = props;
    const [isNavCompleteOrError, setIsNavCompleteOrError] = useState(false);
    let allSteps: ISubwayNavNodeProps[];
    const prevItems = usePrevious(items);
    const prevNavState = usePrevious(wizardComplete);

    const theme = React.useMemo(() => {
        try {
            // Using PPAC theme of Admin Controls
            const copyofM365Theme: ITheme = applyDarkTheme ? PPACActualDarkTheme : PPACActualLightTheme;
            const semanticColorsCopy: Partial<IM365ExtendedSemanticColors> = copyofM365Theme.semanticColors;

            // Overiding semanticcolors specified for Subwaynav Steps using custom themeJSON
            if (themeJSON) {
                const themePrimary = JSON.parse(themeJSON).palette.themePrimary;
                semanticColorsCopy.stepNotStarted = JSON.parse(themeJSON).palette.neutralTertiaryAlt;
                semanticColorsCopy.stepPressed = themePrimary;
                semanticColorsCopy.stepHover = JSON.parse(themeJSON).palette.themeDark;
                semanticColorsCopy.stepCompleted = themePrimary;
                semanticColorsCopy.stepCurrent = themePrimary;
                semanticColorsCopy.stepModifierBorder = themePrimary;
            }
            return themeJSON
                ? createTheme({
                      palette: { ...JSON.parse(themeJSON).palette },
                      semanticColors: semanticColorsCopy,
                      components: M365Styles,
                  })
                : copyofM365Theme;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
            // so that, control doesn't break
            return applyDarkTheme ? PPACActualDarkTheme : PPACActualLightTheme;
        }
    }, [themeJSON, applyDarkTheme]);

    const componentRef = React.useRef<ISubwayNavNodeProps>(null);
    const async = useAsync();
    React.useEffect(() => {
        if (setFocus && setFocus !== '' && componentRef) {
            async.requestAnimationFrame(() => {
                (componentRef as React.RefObject<ISubwayNavNodeProps>).current?.focus();
            });
        }
    }, [setFocus, componentRef, async]);

    const focusZoneProps = React.useMemo(() => {
        return {
            tabIndex: tabIndex,
            shouldFocusInnerElementWhenReceivedFocus: true,
        } as IFocusZoneProps;
    }, [tabIndex]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function getSteps(items: ISubNavItem[], onClickStep?: (props: ISubwayNavNodeProps) => void): ISubwayNavNodeProps[] {
        allSteps = items
            .filter((item) => !item.parentId)
            .map((group) => {
                const subSteps = items
                    .filter((subItem) => subItem.parentId === group.key)
                    .map((item: ISubNavItem) => {
                        return {
                            id: item.id,
                            label: item.label,
                            state:
                                wizardComplete !== 'None'
                                    ? getSubwayNavNodeState(wizardComplete)
                                    : getSubwayNavNodeState(item.state),
                            status:
                                wizardComplete !== 'None'
                                    ? getSubwayNavNodeStatus(wizardComplete)
                                    : getSubwayNavNodeStatus(item.status),
                            disabled: item.disabled ?? false,
                            parentId: item.parentId,
                            onClickStep,
                            index: 10,
                            isVisuallyDisabled: item.visuallyDisabled ?? false,
                        };
                    });
                return {
                    id: group.id,
                    key: group.key,
                    label: group.label,
                    state:
                        wizardComplete !== 'None'
                            ? getSubwayNavNodeState(wizardComplete)
                            : getSubwayNavNodeState(group.state),
                    status:
                        wizardComplete !== 'None'
                            ? getSubwayNavNodeStatus(wizardComplete)
                            : getSubwayNavNodeStatus(group.status),
                    data: group,
                    ...(subSteps.length > 0 && { subSteps: subSteps }),
                    disabled: group.disabled ?? false,
                    onClickStep,
                    index: 10,
                    isVisuallyDisabled: group.visuallyDisabled ?? false,
                };
            }) as unknown as ISubwayNavNodeProps[];
        return allSteps;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleClickStep = (step: ISubwayNavNodeProps): void => {
        if (step) {
            const selectedStep = items.find((item: ISubNavItem) => item.id === step?.id);
            const nextSteps = goToStepById(allSteps, step.id, SubwayNavNodeState.Unsaved).steps;
            setSteps(nextSteps);
            if (selectedStep) onSelected(selectedStep, nextSteps);
        }
    };

    const [steps, setSteps] = useState<ISubwayNavNodeProps[]>(getSteps(items, handleClickStep));

    React.useEffect(() => {
        //If item or Wizard state change
        if (prevItems !== items || prevNavState !== wizardComplete) {
            setSteps(getSteps(items, handleClickStep));
        }
        //Set Wizard State
        if (wizardComplete !== 'None') {
            if (wizardComplete === 'Complete') {
                setIsNavCompleteOrError(true);
                completeAllSteps(steps);
            } else {
                setIsNavCompleteOrError(false);
                errorAllSteps(steps);
            }
        }
    }, [wizardComplete, steps, items, getSteps, handleClickStep, prevItems, prevNavState]);

    const subwaynavProps = {
        disabled: disabled,
        focusZoneProps: focusZoneProps,
        stateAriaLabels: ariaLabelStrings,
        steps: steps,
        // This is required to override width styles in custom pages
        styles: { root: { width: props.width } },
        ...(wizardComplete !== 'None' && { wizardComplete: isNavCompleteOrError }),
    } as ISubwayNavProps;

    return (
        <ThemeProvider theme={theme}>
            {showAnimation ? (
                <CustomSubwayNav {...subwaynavProps} />
            ) : (
                <CustomSubwayNavNoAnimation {...subwaynavProps} />
            )}
        </ThemeProvider>
    );
});
CanvasSubwayNav.displayName = 'CanvasSubwayNav';
