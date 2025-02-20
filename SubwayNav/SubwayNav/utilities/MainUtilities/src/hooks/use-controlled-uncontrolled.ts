// @ts-nocheck
import type { Dispatch } from 'react';
import * as React from 'react';

import type { NarrowedPropertyKeys } from '../type-helpers/narrow-properties';

// 100% coverage as of 10/7/2020

const { useState, useCallback } = React;

/**
 * React hook designed to replace boiler plate code that manages when a component prop should be controlled
 * or uncontrolled. Typically this is a bit tricky as you need to manage both internal state, callbacks and
 * decided which prop to respect. This hook does all that for you.
 * @param props the props of the consuming component
 * @param controlledKey the key of the prop that should be used as a controlled prop
 * @param uncontrolledKey the key of the prop that should be used as a default value in the uncontrolled state
 * @param initialValue the initial value to set on the internal state (could be different than the default value prop)
 */
export const useControlledUncontrolled = <T, PropType>(
    props: T,
    controlledKey: NarrowedPropertyKeys<T, PropType>,
    uncontrolledKey: NarrowedPropertyKeys<T, PropType>,
    initialValue: PropType,
): [PropType, Dispatch<PropType>] => {
    // We have to cast to unknown here unfortunately
    const controlledValue = props[controlledKey] as unknown as PropType | undefined;
    const uncontrolledValue = props[uncontrolledKey] as unknown as PropType | undefined;

    // Set the initial value based on whether or not the controlled prop is passed in or not
    const [value, setValueInternal] = useState<PropType>(uncontrolledValue ?? initialValue);

    // We should only update internal state with this method if the prop is uncontrolled
    const setValue = useCallback(
        (valuePassThrough: PropType) => {
            if (controlledValue === undefined) {
                setValueInternal(valuePassThrough);
            }
        },
        [controlledValue],
    );

    // return the proper calculated value based on controlled/uncontrolled props and the setter
    // essentially we just pass controlled through if it's set.
    return [controlledValue ?? value, setValue];
};
