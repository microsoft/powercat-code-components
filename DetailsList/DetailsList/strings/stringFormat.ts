export function stringFormat(template: string, ...args: string[]): string {
    for (const k in args) {
        template = template.replace('{' + k + '}', args[k]);
    }
    return template;
}
