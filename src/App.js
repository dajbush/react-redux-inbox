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
    }

    render() {
        console.log('messages ', this.state.messages);
        console.log('check messages ', this.state.checkedMessages);
        return (
            <div className="wrapper">
                <Toolbar 
                    handleBulkSelect={this.handleBulkSelect} 
                    markMessagesRead={this.markMessagesRead} 
                    numberOfCheckedMessages={this.state.checkedMessages.length} 
                    allChecked={this.state.checkedMessages.length === this.state.messages.length}
                />
                <MessageList handleCheck={this.handleCheck} handleStar={this.handleStar} messages={this.state.messages} />
            </div>
        );
    }
}

export default App;
