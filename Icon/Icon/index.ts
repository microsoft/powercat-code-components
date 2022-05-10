import * as React from 'react';
import { ContextEx } from '../ContextExtended';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { IconComponent, IconComponentProps } from './IconComponent';
import { InputEvents, RenderTypes, TextAlignmentTypes } from './ManifestTypes';

export class Icon implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private container: HTMLDivElement;
    private outputEvent = '';
    private focusKey = '';
    private inputEvent?: string | null;
    private notifyOutputChanged: () => void;

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement,
    ): void {
        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;
        context.mode.trackContainerResize(true);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        // The test harness provides width/height as strings
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);
        const tabIndex = (context as unknown as ContextEx).accessibility?.assignedTabIndex ?? undefined;
        const inputEvent = context.parameters.InputEvent.raw;
        const eventChanged = inputEvent && this.inputEvent !== inputEvent;

        if (eventChanged && inputEvent.startsWith(InputEvents.SetFocus)) {
            // Simulate SetFocus until this is unlocked by the platform
            this.focusKey = inputEvent;
        }
        return React.createElement<IconComponentProps>(IconComponent, {
            tabIndex: tabIndex,
            width: allocatedWidth,
            height: allocatedHeight,
            setFocus: this.focusKey,
            disabled: context.mode.isControlDisabled === true,
            themeJSON: undefinedIfEmpty(context.parameters.Theme),
            onSelected: this.onSelect,
            iconName: defaultIfEmpty(context.parameters.IconName, 'emoji2'),
            text: defaultIfEmpty(context.parameters.Text, ''),
            justify: TextAlignmentTypes[context.parameters.TextAlignment.raw],
            renderType: RenderTypes[context.parameters.IconType.raw],
            iconColor: undefinedIfEmpty(context.parameters.IconColor),
            iconSize: undefinedIfZero(context.parameters.IconSize),
            hoverIconColor: undefinedIfEmpty(context.parameters.HoverIconColor),
            fontSize: undefinedIfZero(context.parameters.FontSize),
            fontColor: undefinedIfEmpty(context.parameters.FontColor),
            hoverFontColor: undefinedIfEmpty(context.parameters.HoverFontColor),
            borderColor: undefinedIfEmpty(context.parameters.BorderColor),
            hoverBorderColor: undefinedIfEmpty(context.parameters.HoverBorderColor),
            borderRadius: undefinedIfEmpty(context.parameters.BorderRadius),
            fillColor: undefinedIfEmpty(context.parameters.FillColor),
            hoverFillColor: undefinedIfEmpty(context.parameters.HoverFillColor),
            ariaLabel: undefinedIfEmpty(context.parameters.AccessibilityLabel),
        });
    }

    public getOutputs(): IOutputs {
        return {
            OutputEvent: this.outputEvent,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public destroy(): void {}

    onSelect = (): void => {
        this.outputEvent = 'OnSelect';
        this.notifyOutputChanged();
    };
}

function undefinedIfEmpty(property: ComponentFramework.PropertyTypes.Property) {
    return defaultIfEmpty(property, undefined);
}

function defaultIfEmpty<T>(property: ComponentFramework.PropertyTypes.Property, defaultValue: T) {
    return (property.raw as T) ? property.raw : defaultValue;
}

function undefinedIfZero(property: ComponentFramework.PropertyTypes.Property) {
    return property.raw && property.raw > 0 ? property.raw : undefined;
}
