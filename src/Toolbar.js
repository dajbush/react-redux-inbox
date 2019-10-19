import React from 'react';

class Toolbar extends React.Component {
    state = {
        applyLabelValue: "Apply label",
        removeLabelValue: "Remove label"
    }

    applyLabelOnChange = (e) => {
        if(e.target.value !== "Apply label") this.props.addLabels(e.target.value);
    }

    removeLabelOnChange = (e) => {
        if(e.target.value !== "Remove label") this.props.removeLabels(e.target.value);
    }

    render() {
        console.log('all checked ', this.props.allChecked);
        return (
            <div className="row toolbar">
                <div className="col-md-12">
                    <p className="pull-right">
                        <span className="badge badge">{this.props.unreadCount}</span>
                        {`unread message${this.props.unreadCount === 1 ? "" : "s"}`}
                    </p>

                    <button className="btn btn-default" onClick={this.props.handleBulkSelect}>
                        <i className={`fa fa-${this.props.numberOfCheckedMessages > 0 ? this.props.allChecked ? "check-" : "minus-" : ""}square-o`}></i>
                    </button>

                    <button className="btn btn-default" onClick={this.props.markMessagesRead} disabled={`${this.props.numberOfCheckedMessages > 0 ? "" : "disabled"}`}>
                        Mark As Read
                    </button>

                    <button className="btn btn-default" onClick={this.props.markMessagesUnread} disabled={`${this.props.numberOfCheckedMessages > 0 ? "" : "disabled"}`}>
                        Mark As Unread
                    </button>

                    <select className="form-control label-select" value={this.state.applyLabelValue} onChange={this.applyLabelOnChange} disabled={`${this.props.numberOfCheckedMessages > 0 ? "" : "disabled"}`}>
                        <option>Apply label</option>
                        <option value="dev">dev</option>
                        <option value="personal">personal</option>
                        <option value="gschool">gschool</option>
                    </select>

                    <select className="form-control label-select" value={this.state.removeLabelValue}onChange={this.removeLabelOnChange} disabled={`${this.props.numberOfCheckedMessages > 0 ? "" : "disabled"}`}>
                        <option>Remove label</option>
                        <option value="dev">dev</option>
                        <option value="personal">personal</option>
                        <option value="gschool">gschool</option>
                    </select>

                    <button className="btn btn-default" onClick={this.props.deleteMessages} disabled={`${this.props.numberOfCheckedMessages > 0 ? "" : "disabled"}`}>
                        <i className="fa fa-trash-o"></i>
                    </button>
                </div>
            </div>
        );
    }
}

export default Toolbar;