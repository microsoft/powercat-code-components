// @ts-nocheck
import type { ISettingsMap } from '@fluentui/react';
import { warn } from '@fluentui/react';

/**
 * Warns when two props which are mutually exclusive are both being used.
 *
 * @public
 * @param componentName - The name of the component being used.
 * @param props - The props passed into the component.
 * @param dependentMap - A map where the key is a dependent prop, and the value is the required prop.
 */
export function warnDependent<P>(componentName: string, props: P, dependentMap: ISettingsMap<P>): void {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
        for (const propName in dependentMap) {
            if (props && propName in props) {
                const propInDependentMapValue = dependentMap[propName];

                // @ts-ignore propInDependentMapValue is a string
                if (propInDependentMapValue && !(propInDependentMapValue in props)) {
                    warn(
                        `${componentName} property '${propName}' is no-op without '${
                            dependentMap[propName] ?? ''
                        }' also set.`,
                    );
                }
            }
        }
    }
}
