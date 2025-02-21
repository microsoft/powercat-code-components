// @ts-nocheck
import type { IColor } from '@fluentui/react';
import { getColorFromString, updateA } from '@fluentui/react';

/**
 * Converts a hex color to an rgba value. This is useful when
 * we want to change the opacity of a theme color, which come
 * as hex. Note that IE and Edge don't yet support 8 digit
 * hex values so you'll need to use this any time you're trying to
 * change the opacity of a theme color
 *
 * @param hexColor The original 6 digit hex value
 * @param alphaValue The alpha value you'd like to assign, ie: 20 for 20%
 *  */
export function addAlphaChannelToHex(hexColor: string, alphaValue: number): string {
    const fabricColor: IColor | undefined = getColorFromString(hexColor);

    if (fabricColor) {
        return updateA(fabricColor, alphaValue).str;
    }

    return hexColor;
}
