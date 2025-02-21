// @ts-nocheck
/* eslint-disable */
/* istanbul ignore file */
import type { IProcessedStyleSet } from '@fluentui/react';
import { classNamesFunction } from '@fluentui/react';
import { FocusZone as CustomFocusZone } from '../FocusZone/FocusZone';
import * as React from 'react';
import { SubwayNavNodeState, SubwayNode, ISubwayNavNodeProps } from '../subway-node';
import { getCurrentStep } from '../utilities/common';
import type {
  ISubwayNavItemStyleProps,
  ISubwayNavItemStyles,
  ISubwayNavProps,
  ISubwayNavStyleProps,
  ISubwayNavStyles,
} from './subway-nav.types';

const getClassNames = classNamesFunction<ISubwayNavStyleProps, ISubwayNavStyles>();
const getItemClassNames = classNamesFunction<
  ISubwayNavItemStyleProps,
  ISubwayNavItemStyles
>();

export class SubwayNavBase extends React.Component<ISubwayNavProps> {
  private _classNames: IProcessedStyleSet<ISubwayNavStyles>;
  private _currentID: string; // ID of the current step

  public render(): JSX.Element {
    const {
      styles,
      onRenderSteps = this._onRenderSteps,
      disabled = false,
      steps,
      wizardComplete,
      theme,
      focusZoneProps,
    } = this.props;

    this._classNames = getClassNames(styles, {
      steps,
      disabled,
      wizardComplete,
      theme: theme!,
    });

    this._currentID = getCurrentStep(steps).id;

    return (
      <CustomFocusZone
        // Remove this line of explicitly setting role="list" after https://github.com/OfficeDev/office-ui-fabric-react/issues/9898 is fixed
        role="menubar"
        as="ul"
        isCircularNavigation={true}
        {...focusZoneProps}
        className={this._classNames.root}
      >
        {onRenderSteps(this.props)}
      </CustomFocusZone>
    );
  }

  private _onRenderSteps = (props: ISubwayNavProps): JSX.Element[] => {
    let _currentIndex = 0;
    const primaryStepLength = props.steps.length;
    const { disabled: wholeDisabled = false, wizardComplete } = props;

    return props.steps.map((step: ISubwayNavNodeProps, primaryStepIndex: number) => {
      const {
        subSteps,
        state,
        id,
        onRenderSubSteps = this._onRenderSubSteps,
        disabled: stepDisabled,
      } = step;
      const indexToUse = _currentIndex;

      _currentIndex =
        _currentIndex +
        1 +
        (subSteps && state === SubwayNavNodeState.CurrentWithSubSteps
          ? subSteps.length
          : 0);

      const classNames = getItemClassNames(this._classNames.subComponentStyles.item, {
        index: indexToUse,
        id,
      });

      const isStepFunctionallyDisabled = wholeDisabled ?? stepDisabled ?? wizardComplete;
      const isStepVisuallyDisabled = this._isWholeVisuallyDisabled();

      return (
        <React.Fragment key={id}>
          <li className={classNames.root} role="presentation">
            <SubwayNode
              role="menuitem"
              aria-posinset={primaryStepIndex + 1}
              aria-setsize={primaryStepLength}
              iconAriaLabel={this.props.stateAriaLabels?.[step.state]}
              isVisuallyDisabled={isStepVisuallyDisabled}
              {...(this._currentID === step.id && { 'aria-current': 'step' })}
              {...step}
              disabled={isStepFunctionallyDisabled}
              index={indexToUse}
            />
          </li>
          {onRenderSubSteps(step, indexToUse)}
        </React.Fragment>
      );
    });
  };

  private _onRenderSubSteps = (
    props: ISubwayNavNodeProps,
    parentIndex: number,
  ): JSX.Element | null => {
    const { disabled: wholeDisabled = false } = this.props;
    const { disabled: subStepDisabled = false } = props;

    const isSubStepFunctionallyDisabled = wholeDisabled || subStepDisabled;
    const isSubStepVisuallyDisabled = this._isWholeVisuallyDisabled();

    return props.subSteps && props.state === SubwayNavNodeState.CurrentWithSubSteps ? (
      <>
        {props.subSteps.map((subStep: ISubwayNavNodeProps, subIndex: number) => {
          const index = parentIndex + subIndex + 1;
          const subStepLength = props.subSteps?.length;
          const classNames = getItemClassNames(this._classNames.subComponentStyles.item, {
            index,
            id: subStep.id,
          });

          return (
            <li
              key={subStep.id}
              role="presentation"
              data-substep="true"
              className={classNames.root}
            >
              <SubwayNode
                isVisuallyDisabled={isSubStepVisuallyDisabled}
                disabled={isSubStepFunctionallyDisabled}
                iconAriaLabel={this.props.stateAriaLabels?.[subStep.state]}
                {...(this._currentID === subStep.id && { 'aria-current': 'step' })}
                {...subStep}
                role="menuitem"
                aria-posinset={subIndex + 1}
                aria-setsize={subStepLength}
                parentId={props.id}
                isSubStep={true}
                index={index}
              />
            </li>
          );
        })}
      </>
    ) : null;
  };

  private _isWholeVisuallyDisabled = () => {
    const { disabled: wholeDisabled = false, wizardComplete } = this.props;

    let stepVisuallyDisabled = wholeDisabled;

    if (wizardComplete) {
      stepVisuallyDisabled = false;
    }

    return stepVisuallyDisabled;
  };
}
