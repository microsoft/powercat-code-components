// @ts-nocheck
import type { ICalloutPositionedInfo, IProcessedStyleSet } from '@fluentui/react';
import { Announced, Callout, classNamesFunction, DirectionalHint } from '@fluentui/react';
import { Collapsible } from '../collapsible/src/collapsible';
import { LoadingPane } from '../loading/src/loading';
import type { ReactNode } from 'react';
import * as React from 'react';

//import { SubwayNav } from '../subway-nav/index';
import { SubwayNav } from '../subway-nav/subway-nav';

import { SubwayNode } from '../subway-node/index';
import {
  getStepIndex,
  getStepToShow,
  isDestinationStepAhead,
  shouldHideScrollBarPresence,
  shouldShowScrollBarPresence,
  shouldWizardBeNarrow,
  wrapStepClickWithCloseFunction,
} from '../utilities/index';
import type {
  IWizardProps,
  IWizardState,
  IWizardStepIndex,
  IWizardStepProps,
  IWizardStyleProps,
  IWizardStyles,
} from './wizard.types';

const getClassNames = classNamesFunction<IWizardStyleProps, IWizardStyles>();

/** Component for Wizard Base */
export class WizardBase extends React.Component<IWizardProps, IWizardState> {
  private _collapsibleElement: HTMLElement | null;
  private _rootRef: React.RefObject<HTMLDivElement>;
  private _contentSectionRef: React.RefObject<HTMLDivElement>;
  private _resizeObserver?: ResizeObserver;
  private lastStepIndexShown: IWizardStepIndex;
  private isLastStepSubStep: boolean;

  private clickedForward: boolean | undefined;
  private clickedBackward: boolean | undefined;
  private isSubStep: boolean;
  private isFirstSubStep: boolean;

  private _rootWidth: number;
  private _classNames: IProcessedStyleSet<IWizardStyles>;

  constructor(props: IWizardProps) {
    super(props);

    this.state = {
      isNarrow: false,
      isContentScrollBarPresent: true,
      isCalloutExpanded: false,
      hideCalloutOverFlow: true,
    };

    this._rootRef = React.createRef<HTMLDivElement>();
    this._contentSectionRef = React.createRef<HTMLDivElement>();
    this._toggleCallout = this._toggleCallout.bind(this);
    this._onCalloutDismiss = this._onCalloutDismiss.bind(this);
    this._onRenderCollapsibleTitle = this._onRenderCollapsibleTitle.bind(this);
    this._onRenderContent = this._onRenderContent.bind(this);
    this._onRenderLoading = this._onRenderLoading.bind(this);
    this._onCalloutPositioned = this._onCalloutPositioned.bind(this);
    this._updateScrollBarPresence = this._updateScrollBarPresence.bind(this);

    const wizardStepProps = this.props.stepToShow ? this.props.stepToShow : getStepToShow(this.props);

    this.lastStepIndexShown = getStepIndex(this.props.steps, wizardStepProps.id);
  }

  public componentDidMount(): void {
    const rootDiv = this._rootRef.current;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { resizeObserverRef, onIsNarrowChanged = this._defaultIsNarrowChanged } = this.props;

    if (rootDiv) {
      // if we are passed a constructor for a ponyfill, use that instead
      const ROConstructor = resizeObserverRef ? resizeObserverRef : ResizeObserver;

      this._resizeObserver = new ROConstructor((entries: ReadonlyArray<ResizeObserverEntry>) => {
        const { isNarrow } = this.state;

        const rootDivWidth = entries[0].contentRect.width;

        this._rootWidth = rootDivWidth;

        if (!isNarrow && shouldWizardBeNarrow(rootDivWidth)) {
          this.setState({ isNarrow: true });
          onIsNarrowChanged(true);
        } else if (isNarrow && !shouldWizardBeNarrow(rootDivWidth)) {
          this.setState({ isNarrow: false });
          onIsNarrowChanged(false);
        }
      });

      this._resizeObserver.observe(rootDiv);
    }
  }

  public componentDidUpdate(): void {
    this._updateScrollBarPresence();
  }

  public componentWillUnmount(): void {
    if (this._resizeObserver !== undefined) {
      this._resizeObserver.disconnect();
    }
  }

