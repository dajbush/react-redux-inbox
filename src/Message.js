import React from 'react';

class Message extends React.Component {
    state = {
        selected: this.props.isChecked,
        starred: !!this.props.message.starred,
        expand: false
    };

    componentDidUpdate(prevProps) {
        if(prevProps.isChecked !== this.props.isChecked) {
            this.setState({selected: this.props.isChecked});
        }
        if(!!prevProps.message.starred !== !!this.props.message.starred) {
            this.setState({starred: !!this.props.message.starred});
        }
      }

    handleChecked = (e) => {
        e.target.checked ? e.target.checked=true : e.target.checked=false;
        this.props.handleCheck(this.props.message.id, e.target.checked);
    }

    handleStarred = (e) => {
        this.props.handleStar(this.props.message.id, !this.state.starred);
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
                <div id={message.id} className={`row message ${message.read ? "read" : "unread"} ${this.state.selected ? "selected" : ""}`}>
                    <div className="col-xs-1">
                        <div className="row">
                            <div className="col-xs-2">
                                <input type="checkbox" checked={this.state.selected} onChange={this.handleChecked}/>
                            </div>
                            <div className="col-xs-2">
                                <i className={`star fa ${this.state.starred ? "fa-star" : "fa-star-o"}`} onClick={this.handleStarred}></i>
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