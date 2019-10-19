import React from 'react';
import Message from './Message';

class MessageList extends React.Component {

    render() {
        return this.props.messages.map(message => {
                return (
                    <Message key={message.id} handleCheck={this.props.handleCheck} handleStar={this.props.handleStar} message={message} />
                );
            });
    }
}

export default MessageList;