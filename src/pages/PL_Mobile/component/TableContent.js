/**
 * Created by Airma on 2017/3/14.
 */
import React, {Component} from 'react'
import {Table, Popconfirm, Icon, notification, Badge, message, Spin ,Progress } from 'antd';
import TableTitle from './TableTitle.js'
import UserEdit from './UserEdit.js'
import {connect} from 'react-redux'
import {deleteUser, selectedRows, getTableList, getTestResult ,testIp} from 'actions/index'

const success = function () {
    message.success('加载完毕！');
};
const error = function () {
    message.error('未知错误！');
};

class App extends Component {
    constructor(props) {
        super(props);
        this.titleFc = () => {
            return (
                <TableTitle socket={this.props.socket}/>
            )
        };
        this.columns = [{   //表格字段定义
            title: '拨测账号',
            dataIndex: 'account',
            key: 'account',
            width: '20%',
            render: (text, record, index) => (
                <UserEdit
                    value={text} record={record}
                />
            )
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
        }, {
            title: '拨测状态',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (text, record, index) => {
                let _text = '未知';
                let statusType = 'warning';
                switch (text) {
                    case 0:
                        _text = "未拨测";
                        statusType = 'default';
                        break;
                    case 1:
                        _text = "拨测中";
                        statusType = 'processing';
                        break;
                    case 2:
                        _text = "拨测结束";
                        statusType = 'success';
                        break;
                    default:
                        _text = '未知';
                        statusType = 'error';
                        break;
                }
                return (
                    <span>
                        <Badge status={statusType} style={{float: 'right'}}/>
                        {_text}
                    </span>
                )
            }
        }
            , {
                title: '操作',
                dataIndex: 'operation',
                width: '10%',
                render: (text, record) => {
                    let disabled = (!(record.status === 0 || record.status === 2));
                    let testBtn = () => {
                        switch (record.userType) {
                            case 'imsi':
                                return (
                                    <Popconfirm key="test-btn" title="Sure to test?" onConfirm={() => {
                                        this.props.socket.sendEvent('prepareDial', {'id': record.key});
                                        notification['warning']({
                                            message: '准备拨测',
                                            description: '请重启被拨测手机，或者打开飞行模型一分钟后关闭。测试用户：'+record.account,
                                            duration: 10
                                        });
                                    }}>
                                        <a className="test-btn operation-btn" disabled={disabled} href="#">测试</a>
                                    </Popconfirm>
                                );
                                break;
                            case 'IP':
                                return(
                                    <Popconfirm key="test-btn" title={record.testing?"Sure to end?":"Sure to test?"} onConfirm={() => {
                                        console.log('ip测试,testing:'+record.testing);
                                        let status = record.testing ? 'end':'start';
                                        let flag = record.testing ? 'success':'warning';
                                        let test = record.testing ? '拨测完毕':'准备拨测';
                                        this.props.ipTest(record.key,status);
                                        notification[flag]({
                                            message: test,
                                            description: '测试IP：'+record.account,
                                            duration: 10
                                        });
                                    }}>
                                        <a className="test-btn operation-btn" href="#">
                                            {record.testing ? '结束' : '测试'}
                                        </a>
                                    </Popconfirm>
                                );
                                break;
                            default:
                                return(
                                    <Icon type="exclamation-circle operation-btn operation-error" />
                                );
                                break;
                        }
                    };
                    return (
                        (
                            <Spin spinning={(record.status ==1) && record.userType === 'imsi'}>
                                <Popconfirm key="delete-btn" title="Sure to delete?"
                                            onConfirm={() => this.props.onDeleteClick(record.key)}>
                                    <a className="delete-btn operation-btn" disabled={disabled} href="#">删除</a>
                                </Popconfirm>
                                <span className="ant-divider"/>
                                {testBtn()}
                            </Spin>
                        )
                    );
                },
            }];

        this.sendSlectedRows = (selectedRows) => {
            let keyArray = '';
            let keyType = null;
            for (let i = 0; i < selectedRows.length; i++) {
                let symbol = (i === selectedRows.length - 1) ? '' : ',';
                keyArray += (selectedRows[i].key) + symbol;
                if(keyType === selectedRows[i].userType || !keyType) keyType = selectedRows[i].userType;
                else keyType = 'error'
            }
            this.props.onSelectRow(keyArray,keyType)
        };

        this.rowSelection = {   //选择功能回调
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.sendSlectedRows(selectedRows)
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
                this.sendSlectedRows(selectedRows)
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
                this.sendSlectedRows(selectedRows)
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User',    // Column configuration not to be checked
            }),
        };
    }

    handleMessage(record) {
        let message = (record.message.mirrorTotal && record.message.billTotal) ?
            "镜像流量统计:" + record.message.mirrorTotal + "Mbyte; 话单流量统计:" + record.message.billTotal + "Mbyte" : "无记录";
        return (<p className="expanded-message">{message}</p>)
    }

    componentDidMount() {
        success();
        this.props.getTableList();
        if (this.props.adtsTable.error) error();
    }

    render() {
        return (
            <div>
                <Table
                    title={this.titleFc}
                    rowSelection={this.rowSelection}
                    dataSource={this.props.adtsTable.dataSource}
                    expandedRowRender={record => this.handleMessage(record)}
                    onExpand={(expanded, data) => {
                        if (expanded) this.props.onExpandedRowsChange(data.key)
                    }}
                    columns={this.columns}
                    pagination={{showQuickJumper: true, showSizeChanger: true}}
                    loading={this.props.adtsTable.loading}
                    bordered
                />
            </div>
        )
    }
}

const searchDataSource = (dataSource, searchText) => {
    let _dataSource = [];
    let key = dataSource.length;
    for (let i = 0; i < key; i++) {
        if (searchText && !(dataSource[i].account.indexOf(searchText))) {
            _dataSource.push(dataSource[i]);
        } else if (searchText) {
        } else
            _dataSource.push(dataSource[i]);
    }
    return _dataSource;
};

const mapStateToProps = (state) => {
    return {
        adtsTable: {
            dataSource: searchDataSource(state.adtsTable.dataSource, state.TableTitle.searchText),
            loading: state.adtsTable.loading,
            error: state.adtsTable.error,
        }
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteClick: (key) => {
            dispatch(deleteUser(key))
        },
        ipTest: (key,status) => {
            dispatch(testIp(key,status))
        },
        onSelectRow: (key,keyType) => {
            dispatch(selectedRows(key,keyType))
        },
        getTableList: () => {
            dispatch(getTableList())
        },
        // startTest:(params)=>{dispatch(startTest(params))},
        onExpandedRowsChange: (key) => {
            dispatch(getTestResult(key))
        }
    }
};

const TableContent = connect(
    mapStateToProps, mapDispatchToProps
)(App);

export default TableContent;