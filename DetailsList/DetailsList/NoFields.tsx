import { Icon, Overlay, Stack } from '@fluentui/react';
import React from 'react';

export interface NoFieldsProps {
    resources: ComponentFramework.Resources;
}
export const NoFields = React.memo((props: NoFieldsProps): React.ReactElement => {
    const resources = props.resources;
    return (
        <Overlay>
            <Stack
                tokens={{ padding: 8, childrenGap: 8 }}
                style={{ color: '#575757', textAlign: 'center' }}
                horizontalAlign={'center'}
            >
                <Icon iconName="CheckList" style={{ fontSize: 40 }} />
                <Stack.Item>{resources.getString('Message_NoFieldsConfigured')}</Stack.Item>
                <Stack.Item>{resources.getString('Message_ChooseFields')}</Stack.Item>
            </Stack>
        </Overlay>
    );
});

NoFields.displayName = 'NoFields';