  public render() {
    const {
      steps,
      wizardComplete,
      subwayNavProps,
      navAriaLabel,
      collapsibleProps,
      calloutProps,
      loadingPaneProps,
      showProgressIndicator,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      onRenderLoading = this._onRenderLoading,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      onRenderContent = this._onRenderContent,
      optOutOfFocusBehavior = false,
      isLoading,
      styles,
      theme,
    } = this.props;
    const { isNarrow, isCalloutExpanded, isContentScrollBarPresent } = this.state;

    if (steps.length === 0) {
      throw new Error('Wizard must have at least one step.');
    }

    if (subwayNavProps?.steps) {
      console.warn(
        "It looks like you passed in steps to the subway nav props for the wizard. Instead please use the 'steps' props on the top level wizard props."
      );
    }

    if (calloutProps?.styles) {
      console.warn(
        'It looks like you passed in calloutProps.styles. These will be overridden. Please use WizardProps.styles.subComponentStyles.calloutContent instead.'
      );
    }

    if (collapsibleProps?.styles) {
      console.warn(
        'It looks like you passed in collapsibleProps.styles. These will be overridden. Please use WizardProps.styles.subComponentStyles.collapsibleProps instead.'
      );
    }

    if (loadingPaneProps?.styles) {
      console.warn(
        'It looks like you passed in loadingPaneProps.styles. These will be overridden. Please use WizardProps.styles.subComponentStyles.loadingPane instead.'
      );
    }

    if (showProgressIndicator !== undefined) {
      console.warn(
        'It looks like you passed in showProgressIndicator. isLoading takes priority over it and showProgressIndicator will be deprecated in the future. Please use isLoading instead.'
      );
    }

    // if the step to render is already passed in, use that
    const wizardStepProps = this.props.stepToShow ? this.props.stepToShow : getStepToShow(this.props);
    const currentStepIndex = getStepIndex(this.props.steps, wizardStepProps.id);

    const isDestStepAhead = isDestinationStepAhead(currentStepIndex, this.lastStepIndexShown);

    this.clickedForward = isDestStepAhead === true || isDestStepAhead !== undefined;
    this.clickedBackward = isDestStepAhead === false || isDestStepAhead !== undefined;

    this.isSubStep = wizardStepProps.isSubStep!;
    this.isFirstSubStep = wizardStepProps.isFirstSubStep!;

    let stepsClone = steps;

    if (isNarrow) {
      // Parents with sub steps shouldn't close the panel.
      // Only sub steps and steps without sub steps.
      stepsClone = steps.map((step: IWizardStepProps) => {
        if (step.subSteps === undefined) {
          return {
            ...step,
            onClickStep: wrapStepClickWithCloseFunction(
              step,
              // eslint-disable-next-line @typescript-eslint/unbound-method
              this._onCalloutDismiss,
              step.onClickStep
            ),
          };
        } else {
          return {
            ...step,
            subSteps: step.subSteps.map((subStep: IWizardStepProps) => {
              return {
                ...subStep,
                onClickStep: wrapStepClickWithCloseFunction(
                  subStep,
                  // eslint-disable-next-line @typescript-eslint/unbound-method
                  this._onCalloutDismiss,
                  subStep.onClickStep
                ),
              };
            }),
          };
        }
      });
    }

    let offsetIndex = 0;

    if (this.isSubStep) {
      stepsClone.forEach((value: IWizardStepProps) => {
        if (value.subSteps) {
          value.subSteps.forEach((subStep: IWizardStepProps, index: number) => {
            if (wizardStepProps.id === subStep.id) {
              offsetIndex = index;
            }
          });
        }
      });
    }

    const contentSectionKey = 'contentSection-' + wizardStepProps.id;

    // Update the step index showing
    this.lastStepIndexShown = currentStepIndex;
    this.isLastStepSubStep = wizardStepProps.isSubStep!;

    // Update previous step visited is a sub step
    this.isLastStepSubStep = this.isSubStep;
    /* tslint:disable-next-line:deprecation */
    const showLoading = !!(isLoading ?? showProgressIndicator);
    const wizardStyleProps = {
      theme: theme!,
      isSubStep: this.isSubStep,
      isFirstSubStep: this.isFirstSubStep,
      clickedForward: this.clickedForward,
      backgroundImageUrl: wizardStepProps.backgroundImageUrl ? wizardStepProps.backgroundImageUrl : '',
      stepBackgroundIndex: offsetIndex,
      isLastStepSubStep: this.isLastStepSubStep,
      isContentScrollBarPresent: isContentScrollBarPresent,
      isNarrow: isNarrow,
      isLoading: showLoading,
    };

    this._classNames = getClassNames(styles, wizardStyleProps);

    if ((isLoading || this.clickedBackward || this.clickedForward) && !optOutOfFocusBehavior) {
      this._contentSectionRef.current?.focus();
    }

    return (
      <>
        {wizardStepProps.announcedProps && <Announced {...wizardStepProps.announcedProps} />}
        {isNarrow && (
          <>
            <div
              className={this._classNames.collapsibleContainer}
              ref={(collapsible) => (this._collapsibleElement = collapsible)}
            >
              <Collapsible
                title=""
                disabled={showLoading}
                // eslint-disable-next-line @typescript-eslint/unbound-method
                onRenderTitle={this._onRenderCollapsibleTitle}
                {...collapsibleProps}
                // eslint-disable-next-line @typescript-eslint/unbound-method
                onToggle={this._toggleCallout}
                styles={this._classNames.subComponentStyles.collapsible}
              />
            </div>
            {isCalloutExpanded && (
              <Callout
                gapSpace={0}
                isBeakVisible={false}
                calloutWidth={this._rootWidth}
                setInitialFocus={true}
                alignTargetEdge={true}
                preventDismissOnScroll={false}
                directionalHint={DirectionalHint.bottomLeftEdge}
                directionalHintFixed={true}
                target={this._collapsibleElement}
                {...calloutProps}
                // eslint-disable-next-line @typescript-eslint/unbound-method
                onPositioned={this._onCalloutPositioned}
                // eslint-disable-next-line @typescript-eslint/unbound-method
                onDismiss={this._onCalloutDismiss}
                styles={this._classNames.subComponentStyles.calloutContent}
              >
                <SubwayNav
                  disabled={showLoading}
                  styles={this._classNames.subComponentStyles.narrowSubwayNav}
                  {...subwayNavProps}
                  steps={stepsClone}
                  wizardComplete={wizardComplete}
                />
              </Callout>
            )}
          </>
        )}
        <div className={this._classNames.wizardContentNavContainer} ref={this._rootRef}>
          {!isNarrow && (
            <nav className={this._classNames.subwayNavSection} aria-label={navAriaLabel}>
              <SubwayNav
                disabled={showLoading}
                {...subwayNavProps}
                steps={stepsClone}
                wizardComplete={wizardComplete}
              />
            </nav>
          )}
          <div
            key={contentSectionKey}
            className={this._classNames.contentSection}
            ref={this._contentSectionRef}
            tabIndex={-1}
            data-is-scrollable={true}
          >
            {onRenderContent(this.props)}
            {onRenderLoading(this.props)}
          </div>
        </div>
      </>
    );
  }

