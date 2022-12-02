import { getRTL } from '@fluentui/react';

export const getRTLFlipOptOut = (): string => (getRTL() ? '@noflip' : '');
