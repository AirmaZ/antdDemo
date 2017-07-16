/**
 * Created by Airma on 2017/3/13.
 */
import React,{Component} from 'react'
import { Button ,Modal ,Input, Icon  ,Form ,notification} from 'antd';
import {connect } from 'react-redux'
import {showAddUser ,closeAddUser ,setAddUserLoading,ChangeUserValue ,addUserErr ,searchUser , testIp} from 'actions/index'
const Search = Input.Search;
const FormItem = Form.Item;
class App extends  Component {
    handleOk() {
        let value = this.props.TableTitle.addUserValue;
        let IPreg =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if(!value || !((/^1(3|4|5|7|8)\d{9}$/.test(value)) || (IPreg.test(value)))) {
            this.props.onAddUserErr();
            return
        }
        let parmas = {
            "account":value
        };
        this.props.onLoadingAddUser(parmas);
    }

    handChange(e){
        if(!e.target.value){
            this.props.onChangeUserValue(e.target.value,true);
        } else {
            this.props.onChangeUserValue(e.target.value,false);
        }
    }

    render() {
        let {onAddUserClick,onCloseAddUser,onSearch,TableTitle,adtsTable} = this.props;
        const suffix = TableTitle.addUserValue ? <Icon type="close-circle" onClick={()=>{this.props.onChangeUserValue("",true)}} /> : null;
        const ErrorMessage = TableTitle.isOkAddUserValue?{message:"帐户名必须是imsi或者ip！",flag:"error"}:{message:"",flag:"success"};
        return (
            <div>
                <Button key="addUser" className="add-btn" type="primary" icon="user-add" onClick={onAddUserClick}>添加</Button>
                <Button key="starTest"
                        className="allTest-btn"
                        icon="caret-right"
                        type="dashed"
                        size="small"
                        disabled={!adtsTable.StarTestStatus}
                        onClick={() => {
                            switch (adtsTable.selectedRowsType){
                                case 'imsi':
                                    this.props.socket.sendEvent('prepareDial', {'id': adtsTable.selectedRows});
                                    notification['warning']({
                                        message: '准备批量拨测',
                                        description: '请重启被拨测手机，或者打开飞行模型一分钟后关闭。',
                                        duration: 10
                                    });
                                    break;
                                case 'IP':
                                    this.props.ipTest(adtsTable.selectedRows,'start');
                                    notification['warning']({
                                        message: '准备批量拨测',
                                        description: '正在发送拨测请求...',
                                        duration: 10
                                    });
                                    break;
                                default:
                                    notification['error']({
                                        message: '不允许手机号和IP混合拨测！',
                                        description: '请确保批量拨测用户类型一致！',
                                        duration: 10
                                    });
                                    break;
                            }
                        }}
                >批量测试</Button>
                <div className="title-text">ADTS</div>
                <Search
                    placeholder="input search text"
                    style={{ width: 200 ,float:'right' }}
                    onSearch={value => onSearch(value)}
                />
                <Modal
                    visible={TableTitle.visible}
                    title="添加用户"
                    onCancel={onCloseAddUser}
                    maskClosable={false}
                    footer={[
                        <Button key="back" size="large" onClick={onCloseAddUser}>返回</Button>,
                        <Button key="submit" type="primary" size="large" loading={TableTitle.loading} onClick={this.handleOk.bind(this)}>
                            提交
                        </Button>,
                    ]}
                >
                    <Form>
                        <FormItem required help={ErrorMessage.message} validateStatus={ErrorMessage.flag}>
                            <Input
                                placeholder="请输入账户名称"
                                prefix={<Icon type="user" />}
                                suffix={suffix}
                                value={TableTitle.addUserValue}
                                onChange={this.handChange.bind(this)}
                                ref='add-user-input'
                            />
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}



const mapStateToProps = (state)=>{
    return state
};
const mapDispatchToProps = (dispatch) =>{
    return {
        onAddUserClick : ()=> {dispatch(showAddUser())},
        onCloseAddUser : ()=> {dispatch(closeAddUser())},
        onLoadingAddUser : (parmas)=> {dispatch(setAddUserLoading(parmas))},
        onChangeUserValue : (data,flag)=> {
            dispatch(ChangeUserValue({
                addUserValue:data,
                isOkAddUserValue:flag
            }))
        },
        ipTest: (key,status) => {
            dispatch(testIp(key,status))
        },
        onAddUserErr:() => {dispatch(addUserErr())},
        onSearch:(value)=> {dispatch(searchUser(value))},
    }
};
const TableTitle = connect(
    mapStateToProps ,mapDispatchToProps
)(App);

export default TableTitle;