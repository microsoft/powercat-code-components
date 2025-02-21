// @ts-nocheck
import { getId } from '@fluentui/react';
import { useMemo } from 'react';

import type { UseId, UseSimpleId } from './use-id.types';

export const useId: UseId = (options, depArray) => {
    const prefixStr = options?.prefix ? `${options.prefix}--` : '';
    const postfixStr = options?.postfix ? `--${options.postfix}` : '';

    return useMemo(() => `${prefixStr}${getId()}${postfixStr}`, depArray ?? []);
};

export const useSimpleId: UseSimpleId = (idPrefix?: string) => {
    const prefixStr = idPrefix ? `${idPrefix}--` : '';

    return useMemo(() => `${prefixStr}${getId()}`, []);
};
