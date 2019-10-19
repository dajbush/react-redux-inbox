import React from 'react';
import './App.css';
import MessageList from './MessageList';
import Toolbar from './Toolbar';
import {getAllMessages} from './requests';

class App extends React.Component {
    
    state = {
        messages: [],
        checkedMessages: [],
        starredMessages: []
    };

    componentDidMount() {
        getAllMessages().then(data => this.setState(
            {
                messages: data,
                checkedMessages: data.filter(message => !!message.selected)
            }
        ));
    }

    handleBulkSelect = () => {
        //mark all messages as selected and add all to checkedMessages
        let allSelected = [...this.state.messages].map(message => !!message.selected).every(curr => curr);
        let messages = [...this.state.messages].map(message => {
            return {
                ...message,
                selected: allSelected ? false : true
            }
        });
        this.setState(
            {
                messages: messages,
                checkedMessages: allSelected ? [] : messages
            }
        );
    }

    handleCheck = (id, checked) => {
        //update selected for given message in messages 
        let messages = [...this.state.messages].map(message => {
            if(message.id === id) {
                return {
                    ...message,
                    selected: checked
                }
            }
            else {
                return message;
            }
        });

        //add checked message to array if it does not exist else remove it.
        let checkedMessage = messages.filter(message => message.id === id)[0];
        let checkedMessages = [...this.state.checkedMessages];
        let index = checkedMessages.findIndex(message => message.id === id);
        index < 0 ? checkedMessages.push(checkedMessage) : checkedMessages.splice(index,1);

        this.setState(
            {
                messages: messages,
                checkedMessages: [...checkedMessages]
            }
        );
    }

    handleStar = (id, starred) => {
        let messages = [...this.state.messages];
        this.setState({messages: messages.map(message => {
            if(message.id === id) {
                return {
                    ...message,
                    starred: starred
                }
            }
            else {
                return message;
            }
        })});
    }

    markMessagesRead = () => {
        let messages = [...this.state.messages];
        let checkedMessages = [...this.state.checkedMessages];
        console.log('mark these as read', this.state.checkedMessages);
        this.setState({
            messages: messages.map(message => {
                console.log('contains ', checkedMessages.includes(message));
                if(checkedMessages.includes(message)) {
                    message.read = true;
                }
                return message;
            })
        });
    }

    markMessagesUnread = () => {
        let messages = [...this.state.messages];
        let checkedMessages = [...this.state.checkedMessages];
        console.log('mark these as Unread', this.state.checkedMessages);
        this.setState({
            messages: messages.map(message => {
                console.log('contains ', checkedMessages.includes(message));
                if(checkedMessages.includes(message)) {
                    message.read = false;
                }
                return message;
            })
        });
    }

    deleteMessages = () => {
        let messages = [...this.state.messages];
        let checkedMessages = [...this.state.checkedMessages];
        console.log('delete these ', checkedMessages);

        // messages.filter(message => checkedMessages.includes(message));
        console.log('filtered ', messages.filter(message => !checkedMessages.includes(message)));
        this.setState({
            messages: messages.filter(message => !checkedMessages.includes(message)),
            checkedMessages: []
        });
    }

    addLabels = (label) => {
        console.log('label ', label);
        let messages = [...this.state.messages];
        let checkedMessages = [...this.state.checkedMessages];

        this.setState({
            messages: messages.map(message => {
                if(checkedMessages.includes(message)) {
                    let i = message.labels.findIndex(currLabel => currLabel === label);
                    if(i < 0) message.labels.push(label);
                    message.labels.sort();
                }
                return message;
            })
        })
    }

    removeLabels = (label) => {
        console.log('label ', label);
        let messages = [...this.state.messages];
        let checkedMessages = [...this.state.checkedMessages];

        this.setState({
            messages: messages.map(message => {
                if(checkedMessages.includes(message)) {
                    message.labels = message.labels.filter(currLabel => currLabel !== label).sort();
                }
                return message;
            })
        }); 
}

    render() {
        console.log('messages ', this.state.messages);
        console.log('checked messages ', this.state.checkedMessages);
        //calculate number of unread messages
        let unreadMessageCount = this.state.messages.slice().reduce((count, message) => !message.read ? count + 1 : count, 0);

        return (
            <div className="wrapper">
                <Toolbar 
                    handleBulkSelect={this.handleBulkSelect} 
                    markMessagesRead={this.markMessagesRead} 
                    markMessagesUnread = {this.markMessagesUnread}
                    deleteMessages = {this.deleteMessages}
                    addLabels = {this.addLabels}
                    removeLabels = {this.removeLabels}
                    numberOfCheckedMessages={this.state.checkedMessages.length} 
                    allChecked={this.state.checkedMessages.length === this.state.messages.length}
                    unreadCount={unreadMessageCount}
                />
                <MessageList handleCheck={this.handleCheck} handleStar={this.handleStar} messages={this.state.messages} />
            </div>
        );
    }
}

export default App;
