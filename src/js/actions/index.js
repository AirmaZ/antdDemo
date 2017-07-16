import {message, notification} from 'antd';

import 'whatwg-fetch'
export const SHOW_ADD_USER = "SHOW_ADD_USER";
export const CLOSE_ADD_USER = "CLOSE_ADD_USER";
export const SET_ADD_USER_LOADING = "SET_ADD_USER_LOADING";
export const CHANGE_USER_VALUE = "CHANGE_USER_VALUE";
export const ADD_USER_ERROR = "ADD_USER_ERROR";
export const SEARCH_USER = "SEARCH_USER";
export const EDIT_CLICK = "EDIT_CLICK";
export const DELETE_USER = "DELETE_USER";
export const SELECTED_ROWS = "SELECTED_ROWS";
export const GET_TABLE_LIST = "GET_TABLE_LIST";
export const GET_TABLE_LIST_HISTORY = "GET_TABLE_LIST_HISTORY";
export const CHANGE_USER_VALUE_HISTORY = "CHANGE_USER_VALUE_HISTORY";
export const TIME_SELECTED = "TIME_SELECTED";
export const GET_TEST_RESULT = "GET_TEST_RESULT";
export const DIAL_START = "DIAL_START";
export const DIAL_END = "DIAL_END";
export const IP_TEST = "IP_TEST";
export const SET_CHECK = "SET_CHECK";

export const HOST = "http://ci.haohanheifei.com:18086";
// export const HOST = "http://localhost:3000";

/**
 * 这段破代码看不懂就别看了，adts的接口权限鉴定，耦合度非常高，肯定复用不了。
 * 用fetchCheck来代替fetch，最后返回response的promise对象
 * @param input
 * @param init
 * @param dispatch
 * @param getState
 * @return {Promise.<TResult>}
 */
const fetchCheck = (input, init, dispatch, getState) => {
    let reqHeaders = new Headers();
    reqHeaders.append('X-Requested-With','XMLHttpRequest');
    init['headers'] = reqHeaders;
    switch (getState().check) {
        case false:
            return fetch(HOST + '/dial/apiSession/check', {
                method: 'GET',
                mode: 'cors',
                headers:reqHeaders,
                credentials: 'include'
            })
                .then(response => {
                    switch (response.status) {
                        case 200:
                            return response.text().then(text=>{
                                if(text === 'success'){
                                    dispatch({type: SET_CHECK, data: true});
                                    return fetch(input, init)
                                        .then(response => {
                                        let responseClone = response.clone();//clone是因为response的body是流，只能读一次
                                        switch (response.status) {
                                            case 200:
                                                return response.json().then(json => {
                                                    if (json.result || json.result === "2_") {
                                                        dispatch({type: SET_CHECK, data: false});
                                                        fetchCheck(input, init, dispatch, getState);
                                                    }
                                                    else return responseClone;
                                                }).catch(()=>{
                                                    return responseClone;
                                                });
                                                break;
                                            default:
                                                return responseClone;
                                        }
                                    });
                                } else {
                                    dispatch({type: SET_CHECK, data: false});
                                }
                            });
                            break;
                        case 302:
                            dispatch({type: SET_CHECK, data: false});
                            break;
                        default:
                            dispatch({type: SET_CHECK, data: false});
                            message.error('未知的的权限错误！');
                            break;
                    }
                }, (err) => {
                    message.error('未知的错误');
                });
            break;
        case true:
            return fetch(input, init).then(response => {
                let responseClone = response.clone();
                switch (response.status) {
                    case 200:
                        return response.json().then(json => {
                            if (json.result || json.result === "2_") {
                                dispatch({type: SET_CHECK, data: false});
                                fetchCheck(input, init, dispatch, getState);
                            }
                            else return responseClone;
                        }).catch(()=>{
                            return responseClone;
                        });
                        break;
                    default:
                        return responseClone;
                }
            });
            break;
        default:
            console.error('未知的的权限错误');
            break;
    }
};


export const testIp = (key, status) => (dispatch, getState) => {     //IP用户测试
    return fetchCheck(HOST + '/dial/api/customer/operator', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({"id": key.toString(), "status": (status === "start") ? "1" : "2"})
    }, dispatch, getState)
        .then(response => {
            switch (response.status) {
                case 200:
                    return response.json();
                    break;
                default:
                    message.error('拨测失败！');
                    break;
            }
        }, (err) => {
            message.error('未知的错误');
        })
        .then(json => {
            dispatch({type: IP_TEST, data: json, status: status});
        });
};

export const dialStart = (params) => {     //拨测账户上线
    return {type: DIAL_START, data: params}
};

export const dialEnd = (params) => {     //拨测账户下线
    return {type: DIAL_END, data: params}
};

export const showAddUser = () => {     //弹出添加用户对话框
    return {type: SHOW_ADD_USER}
};

export const closeAddUser = () => {      //关闭添加用户对话框
    return {type: CLOSE_ADD_USER}
};

// export const setAddUserLoading = () => {   //等待添加用户(loading)
//     dispatch({type:SET_ADD_USER_LOADING,status:0});
//     return {type:SET_ADD_USER_LOADING,status:0}
// };


export const ChangeUserValue = (data) => {     //添加用户输入框事件（当前页面）
    return {type: CHANGE_USER_VALUE, data: data}
};

export const ChangeUserValueHistory = (data) => {     //添加用户输入框事件(查询历史页面)
    return {type: CHANGE_USER_VALUE_HISTORY, data: data}
};

export const addUserErr = () => {   //添加用户为空时报错
    return {type: ADD_USER_ERROR}
};

