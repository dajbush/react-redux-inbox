import React from 'react';
import './App.css';
import MessageList from './MessageList';
import Toolbar from './Toolbar';
import {getAllMessages,toggleStar,markMessageRead,deleteMessages,editLabels} from './requests';

class App extends React.Component {
    
    state = {
        messages: [],
        checkedMessages: [],
        starredMessages: []
    };

    componentDidMount() {
        console.log("mount");
        getAllMessages().then(data => this.setState(
            {
                messages: data
            }
        ));
    }

    // componentWillUpdate() {
    //     console.log("update");
    //     // getAllMessages().then(data => this.setState(
    //     //     {
    //     //         messages: data,
    //     //         checkedMessages: data.filter(message => !!message.selected)
    //     //     }
    //     // ));
    // }

    handleBulkSelect = () => {
        //mark all messages as selected and add all to checkedMessages
        let checkedMessages = this.state.checkedMessages.slice().map(checkedMessage => this.state.messages.slice().find(message => checkedMessage.id === message.id));
        let allSelected = this.state.messages.slice().map(message => checkedMessages.includes(message)).every(curr => curr);

        let messages = this.state.messages.slice().map(message => {
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
        let messages = this.state.messages.slice().map(message => {
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
        let checkedMessages = this.state.checkedMessages.slice().map(checkedMessage => messages.find(message => checkedMessage.id === message.id));
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
        let messageIdsToUpdate = this.state.messages.slice().filter(message => message.id === id).map(message => message.id);
        toggleStar(messageIdsToUpdate).then(data => this.setState({messages: data}));

    }

    markMessagesRead = () => {
        let messages = this.state.messages.slice();
        let checkedMessages = this.state.checkedMessages.slice().map(checkedMessage => messages.find(message => checkedMessage.id === message.id));
        let messageIdsToUpdate = messages.filter(message => checkedMessages.includes(message)).map(message => message.id);
        markMessageRead(messageIdsToUpdate, true).then(data => this.setState({messages: data}));
    }

    markMessagesUnread = () => {
        let messages = this.state.messages.slice();
        let checkedMessages = this.state.checkedMessages.slice().map(checkedMessage => messages.find(message => checkedMessage.id === message.id));
        let messageIdsToUpdate = messages.filter(message => checkedMessages.includes(message)).map(message => message.id);
        markMessageRead(messageIdsToUpdate, false).then(data => this.setState({messages: data}));
    }

    deleteMessages = () => {
        let messages = this.state.messages.slice();
        let checkedMessages = this.state.checkedMessages.slice().map(checkedMessage => messages.find(message => checkedMessage.id === message.id));
        console.log('delete these ', checkedMessages);

        console.log('filtered ', messages.filter(message => !checkedMessages.includes(message)));
        let messageIdsToUpdate = messages.filter(message => checkedMessages.includes(message)).map(message => message.id);
        console.log('ids to delete ', messageIdsToUpdate);
        deleteMessages(messageIdsToUpdate).then(data => this.setState({messages: data, checkedMessages: []}));
    }

    addLabels = (label) => {
        console.log('label ', label);
        let messages = this.state.messages.slice();
        let checkedMessages = this.state.checkedMessages.slice().map(checkedMessage => messages.find(message => checkedMessage.id === message.id));

        let messageIdsToUpdate = messages.filter(message => checkedMessages.includes(message) && (message.labels.findIndex(currLabel => currLabel === label) < 0))
            .map(message => message.id);
        console.log('ids to add labels to ', messageIdsToUpdate);
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
        console.log('label ', label);
        let messages = this.state.messages.slice();
        let checkedMessages = this.state.checkedMessages.slice().map(checkedMessage => messages.find(message => checkedMessage.id === message.id));

        let messageIdsToUpdate = messages.filter(message => checkedMessages.includes(message) && message.labels.includes(label)).map(message => message.id);
        console.log('ids to remove labels from ', messageIdsToUpdate);
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

    render() {
        console.log('messages ', this.state.messages);
        //calculate number of unread messages
        const unreadMessageCount = this.state.messages.slice().reduce((count, message) => !message.read ? count + 1 : count, 0);
        //update checkedMessages
        const checkedMessages = this.state.checkedMessages.slice().map(checkedMessage => this.state.messages.slice().find(message => checkedMessage.id === message.id));
        console.log('checked messages ', checkedMessages);


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
                />
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
