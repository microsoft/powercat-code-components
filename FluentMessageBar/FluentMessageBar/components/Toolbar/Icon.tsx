import * as React from 'react';
import { FluentIconName } from '../FluentIcon.types';
import { FluentIcon } from '../fluentIcon';

export function getFluentIcon(iconName: string, iconType: string | undefined, fontSize?: number | null): JSX.Element {
    const fluentIconName = `${iconName}${iconType ?? ''}` as FluentIconName;
    const fluentIconProps = { style: { flexShrink: 0 }, fontSize: fontSize && fontSize !== 0 ? fontSize : '15px' };

    return <FluentIcon fluentIconName={fluentIconName} fluentIconProps={fluentIconProps} />;
}
