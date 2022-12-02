export function throwOnUndefinedColor(
    desiredColor: string | undefined,
    desiredColorName: string,
    callingComponentName: string,
): string {
    if (!desiredColor) {
        throw new Error(
            `M365Theme error: It looks like the app tried to reference a theme color that didn't exist.\n
      Double check you're consuming a M365Theme (a super set of Fabric ITheme) and that it has assigned the extension slot.\n
      There's also a chance you've loaded multiple themes into the context. Run __packages__ in your web console and if you see multiple instances of OUIFR or Fluent, that might be the case.
      Undefined extension slot: ${desiredColorName}\n
      Calling component: ${callingComponentName}\n
      'For more information, please visit https://uifabric.visualstudio.com/iss/_git/m365-admin/?path=%2Fdocs%2FnextGenThemeSystem.md&version=GBmaster';

`,
        );
    }

    return desiredColor;
}
