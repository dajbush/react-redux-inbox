import React from 'react';

class Message extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {expand: false};
    }

    handleChecked = (e) => {
        this.props.handleCheck(this.props.message.id);
    }

    handleStarred = (e) => {
        this.props.handleStar(this.props.message.id);
    }

    createLabels = () => {
        return this.props.message.labels.map((label, i) => {
            return (<span key={`label ${i}`} className="label label-warning">{label}</span>);
        });
    }

    expandMessage = () => {
        this.setState({expand: !this.state.expand});
    }

    render() {
        let {message} = this.props;
        return (
            <div>
                <div id={message.id} className={`row message ${message.read ? "read" : "unread"} ${this.props.isChecked ? "selected" : ""}`}>
                    <div className="col-xs-1">
                        <div className="row">
                            <div className="col-xs-2">
                                <input type="checkbox" checked={this.props.isChecked} onChange={this.handleChecked}/>
                            </div>
                            <div className="col-xs-2">
                                <i className={`star fa ${this.props.message.starred ? "fa-star" : "fa-star-o"}`} onClick={this.handleStarred}></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-11">
                        {this.createLabels()}
                        <a href="#" onClick={this.expandMessage}>
                        {message.subject}
                        </a>
                    </div>
                </div>
                {this.state.expand &&
                    <div className="row message-body">
                        <div className="col-xs-11 col-xs-offset-1">
                            {this.props.message.body}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Message;