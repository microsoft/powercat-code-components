// @ts-nocheck
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import * as React from 'react';

import { useIntersectionObserver } from './use-intersection-observer';

const { useRef, useState } = React;

// 100% coverage as of 10/22/2020

/**
 * React hook designed to give a consuming component the number of elements that are out of view. Based on
 * useIntersectionObserver. Additionally, it culls the list of observed elements to ensure all are in the DOM
 * @param observerOptions optional setup values to pass into the IntersectionObserver
 * @param overflowItem optional ref to an element that handles overflow e.g. a more menu or overflow link. This is
 * useful when the overflow item is hidden due to smaller view-ports but an additional item is not hidden. The obscured
 * count also takes this into consideration so a consuming component can compensate without additional logic or renders
 * @returns an array that includes the obscured count, a callback to set the observed list of elements, and a callback
 * to update the init params for the internal IntersectionObserver
 */
export const useObscuredElements = (
    observerOptions?: IntersectionObserverInit,
    overflowItem?: MutableRefObject<Element | undefined>,
): [
    number,
    Dispatch<MutableRefObject<Element[]>>,
    Dispatch<SetStateAction<IntersectionObserverInit | undefined>>,
    MutableRefObject<IntersectionObserver | undefined>,
] => {
    const [obscuredCount, setObscuredCount] = useState(0);
    const obscuredValues = useRef<Element[]>([]);

    /**
     * Put our obscured count into a ref so we can access it without holding a hard ref to a value
     * We also use this technique so we don't have to update our callbacks as that requires dumping the IO instance
     * and re-instantiating it
     */
    const obscuredCountRef = useRef({ obscuredCount });

    obscuredCountRef.current = { obscuredCount };

    const useAltIndexRef = useRef({ useAltIndex: false });

    const [setObserverListInternal, setObserverInit, observer] = useIntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (
                    entry.target === overflowItem?.current &&
                    useAltIndexRef.current.useAltIndex !== !entry.isIntersecting
                ) {
                    useAltIndexRef.current = { useAltIndex: !entry.isIntersecting };
                }

                if (entry.target !== overflowItem?.current) {
                    if (entry.isIntersecting) {
                        const entryIndex = obscuredValues.current.indexOf(entry.target);

                        if (entryIndex !== -1) {
                            obscuredValues.current.splice(entryIndex, 1);
                        }
                    } else if (!obscuredValues.current.includes(entry.target)) {
                        obscuredValues.current.push(entry.target);
                    }
                }
            });
            cleanupRemovedElements(obscuredValues, (cleanElements) => {
                obscuredValues.current = cleanElements;
            });

            /**
             * Only update our state when the value actually changes or we have a dirty state
             * Additionally we should ensure we don't use the alternate values when they shouldn't be applied (0 overflow)
             */
            const applyAltVal =
                useAltIndexRef.current.useAltIndex &&
                obscuredValues.current.length !== 0 &&
                obscuredCountRef.current.obscuredCount !== 0;

            if (
                (!applyAltVal && obscuredCountRef.current.obscuredCount !== obscuredValues.current.length) ||
                (applyAltVal && obscuredCountRef.current.obscuredCount !== obscuredValues.current.length + 1)
            ) {
                setObscuredCount(
                    // If there are no obscured values don't use the alternative value
                    applyAltVal ? obscuredValues.current.length + 1 : obscuredValues.current.length,
                );
            }
        },
        observerOptions,
    );

    // Wrap the call to setObserverList and cull the refs passed in.
    const setObserverList: Dispatch<MutableRefObject<Element[]>> = (valueRefs: MutableRefObject<Element[]>) => {
        cleanupRemovedElements(valueRefs, (cleanElements) => {
            valueRefs.current = cleanElements;
        });
        setObserverListInternal(valueRefs.current);
    };

    return [obscuredCount, setObserverList, setObserverInit, observer];
};

// filter to check that an element has a parent which lets us know that it's in the DOM
const filterHasParent = (element: Element) => {
    return element.parentElement;
};

// function to filter out only elements in the dom and call a callback
const cleanupRemovedElements = (
    elements: MutableRefObject<Element[]>,
    changeCallback: (cleanElements: Element[]) => void,
) => {
    const displayedElements = elements.current.filter(filterHasParent);

    changeCallback(displayedElements);
};
