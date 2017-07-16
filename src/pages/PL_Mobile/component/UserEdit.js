/**
 * Created by Airma on 2017/3/14.
 */
import { Table, Input, Icon, Button, Popconfirm } from 'antd';
import React,{Component} from 'react'
import {connect } from 'react-redux'
import {editUserClick} from 'actions/index'


class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            value: this.props.value,
            editable: false,
        }
    }

    handleChange(e) {
        const value = e.target.value;
        this.setState({ value });
    }
    check() {
        this.setState({ editable: false });
        if (this.props.record.key) {
            this.props.onEditClick({data:this.state.value,key:this.props.record.key});
        }
    }
    edit() {
        this.setState({ editable: true });
    }
    render() {
        let { value , editable } = this.state;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                value={value}
                                onChange={this.handleChange.bind(this)}
                                onPressEnter={this.check.bind(this)}
                            />
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check.bind(this)}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {this.props.value || ' '}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit.bind(this)}
                            />
                        </div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    return state
};
const mapDispatchToProps = (dispatch) =>{
    return {
        onEditClick : (parmas)=>{ dispatch(editUserClick(parmas))}
    }
};
const UserEdit = connect(
    mapStateToProps ,mapDispatchToProps
)(App);

    export default UserEdit;