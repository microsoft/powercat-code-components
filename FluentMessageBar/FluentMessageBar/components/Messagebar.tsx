import * as React from 'react';
import { DismissRegular } from '@fluentui/react-icons';
import { ToolbarComponent } from './Toolbar/ToolbarComponent';
import useResizeObserver from '@react-hook/resize-observer';
import { Button, Link, MessageBar, MessageBarActions, MessageBarBody, MessageBarTitle } from '@fluentui/react-components';
import { IMessagebar } from './IMessagebar';

export const MessageBarComponent: React.FunctionComponent<IMessagebar> = (props) => {
    const {
        onResize
    } = props;

    const target = React.useRef<HTMLDivElement>(null);
    useResizeObserver(target, (entry) => {
        if (onResize) onResize(entry.contentRect.width, entry.contentRect.height+12);
    });

    return (
        <MessageBar intent={props.messageBarIntent} ref={target} shape={props.messageBarShape}>
            <MessageBarBody>
                <MessageBarTitle>{props.title} </MessageBarTitle>
                {props.body}{' '}
                <Link href={props.Url} style={props.disabled ? { cursor: 'default', pointerEvents: 'none' } : { cursor: 'pointer', textDecoration: 'underline', color: 'RGBA(17, 94, 163, 1)' }}

                    target="_blank">{props.linkText}</Link>

            </MessageBarBody>
            {!props.hideDismiss ?
                <MessageBarActions
                    containerAction={
                        <Button style={props.disabled ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
                            aria-label="dismiss" onClick={props.OnDismiss}//{handleClick}
                            appearance="transparent"
                            icon={<DismissRegular />}
                        />
                    }

                >

                    {props.items.length > 0 ? <ToolbarComponent
                        layout={'before'}
                        disabled={props.disabled}
                        items={props.items}
                        //width={200}
                        onSelected={props.onSelected}
                        getPopoverRoot={props.getPopoverRoot}
                    /> : ('')}
                </MessageBarActions> :
                <MessageBarActions>
                    {props.items.length > 0 ? <ToolbarComponent
                        layout={'before'}
                        disabled={props.disabled}
                        items={props.items}
                        //width={200}
                        onSelected={props.onSelected}
                        getPopoverRoot={props.getPopoverRoot}
                    /> : ('')}
                </MessageBarActions>
            }
        </MessageBar>
    );
};

export default MessageBarComponent;