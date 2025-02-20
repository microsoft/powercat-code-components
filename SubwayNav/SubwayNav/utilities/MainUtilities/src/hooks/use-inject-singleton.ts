// @ts-nocheck
import { getId } from '@fluentui/react';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

export interface IUseInjectOnce {
    (
        /**
         * ReactNode to append to the body.
         */
        toInject: ReactNode,

        /**
         * Id to track. This is useful if the consumer wants to track the injectable instance across multiple
         * components. If that is the case, it is up to the consumer to ensure that the id and the node are identical.
         * Creating an additional wrapper is recommended.
         */
        id: string,
    ): void;
}

const tracker = new Map<string, Map<string, boolean>>();

/**
 * `makeInjectSingleton` returns a reusable singleton injector function that can be used across different components
 * and will still return only one instance. The returned function takes a `ReactNode` and appends it to the body.
 * Important to note, that the parent component that uses the injector function needs to mount and unmount all the
 * instances at the same time to ensure the singleton is present at all times.
 *
 * ```tsx
 * const injectId = getId();
 * const injectOnce = makeInjectSingleton(injectId);
 *
 * const MyComponent = () => (
 *   <>
 *     <p>Hello</p>
 *     {injectOnce(
 *       <p>I will be appended to body only once no matter how many times MyComponent renders.</p>
 *     )}
 *   </>
 * )
 * ```
 *
 * @param id that is used to track the singleton globally in the application.
 * @returns useInjectSingleton function.
 */
export const makeInjectSingleton = (id: string) => (toInject: ReactNode) => useInjectSingleton(toInject, id);

/**
 * `useInjectSingleton` takes a `ReactNode` and an id and appends that `ReactNode` to the body as a singleton. If you
 * want to reuse that function in multiple components use `makeInjectSingleton`.
 *
 * @param id that is used to track the singleton globally in the application.
 * @param toInject `ReactNode` to append to the body.
 * @returns void.
 */
export const useInjectSingleton: IUseInjectOnce = (toInject, id) => {
    // (1) Global tracker
    if (!tracker.has(id)) {
        tracker.set(id, new Map<string, boolean>());
    }

    // (2) Instance tracker
    const instanceId = useMemo(() => getId('useInjectOnce__instance'), []);
    const instanceMap = useMemo(() => tracker.get(id) ?? new Map<string, boolean>(), [id]);

    instanceMap.set(instanceId, false);

    // (3) Cleaning up the tracker after instances unmount.
    useEffect(
        () => () => {
            instanceMap.delete(instanceId);
        },
        [instanceMap, instanceId],
    );

    // (4) Assigning the unique instance.
    if (!Array.from(instanceMap.values()).includes(true)) {
        instanceMap.set(instanceId, true);
    }

    // (5) Injecting the singleton.
    if (instanceMap.get(instanceId)) {
        return createPortal(toInject, document.body);
    }

    return;
};
