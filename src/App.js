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
            compose: false
        };
    }

    componentDidMount() {
        getAllMessages().then(data => this.setState({messages: data}));
    }

    handleBulkSelect = () => {
        this.setState({
            checkedMessages: this.state.checkedMessages.length === this.state.messages.length ? [] : this.state.messages.map(message => message.id)
        })
    }

    handleCheck = (id) => {
        const checkedMessages = this.state.checkedMessages.slice();
        const index = checkedMessages.findIndex(messageId => messageId === id);
        index < 0 ? checkedMessages.push(id) : checkedMessages.splice(index,1);
        this.setState({checkedMessages: checkedMessages})
    }

    handleStar = (id) => {
        toggleStar(this.state.messages.filter(message => message.id === id).map(message => message.id))
        .then(data => this.setState({messages: data}));
    }

    markMessagesRead = (read) => {
        markMessageRead(this.state.checkedMessages, read).then(data => this.setState({messages: data}));
    }

    deleteMessages = () => {
        deleteMessages(this.state.checkedMessages).then(data => this.setState({messages: data, checkedMessages: []}));
    }

    addLabels = (label) => {
        const messageIdsToUpdate = this.state.messages
        .filter(message => this.state.checkedMessages.includes(message.id) && (message.labels.findIndex(currLabel => currLabel === label) < 0))
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
        const messageIdsToUpdate = this.state.messages
        .filter(message => this.state.checkedMessages.includes(message.id) && message.labels.includes(label))
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
        return (
            <div className="wrapper">
                <Toolbar 
                    handleBulkSelect={this.handleBulkSelect} 
                    markMessagesRead={this.markMessagesRead} 
                    deleteMessages = {this.deleteMessages}
                    addLabels = {this.addLabels}
                    removeLabels = {this.removeLabels}
                    numberOfCheckedMessages={this.state.checkedMessages.length} 
                    allChecked={this.state.checkedMessages.length === this.state.messages.length}
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
                    checkedMessages={this.state.checkedMessages}
                />
            </div>
        );
    }
}

export default App;
