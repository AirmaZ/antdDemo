/**
 * Created by Airma on 2017/3/14.
 */
import React,{Component} from 'react'
import { Table , Popconfirm ,Icon ,notification ,Badge , message} from 'antd';
import Query from './Query.js'
import {connect } from 'react-redux'
import { getTableListHistory } from 'actions/index'

const success = function () {
    message.success('加载完毕！');
};
const error = function () {
    message.error('未知错误！');
};

const titleFc = ()=>{
    return (
        <Query/>
    )
};

class App extends Component {
    constructor(props) {
        super(props);
        this.columns = [{   //表格字段定义
            title: '拨测账号',
            dataIndex: 'account',
            key: 'account',
            width: '20%',
        }, {
            title: '开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
            sorter: (a, b) => a.startTime < b.startTime ? -1 : 1,
            render: (text, record, index) => {
                return record.startTimeStr ? record.startTimeStr : 'No data'
            }
        }, {
            title: '结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
            sorter: (a, b) => a.endTime < b.endTime ? -1 : 1,
            render: (text, record, index) => {
                return record.endTimeStr ? record.endTimeStr : 'No data'
            }
        },{
            title: '镜像流量统计（Mbyte)',
            dataIndex: 'mirrorTotal',
            key: 'mirrorTotal',
            render: (text, record, index) => {
                return record.mirrorTotal ? record.mirrorTotal : 'No data'
            }
        },{
            title: 'DPI话单流量统计（Mbyte)',
            dataIndex: 'billTotal',
            key: 'billTotal',
            render: (text, record, index) => {
                return record.billTotal ? record.billTotal : 'No data'
            }
        }];
    }

    componentDidMount(){
        success();
        // this.props.getTableList();
    }

    render(){
        if(this.props.historyTable.error)error();
        return(
            <div>
                <Table
                    title={titleFc}
                    dataSource={this.props.historyTable.dataSource}
                    columns={this.columns}
                    pagination = {{showQuickJumper:true,showSizeChanger:true}}
                    loading={this.props.historyTable.loading}
                    bordered
                />
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return {
        historyTable:{
            dataSource:state.historyTable.dataSource,
            loading:state.historyTable.loading,
            error:state.historyTable.error
        }
    }
};
const mapDispatchToProps = (dispatch)=>{
    return {
        // onDeleteClick : (key)=>{dispatch(deleteUser(key))},
        // onSelectRow : (key)=>{dispatch(selectedRows(key))},
        // getTableList : (parmas)=>{dispatch(getTableListHistory(parmas))},
    }
};

const TableContent = connect(
    mapStateToProps,mapDispatchToProps
)(App);

export default TableContent;