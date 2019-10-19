import React from 'react';
import './App.css';
import MessageList from './MessageList';
import Toolbar from './Toolbar';
import ComposeForm from './ComposeForm';
import {getAllMessages,toggleStar,markMessageRead,deleteMessages,editLabels,createMessage} from './requests';

class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = 
        {
            messages: [],
            checkedMessages: [],
            starredMessages: [],
            compose: false
        };
    }

    componentDidMount() {
        getAllMessages().then(data => this.setState(
            {
                messages: data,
                checkedMessages: []
            }
        ));
    }

    getupdatedCheckedMessages() {
        return this.state.checkedMessages.map(checkedMessage => this.state.messages.find(message => checkedMessage.id === message.id))
    }

    handleBulkSelect = () => {
        //mark all messages as selected and correctls set checkedMessages
        const messages = this.state.messages.map(message => {
            return {
                ...message,
                selected: this.state.messages.map(message => this.getupdatedCheckedMessages().includes(message)).every(curr => curr) ? false : true
            }
        });
        this.setState(
            {
                messages: messages,
                checkedMessages: this.state.messages.map(message => this.getupdatedCheckedMessages().includes(message)).every(curr => curr) ? [] : messages
            }
        );
    }

    handleCheck = (id, checked) => {
        //update selected for given message in messages before using messages array
        const messages = this.state.messages.map(message => {
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
        const checkedMessage = messages.filter(message => message.id === id)[0];
        const checkedMessages = this.getupdatedCheckedMessages();
        const index = checkedMessages.findIndex(message => message.id === id);
        index < 0 ? checkedMessages.push(checkedMessage) : checkedMessages.splice(index,1);

        this.setState(
            {
                messages: messages,
                checkedMessages: [...checkedMessages]
            }
        );
    }

    handleStar = (id) => {
        toggleStar(this.state.messages.filter(message => message.id === id).map(message => message.id))
        .then(data => this.setState({messages: data}));
    }

    markMessagesRead = () => {
        const messageIdsToUpdate = this.state.messages.filter(message => this.getupdatedCheckedMessages().includes(message)).map(message => message.id);
        markMessageRead(messageIdsToUpdate, true).then(data => this.setState({messages: data}));
    }

    markMessagesUnread = () => {
        const messageIdsToUpdate = this.state.messages.filter(message => this.getupdatedCheckedMessages().includes(message)).map(message => message.id);
        markMessageRead(messageIdsToUpdate, false).then(data => this.setState({messages: data}));
    }

    deleteMessages = () => {
        const messageIdsToUpdate = this.state.messages.filter(message => this.getupdatedCheckedMessages().includes(message)).map(message => message.id);
        deleteMessages(messageIdsToUpdate).then(data => this.setState({messages: data, checkedMessages: []}));
    }

    addLabels = (label) => {
        const messageIdsToUpdate = this.state.messages
        .filter(message => this.getupdatedCheckedMessages().includes(message) && (message.labels.findIndex(currLabel => currLabel === label) < 0))
        .map(message => message.id);

        editLabels(messageIdsToUpdate, true, label)
        .then(data => this.setState({
            messages: data.map(message => {
                return {
                    ...message,
                    lablels: message.labels.sort()
                }
            })
        }));
    }

    removeLabels = (label) => {
        let messageIdsToUpdate = this.state.messages.filter(message => this.getupdatedCheckedMessages().includes(message) && message.labels.includes(label))
        .map(message => message.id);
        editLabels(messageIdsToUpdate, false, label)
        .then(data => this.setState({
            messages: data.map(message => {
                return {
                    ...message,
                    lablels: message.labels.sort()
                }
            })
        }));
    }

    handleCompose = () => {
        this.setState({compose: !this.state.compose});
    }

    handleComposeSubmit = (subject, body) => {
        createMessage(subject, body)
        .then(data => this.setState({
            compose: !this.state.compose,
            messages: [...this.state.messages, data]
        }));
    }

    render() {
        const unreadMessageCount = this.state.messages.reduce((count, message) => !message.read ? count + 1 : count, 0);
        const checkedMessages = this.getupdatedCheckedMessages();

        return (
            <div className="wrapper">
                <Toolbar 
                    handleBulkSelect={this.handleBulkSelect} 
                    markMessagesRead={this.markMessagesRead} 
                    markMessagesUnread = {this.markMessagesUnread}
                    deleteMessages = {this.deleteMessages}
                    addLabels = {this.addLabels}
                    removeLabels = {this.removeLabels}
                    numberOfCheckedMessages={checkedMessages.length} 
                    allChecked={checkedMessages.length === this.state.messages.length}
                    unreadCount={unreadMessageCount}
                    handleCompose={this.handleCompose}
                />
                {this.state.compose &&
                    <ComposeForm handleComposeSubmit ={this.handleComposeSubmit} />
                }
                <MessageList 
                    handleCheck={this.handleCheck}
                    handleStar={this.handleStar} 
                    messages={this.state.messages} 
                    checkedMessages={checkedMessages}
                />
            </div>
        );
    }
}

export default App;