  private _onRenderCollapsibleTitle(): JSX.Element {
    return (
      <SubwayNode
        {...getStepToShow(this.props)}
        disabled={this.props.isLoading}
        isSubStep={false}
        rootAs={'div'}
      />
    );
  }

  private _onRenderLoading(props: IWizardProps): ReactNode {
    const showLoading = !!(props.isLoading ?? props.showProgressIndicator);

    return (
      <LoadingPane
        isLoading={showLoading}
        {...props.loadingPaneProps}
        styles={this._classNames.subComponentStyles.loadingPane}
      />
    );
  }

  private _onRenderContent(props: IWizardProps): ReactNode {
    // if the step to render is already passed in, use that
    const stepProps = props.stepToShow ?? getStepToShow(props);

    const ContentTitleElementAs = stepProps.wizardContent?.contentTitleElementAs
      ? stepProps.wizardContent?.contentTitleElementAs
      : 'h2';
    const contentTitleKey = 'contentTitle-' + stepProps.id;
    const contentKey = 'content-' + stepProps.id;

    return (
      <>
        <ContentTitleElementAs key={contentTitleKey} className={this._classNames.contentTitle}>
          {stepProps.wizardContent?.contentTitleElement}
        </ContentTitleElementAs>
        <div key={contentKey} className={this._classNames.content}>
          {stepProps.wizardContent?.content}
        </div>
      </>
    );
  }

  private _toggleCallout(): void {
    const { collapsibleProps } = this.props;
    const { isCalloutExpanded: isCollapsibleExpanded } = this.state;

    this.setState({ isCalloutExpanded: !isCollapsibleExpanded });

    if (collapsibleProps?.onToggle) {
      collapsibleProps.onToggle(isCollapsibleExpanded);
    }
  }

  private _onCalloutDismiss(): void {
    const { calloutProps } = this.props;

    this.setState({ isCalloutExpanded: false, hideCalloutOverFlow: true });

    if (calloutProps?.onDismiss) {
      calloutProps.onDismiss();
    }
  }

  private _onCalloutPositioned(positions?: ICalloutPositionedInfo): void {
    const { calloutProps } = this.props;

    this.setState({ hideCalloutOverFlow: false });

    if (calloutProps?.onPositioned) {
      calloutProps.onPositioned(positions);
    }
  }

  /**
   * Default function in the event the one passed from props is undefined.
   */
  private _defaultIsNarrowChanged(): void {
    // No Op
  }

  private _updateScrollBarPresence(): void {
    if (this._contentSectionRef.current !== undefined && this._contentSectionRef.current !== null) {
      const { isContentScrollBarPresent } = this.state;

      if (
        shouldHideScrollBarPresence(
          this._contentSectionRef.current.scrollHeight,
          this._contentSectionRef.current.clientHeight,
          isContentScrollBarPresent
        )
      ) {
        // if the scrollable area is less than the client height,
        // don't account for the scroll bar presence in our styles.
        this.setState({ isContentScrollBarPresent: false });
      } else if (
        shouldShowScrollBarPresence(
          this._contentSectionRef.current.scrollHeight,
          this._contentSectionRef.current.clientHeight,
          isContentScrollBarPresent
        )
      ) {
        // the scroll bar is present, so we should account for it in our styles.
        this.setState({ isContentScrollBarPresent: true });
      }
    }
  }
}