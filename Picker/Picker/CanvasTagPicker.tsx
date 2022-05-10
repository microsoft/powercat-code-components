/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import {
    BasePicker,
    IBasePickerStyleProps,
    IBasePickerStyles,
    initializeComponentRef,
    ITag,
    ITagPickerProps,
    styled,
} from '@fluentui/react';
import { getStyles } from './fluentui-fork/BasePicker.styles';

export interface ICanvasTagPickerProps extends ITagPickerProps {
    acceptFreeText?: boolean;
}
export class CanvasTagPickerBase extends BasePicker<ITag, ICanvasTagPickerProps> {
    constructor(props: ICanvasTagPickerProps) {
        super(props);
        initializeComponentRef(this);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected updateSuggestions(suggestions: any[]): void {
        // This is needed to override the default behaviour of the TagPicker so that when suggestions
        // are first shown, the first item is not selected by default - this allows the user
        // to press enter to accept the generic free-text item
        this.suggestionStore.updateSuggestions(suggestions, this.props.acceptFreeText ? -1 : 0);
        this.forceUpdate();
    }
}

export const CanvasTagPicker = styled<ICanvasTagPickerProps, IBasePickerStyleProps, IBasePickerStyles>(
    CanvasTagPickerBase,
    getStyles,
    undefined,
    {
        scope: 'TagPicker',
    },
);