export const searchUser = (data) => {   //搜索用户
    return {type: SEARCH_USER, data: data}
};

export const selectedRows = (keyArray, keyType) => {   //多选用户
    return {type: SELECTED_ROWS, key: keyArray, keyType: keyType}
};

export const selectTime = (time) => {   //时间选择
    return {type: TIME_SELECTED, data: time}
};

export const getTableList = () => (dispatch, getState) => {   //获取表格数据
    dispatch({type: GET_TABLE_LIST, status: 0});
    let searchParams = new URLSearchParams();
    searchParams.append('orderColumn', 'id');
    searchParams.append('orderDir', 'desc');
    return fetchCheck(HOST + '/dial/api/customer/find/list', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: '{"orderColumn":"id", "orderDir":"desc"}'
    }, dispatch, getState)
        .then(response => {
            switch (response.status) {
                case 200:
                    return response.json();
                    break;
                default :
                    dispatch({type: GET_TABLE_LIST, status: -1});
                    break;
            }
        }, (err) => {
            dispatch({type: GET_TABLE_LIST, status: -1})
        })
        .then(json => {
            let IPreg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            for (let i = 0; i < json.length; i++) {
                if (IPreg.test(json[i]['account'])) {   //给account添加type标识，分辨是ip还是手机号
                    json[i]['userType'] = 'IP';
                    json[i]['testing'] = (json[i]['status'] === 1);
                } else if (/^1(3|4|5|7|8)\d{9}$/.test(json[i]['account'])) {
                    json[i]['userType'] = 'imsi'
                } else json[i]['userType'] = 'error';
                json[i]['message'] = {}
            }
            dispatch({type: GET_TABLE_LIST, status: 1, data: json});
        })
};

export const getTableListHistory = (params) => (dispatch, getState) => {   //获取历史表格数据
    dispatch({type: GET_TABLE_LIST_HISTORY, status: 0});
    return fetchCheck(HOST + '/dial/api/customer/filter/his', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(params)
    }, dispatch, getState)
        .then(response => {
            switch (response.status) {
                case 200:
                    return response.json();
                    break;
                case 204:
                    message.error('未查询到相关数据');
                    break;
                default:
                    dispatch({type: SET_ADD_USER_LOADING, status: 1});
                    message.error('未知的错误！');
                    break;
            }
        }, (err) => {
            dispatch({type: GET_TABLE_LIST_HISTORY, status: -1})
        })
        .then(json => {
            dispatch({type: GET_TABLE_LIST_HISTORY, status: 1, data: json});
        })
};


export const setAddUserLoading = (parmas) => (dispatch, getState) => {   //添加用户
    dispatch({type: SET_ADD_USER_LOADING, status: 0});
    return fetchCheck(HOST + '/dial/api/customer/add', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(parmas)
    }, dispatch, getState)
        .then(response => {
            switch (response.status) {
                case 201:
                    dispatch({type: SET_ADD_USER_LOADING, status: 1});
                    dispatch(getTableList()); //获取表格数据
                    message.success('添加成功！');
                    break;
                default:
                    dispatch({type: SET_ADD_USER_LOADING, status: 1});
                    response.json().then(json => {
                        message.error(json);
                    });
                    break;
            }
        }, (err) => {
            dispatch({type: SET_ADD_USER_LOADING, status: 1})
        })
};

export const editUserClick = (params) => (dispatch, getState) => {   //修改用户
    return fetchCheck(HOST + '/dial/api/customer/update/' + params.key, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({"account": params.data})
    }, dispatch, getState)
        .then(response => {
            switch (response.status) {
                case 200:
                    dispatch({type: EDIT_CLICK, data: params.data, key: params.key});
                    break;
                default:
                    message.error('修改失败！');
                    break;
            }
        }, (err) => {
            message.error('未知的错误');
        });
};

// export const startTest = (params) =>(dispatch,getState) =>{     //开始测试，包含单用户拨测和批量拨测
//     return fetch (HOST+'/dial/api/customer/prepared',{
//         method:'POST',
//         mode:'cors',
//         body:JSON.stringify({"account":params.account || params})
//     })
//         .then(response => {
//             switch (response.status){
//                 case 200:
//                     dispatch({type:START_TEST});
//                     notification['warning']({
//                         message: '准备拨测',
//                         description: '请重启被拨测手机，或者打开飞行模型一分钟后关闭。',
//                         duration:10
//                     });
//                     break;
//                 default:
//                     notification['error']({
//                         message: '拨测失败',
//                         description: '未知的原因，请联系网管。',
//                         duration:10
//                     });
//                     break;
//             }
//             return response
//         }, (err)=>{
//             message.error('未知的错误');
//         });
// };

export const deleteUser = (key) => (dispatch, getState) => {   //删除用户
    return fetchCheck(HOST + '/dial/api/customer/delete/' + key, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include'
    }, dispatch, getState)
        .then(response => {
            switch (response.status) {
                case 200:
                    dispatch({type: DELETE_USER, key: key});
                    break;
                default:
                    message.error('删除失败！');
                    break;
            }
        }, (err) => {
            message.error('未知的错误！');
        });
};

export const getTestResult = (key) => (dispatch, getState) => {   //获取单次测试结果
    return fetchCheck(HOST + '/dial/api/customer/find/' + key, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    }, dispatch, getState)
        .then(response => {
            switch (response.status) {
                case 200:
                    return response.json();
                    break;
                default:
                    message.error('获取结果失败！');
                    break;
            }
        }, (err) => {
            message.error('未知的错误！');
        })
        .then(json => {
            dispatch({type: GET_TEST_RESULT, data: json});
        });
};