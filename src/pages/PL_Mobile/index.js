import React,{Component} from 'react'
import TableContent from './component/TableContent'
import {WebSocketIo} from 'common/tools'
import {connect } from 'react-redux'
import {notification} from 'antd'
import {dialStart , dialEnd ,HOST , SET_CHECK} from 'actions/index'
require('./index.css');

let socket = null;


class App extends Component{

    connectSocket(){
        //创建socket实例
        socket = new WebSocketIo('ws://ci.haohanheifei.com:18086/dial/ws/msg',60000,30000);
        window._socket = socket;
        //各类致命错误抛出
        socket.onMessageEvent('failed',(data)=>{
            notification['error']({
                message: 'failed',
                description: data,
                duration:10
            });
        });
        //无数据抛出
        socket.onMessageEvent('noMessage',(data)=>{
            notification['error']({
                message: 'noMessage',
                description: data,
                duration:10
            });
        });
        //超时抛出
        socket.onMessageEvent('timeOut',(data)=>{
            notification['error']({
                message: 'timeOut',
                description: data,
                duration:10
            });
        });
        //拨测信息下发成功
        socket.onMessageEvent('preparedResult',(data)=>{
            notification['success']({
                message: '拨测信息下发成功',
                description: '请至少测试10分钟后再查询结果！',
                duration:10
            });
            this.props.dialStart(data.key)
        });
        //拨测用户上线
        socket.onMessageEvent('dialStart',(data)=>{
            notification['success']({
                message: '拨测账户上线',
                description: "用户："+data.customer.account,
                duration:10
            });
            this.props.dialStart(data.customer)
        });
        //拨测用户下线
        socket.onMessageEvent('dialEnd',(data)=>{
            notification['success']({
                message: '拨测账户下线',
                description: "用户："+data.customer.account,
                duration:10
            });
            this.props.dialEnd(data.customer)
        });
        //断线处理
        socket.onclose(()=>{
            console.error('socket断线，正在重连...');
            this.connectSocket();
        })
    }

    componentDidMount(){
        //socket 权限部分，和接口权限单独开了，有空优化下
        fetch(HOST + '/dial/apiSession/check', {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        })
            .then(response => {
                switch (response.status) {
                    case 200:
                        response.text().then(text=>{
                            if(text === 'success'){
                                this.props.checkSuccess();
                                this.connectSocket();
                            }else {
                                this.props.checkError();
                                message.error('无权限！');
                            }
                        });
                        break;
                    default:
                        this.props.checkError();
                        message.error('无权限！');
                        break;
                }
            }, (err) => {
                message.error('未知的错误');
            });
    }


    render(){
        return(
            <TableContent socket={socket}/>
        )
    }
}
const mapStateToProps = (state)=>{
    return state
};
const mapDispatchToProps = (dispatch)=>{
    return {
        dialStart:(key)=>{dispatch(dialStart(key))},
        dialEnd:(key)=>{dispatch(dialEnd(key))},
        checkSuccess:()=>{dispatch({type: SET_CHECK, data: true})},
        checkError:()=>{dispatch({type: SET_CHECK, data: false})}
    }
};

export default connect(
    mapStateToProps,mapDispatchToProps
)(App);