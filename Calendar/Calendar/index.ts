import { IInputs, IOutputs } from './generated/ManifestTypes';
import { CanvasCalendar } from './components/Calendar';
import { ICalendarProps } from './components/Component.types';
import * as React from 'react';
import { ContextEx } from './ContextExtended';
import { InputEvents } from './ManifestConstants';

export class Calendar implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    context: ComponentFramework.Context<IInputs>;
    selectedDateValue: Date;
    focusKey = '';
    inputEvent?: string | null;

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
        this.context.mode.trackContainerResize(true);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const inputEvent = this.context.parameters.InputEvent.raw;
        const eventChanged = inputEvent && this.inputEvent !== inputEvent;

        if (eventChanged && inputEvent.startsWith(InputEvents.SetFocus)) {
            // Simulate SetFocus until this is unlocked by the platform
            this.focusKey = inputEvent;
        }

        // The test harness provides width/height as strings
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);
        const tabIndex = (context as unknown as ContextEx).accessibility?.assignedTabIndex ?? undefined;
        const ariaLabel = context.parameters?.AccessibilityLabel.raw ?? '';
        const props: ICalendarProps = {
            width: allocatedWidth,
            height: allocatedHeight,
            onSelected: this.onSelect,
            themeJSON: context.parameters?.Theme.raw ?? '',
            setFocus: this.focusKey,
            selectedDateValue: context.parameters?.SelectedDateValue.raw ?? new Date(),
            minDate: context.parameters?.MinDate.raw ?? undefined,
            maxDate: context.parameters?.MaxDate.raw ?? undefined,
            tabIndex: tabIndex,
            showGoToToday: context.parameters?.ShowGoToToday.raw,
            monthPickerVisible: context.parameters?.MonthPickerVisible.raw,
            dayPickerVisible: context.parameters?.DayPickerVisible.raw,
            firstDayOfWeek: context.parameters?.FirstDayOfWeek.raw,
            highlightSelectedMonth: context.parameters?.HighlightSelectedMonth.raw,
            highlightCurrentMonth: context.parameters?.HighlightCurrentMonth.raw,
            showSixWeeksByDefault: context.parameters?.ShowSixWeeksByDefault.raw,
            showWeekNumbers: context.parameters?.ShowWeekNumbers.raw,
            isDisabled: context.mode.isControlDisabled,
            ariaLabel: ariaLabel,
            backgroundColor: context.parameters.BackgroundColor.raw ?? '#ffffff',
        };
        return React.createElement(CanvasCalendar, props);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {
            SelectedDateValue: this.selectedDateValue ?? null,
        } as IOutputs;
    }

    onSelect = (selectedDateValue: Date): void => {
        this.selectedDateValue = selectedDateValue;
        this.notifyOutputChanged();
    };

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
