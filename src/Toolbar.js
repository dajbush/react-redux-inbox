import React from 'react';

const Toolbar = (props) => {
    const applyLabelOnChange = (e) => {
        if(e.target.value !== "Apply label") props.addLabels(e.target.value);
    }

    const removeLabelOnChange = (e) => {
        if(e.target.value !== "Remove label") props.removeLabels(e.target.value);
    }

    return (
        <div className="row toolbar">
            <div className="col-md-12">
                <p className="pull-right">
                    <span className="badge badge">{props.unreadCount}</span>
                    {`unread message${props.unreadCount === 1 ? "" : "s"}`}
                </p>

                <a className="btn btn-danger" onClick={props.handleCompose}>
                    <i className="fa fa-plus"></i>
                </a>

                <button className="btn btn-default" onClick={props.handleBulkSelect}>
                    <i className={`fa fa-${props.numberOfCheckedMessages > 0 ? props.allChecked ? "check-" : "minus-" : ""}square-o`}></i>
                </button>

                <button className="btn btn-default" onClick={props.markMessagesRead} disabled={`${props.numberOfCheckedMessages > 0 ? "" : "disabled"}`}>
                    Mark As Read
                </button>

                <button className="btn btn-default" onClick={props.markMessagesUnread} disabled={`${props.numberOfCheckedMessages > 0 ? "" : "disabled"}`}>
                    Mark As Unread
                </button>

                <select className="form-control label-select" value="Apply label" onChange={applyLabelOnChange} disabled={`${props.numberOfCheckedMessages > 0 ? "" : "disabled"}`}>
                    <option>Apply label</option>
                    <option value="dev">dev</option>
                    <option value="personal">personal</option>
                    <option value="gschool">gschool</option>
                </select>

                <select className="form-control label-select" value="Remove label" onChange={removeLabelOnChange} disabled={`${props.numberOfCheckedMessages > 0 ? "" : "disabled"}`}>
                    <option>Remove label</option>
                    <option value="dev">dev</option>
                    <option value="personal">personal</option>
                    <option value="gschool">gschool</option>
                </select>

                <button className="btn btn-default" onClick={props.deleteMessages} disabled={`${props.numberOfCheckedMessages > 0 ? "" : "disabled"}`}>
                    <i className="fa fa-trash-o"></i>
                </button>
            </div>
        </div>
    );
}

export default Toolbar;