// @ts-nocheck
import type { IIconRecord, IProcessedStyleSet } from '@fluentui/react';
import { buttonProperties, classNamesFunction, getIcon, getNativeProps } from '@fluentui/react';
import type { ReactNode } from 'react';
import * as React from 'react';

import { getIconMap } from './subway-node.styles';
import type { ISubwayNavNodeProps, ISubwayNavNodeStyleProps, ISubwayNavNodeStyles } from './subway-node.types';
import { SubwayNavNodeState } from './subway-node.types';

const getClassNames = classNamesFunction<ISubwayNavNodeStyleProps, ISubwayNavNodeStyles>();

export class SubwayNodeBase extends React.Component<ISubwayNavNodeProps> {
    public static defaultProps = {
        state: SubwayNavNodeState.Current,
        isSubStep: false,
        disabled: false,
    };

    public constructor(props: ISubwayNavNodeProps) {
        super(props);
        this._onClickStep = this._onClickStep.bind(this);
    }

    public render(): JSX.Element {
        const {
            styles,
            isSubStep,
            disabled = false,
            isVisuallyDisabled = false,
            state,
            itemIcon,
            itemColor,
            subSteps,
            index,
            rootAs,
            onRenderStep = this._onRenderStep,
            theme,
            onRenderStepIcon = this._onRenderStepIcon,
        } = this.props;

        const iconMap = getIcon(getIconMap(isSubStep ?? false, itemIcon)[state]);
        const iconRecord: IIconRecord | undefined = iconMap || getIcon(getIconMap(isSubStep ?? false, "")[state]);

        const buttonProps = getNativeProps<React.ButtonHTMLAttributes<HTMLButtonElement>>(this.props, buttonProperties);

        const classNames = getClassNames(styles, {
            isSubStep: isSubStep!,
            disabled: disabled,
            isVisuallyDisabled: disabled && isVisuallyDisabled,
            state,
            itemIcon,
            itemColor,
            iconRecord: iconRecord!,
            hasSubSteps: subSteps ? subSteps.length > 0 : false,
            index: index!,
            theme: theme!,
        });

        const RootElement = rootAs ?? 'button';

        return (
            <RootElement
                className={classNames.root}
                data-is-focusable={!disabled}
                {...buttonProps}
                {...(!disabled && { onClick: this._onClickStep })}
            >
                {onRenderStep(this.props, classNames, iconRecord, onRenderStepIcon)}
            </RootElement>
        );
    }

    private _onRenderStep = (
        props: ISubwayNavNodeProps,
        classNames: IProcessedStyleSet<ISubwayNavNodeStyles>,
        iconRecord?: IIconRecord,
        onRenderStepIcon?: ISubwayNavNodeProps['onRenderStepIcon'],
    ): ReactNode => {
        const { label } = props;

        return (
            <>
                {onRenderStepIcon?.(props, classNames, iconRecord)}
                <div className={classNames.spacer} />
                <div className={classNames.labelWrapper}>
                    <div className={classNames.label}>{label}</div>
                    <div className={classNames.labelSelected} aria-hidden={true}>
                        {label}
                    </div>
                </div>
            </>
        );
    };

    private _onClickStep = (): void => {
        this.props.onClickStep?.(this.props);
    };

    private _onRenderStepIcon = (
        props: ISubwayNavNodeProps,
        classNames: IProcessedStyleSet<ISubwayNavNodeStyles>,
        iconRecord: IIconRecord | undefined,
    ): JSX.Element => {
        const { isSubStep, state } = props;

        const isIconOnly =
            isSubStep &&
            (state === SubwayNavNodeState.Error ||
                state === SubwayNavNodeState.Completed ||
                state === SubwayNavNodeState.WizardComplete);

        const strokeRadius = isSubStep ? '18%' : '43%';

        return (
            <svg
                viewBox="0 0 16 16"
                className={classNames.iconContainer}
                aria-label={props.iconAriaLabel}
                xmlns="http://www.w3.org/2000/svg"
            >
                {iconRecord && (
                    <>
                        {!isIconOnly && (
                            <circle r={strokeRadius} cx="50%" cy="50%" className={classNames.iconBackPlate} />
                        )}
                        <text x="50%" y="50%" dy="0.5em" textAnchor="middle" className={classNames.icon}>
                            {iconRecord.code}
                        </text>
                    </>
                )}
                {!isIconOnly && <circle r={strokeRadius} cx="50%" cy="50%" className={classNames.iconRing} />}
            </svg>
        );
    };
}
