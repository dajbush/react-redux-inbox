import React from 'react';
import Message from './Message';

const MessageList = (props) => {
    return props.messages.map(message => {
        return (
            <Message 
                key={message.id} 
                handleCheck={props.handleCheck} 
                handleStar={props.handleStar} 
                message={message} 
                isChecked={props.checkedMessages.includes(message) ? true : false}
                starred={message.starred}
            />
        );
    });
}

export default MessageList;