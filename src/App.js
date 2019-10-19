import React from 'react';
import './App.css';
import MessageList from './MessageList';
import Toolbar from './Toolbar';
import {getAllMessages,toggleStar,markMessageRead} from './requests';

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
                messages: data,
                checkedMessages: data.filter(message => !!message.selected)
            }
        ));
    }

    componentWillUpdate() {
        console.log("update");
        // getAllMessages().then(data => this.setState(
        //     {
        //         messages: data,
        //         checkedMessages: data.filter(message => !!message.selected)
        //     }
        // ));
    }

    handleBulkSelect = () => {
        //mark all messages as selected and add all to checkedMessages
        let allSelected = this.state.messages.slice().map(message => !!message.selected).every(curr => curr);
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
        let checkedMessages = this.state.checkedMessages.slice();
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
        //let messages = this.state.messages.slice();
        // this.setState({
        //     messages: messages.map(message => {
        //         if(message.id === id) {
        //             return {
        //                 ...message,
        //                 starred: starred
        //             }
        //         }
        //         else {
        //             return message;
        //         }
        //     }),

        // });

        //call api
        let messageIdsToUpdate = this.state.messages.slice().filter(message => message.id === id).map(message => message.id);
        toggleStar(messageIdsToUpdate).then(data => this.setState({messages: data}));

    }

    markMessageRead = (id) => {
        this.setState({
            messages: this.state.messages.slice().map(message => {
                if(message.id === id) {
                    return {
                        ...message,
                        read: true
                    }
                }
                else {
                    return message;
                }
            })
        });
    }

    markMessagesRead = () => {
        let messages = this.state.messages.slice();
        let checkedMessages = this.state.checkedMessages.slice().map(checkedMessage => messages.find(message => checkedMessage.id === message.id));
        //console.log('checkedMessages before change', checkedMessages);
        //checkedMessages.map(checkedMessage => messages.find(message => checkedMessage.id === message.id));
        //console.log('checkedMessages after change', checkedMessages);
        console.log('mark these as read', this.state.checkedMessages);
        // this.setState({
        //     messages: messages.map(message => {
        //         console.log('contains ', checkedMessages.includes(message));
        //         if(checkedMessages.includes(message)) {
        //             message.read = true;
        //         }
        //         return message;
        //     })
        // });

        //call api
        let messageIdsToUpdate = messages.filter(message => checkedMessages.includes(message)).map(message => message.id);
        markMessageRead(messageIdsToUpdate, true).then(data => this.setState({messages: data}));
    }

    markMessagesUnread = () => {
        let messages = this.state.messages.slice();
        let checkedMessages = this.state.checkedMessages.slice().map(checkedMessage => messages.find(message => checkedMessage.id === message.id));
        //console.log('checkedMessages after change', checkedMessages);
        console.log('mark these as Unread', this.state.checkedMessages);
        // this.setState({
        //     messages: messages.map(message => {
        //         console.log('contains ', checkedMessages.includes(message));
        //         if(checkedMessages.includes(message)) {
        //             message.read = false;
        //         }
        //         return message;
        //     })
        // });
        let messageIdsToUpdate = messages.filter(message => checkedMessages.includes(message)).map(message => message.id);
        markMessageRead(messageIdsToUpdate, false).then(data => this.setState({messages: data}));
    }

    deleteMessages = () => {
        let messages = this.state.messages.slice();
        let checkedMessages = this.state.checkedMessages.slice();
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
        let messages = this.state.messages.slice();
        let checkedMessages = this.state.checkedMessages.slice();

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
        let messages = this.state.messages.slice();
        let checkedMessages = this.state.checkedMessages.slice();

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
                <MessageList handleCheck={this.handleCheck}
                             handleStar={this.handleStar} 
                             messages={this.state.messages} 
                             markMessageRead={this.markMessageRead}/>
            </div>
        );
    }
}

export default App;
