import type { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
// import type {
//   NarrowedPropertiesReq,
//   NarrowedPropertyKeysReq,
// } from '../../../utilities/';

export type NarrowedPropertyKeysReq<T, V> = {
    [P in keyof Required<T>]: T[P] extends V ? P : never;
}[keyof T];

export type NarrowedPropertiesReq<T, V> = {
    [P in keyof Required<T>]: T[P] extends V ? P : never;
};

/**
 * Warns in the console if a consumer has passed styles to a subComponent
 * via subComponent props, instead of the styles prop on the parent component,
 * because these will overwrite the default (or any provided) styles provided
 * via the styles prop. Can also check a different prop name, if provided.
 * @param componentName The current component's name
 * @param subComponentName The subComponent's name whose props are being checked
 * @param subComponentProps The subComponent props to check
 * @param propNameToCheck The prop names which should cause a warning if they are present
 */

export function checkStyleProps<
    K extends NarrowedPropertyKeysReq<T, StylesProp>,
    StylesProp extends IStyleFunctionOrObject<unknown, { [key: string]: IStyle }> | undefined,
    T extends Pick<T, NarrowedPropertiesReq<T, StylesProp>>,
>(
    componentName: string,
    subComponentName: string,
    subComponentProps?: T,
    propNameToCheck: K = 'styles' as K,
    isNoOp?: boolean,
) {
    if (subComponentProps?.[propNameToCheck]) {
        const noOpOrOverride = isNoOp
            ? 'These styles will be no-op.'
            : 'This will completely override the default styles.';

        console.warn(
            `[Admin Controls: ${componentName}] It looks like you've passed in styles via ${subComponentName} ${String(
                propNameToCheck,
            )} props. ${noOpOrOverride} Please prefer styles.subComponentStyles.${subComponentName}.`,
        );
    }
}
