/**
 * Throws a warning when not in production environments.
 *
 * @public
 * @param message - Message to display.
 */
export function warnOutOfProd(message: string): void {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
        console.warn(message);
    }
}
