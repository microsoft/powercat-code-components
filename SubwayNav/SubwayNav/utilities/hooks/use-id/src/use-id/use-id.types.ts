// @ts-nocheck
export type UseIDArgs = {
    prefix?: string;
    postfix?: string;
};

export type UseId = (args?: UseIDArgs, depArray?: unknown[]) => string;
export type UseSimpleId = (idPrefix?: string) => string;
