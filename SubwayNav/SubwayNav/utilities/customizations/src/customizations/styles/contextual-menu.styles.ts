// @ts-nocheck
import type { IContextualMenuStyleProps, IContextualMenuStyles } from '@fluentui/react';

/**This style used to assign nuetralPrimary color to menu item icons, we're now removing that to align with Fluent */
/**
 * @deprecated Since this style no longer has any value, we recomend removing any dependencies on it.
 */
export const ContextualMenuStyles = (props: IContextualMenuStyleProps): Partial<IContextualMenuStyles> => {
    return {};
};
