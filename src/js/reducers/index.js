import {
    SHOW_ADD_USER, CLOSE_ADD_USER, SET_ADD_USER_LOADING,
    CHANGE_USER_VALUE, ADD_USER_ERROR, SEARCH_USER, EDIT_CLICK,
    DELETE_USER, SELECTED_ROWS, GET_TABLE_LIST, GET_TABLE_LIST_HISTORY,
    CHANGE_USER_VALUE_HISTORY, TIME_SELECTED, GET_TEST_RESULT, DIAL_START,
    DIAL_END, IP_TEST, SET_CHECK
} from 'actions/index'


import {extend} from 'common/tools'
export default function (state = {}, action) {
    let _Data = null;
    let _length = null;
    switch (action.type) {

        case IP_TEST:
            switch (action.status) {
                case "start":
                    _Data = state.adtsTable.dataSource.concat();
                    for (let i = 0; i < _Data.length; i++) {
                        for (let j = 0; j < action.data.length; j++) {
                            if (_Data[i].key === action.data[j].key) {
                                _Data[i].testing = true;
                                _Data[i].status = 1;
                                _Data[i].startTime = action.data[j].startTime;
                                _Data[i].startTimeStr = action.data[j].startTimeStr;
                                _Data[i].endTime = null;
                                _Data[i].endTimeStr = null;
                            }
                        }
                    }
                    return extend(true, {}, state, {adtsTable: {dataSource: _Data}});
                    break;
                case "end":
                    _Data = state.adtsTable.dataSource.concat();
                    for (let i = 0; i < _Data.length; i++) {
                        for (let j = 0; j < action.data.length; j++) {
                            if (_Data[i].key === action.data[j].key) {
                                _Data[i].testing = false;
                                _Data[i].status = 2;
                                _Data[i].startTime = action.data[j].startTime;
                                _Data[i].startTimeStr = action.data[j].startTimeStr;
                                _Data[i].endTime = action.data[j].endTime;
                                _Data[i].endTimeStr = action.data[j].endTimeStr;
                            }
                        }

                    }
                    return extend(true, {}, state, {adtsTable: {dataSource: _Data}});
                    break;
                default:
                    return state;
            }
            break;

        case SET_CHECK:
            return extend(true, {}, state, {check: action.data});
            break;

        case DIAL_START:
            _Data = state.adtsTable.dataSource.concat();
            for (let i = 0; i < _Data.length; i++) {
                if (_Data[i].key === action.data.key)
                    _Data[i].status = 2;
                _Data[i].startTime = action.data.startTime;
                _Data[i].startTimeStr = action.data.startTimeStr;
                _Data[i].endTime = null;
                _Data[i].endTimeStr = null;
            }
            return extend(true, {}, state, {adtsTable: {dataSource: _Data}});
            break;

        case DIAL_END:
            _Data = state.adtsTable.dataSource.concat();
            for (let i = 0; i < _Data.length; i++) {
                if (_Data[i].key === action.data.key)
                    _Data[i].status = 2;
                _Data[i].startTime = action.data.startTime;
                _Data[i].startTimeStr = action.data.startTimeStr;
                _Data[i].endTime = action.data.endTime;
                _Data[i].endTimeStr = action.data.endTimeStr;
            }
            return extend(true, {}, state, {adtsTable: {dataSource: _Data}});
            break;

        case SHOW_ADD_USER:
            return extend(true, {}, state, {TableTitle: {visible: true}});
            break;

        case GET_TEST_RESULT:
            _Data = state.adtsTable.dataSource.concat();
            _length = _Data.length;
            for (let j = 0; j < _length; j++) {
                if (_Data[j].key !== action.data.key)
                    _Data[j]['message'] = {billTotal: action.data.billTotal, mirrorTotal: action.data.mirrorTotal}
            }
            return extend(true, {}, state, {adtsTable: {dataSource: _Data}});
            break;

        case CLOSE_ADD_USER:
            return extend(true, {}, state, {TableTitle: {visible: false}});
            break;

        case SET_ADD_USER_LOADING:
            switch (action.status) {
                case 0:
                    return extend(true, {}, state, {TableTitle: {loading: true}});
                    break;
                case 1:
                    return extend(true, {}, state, {TableTitle: {loading: false}});
                    break;
                default:
                    break;
            }
            return extend(true, {}, state, {TableTitle: {loading: true}});
            break;

        case CHANGE_USER_VALUE:
            return extend(true, {}, state, {TableTitle: action.data});
            break;

        case ADD_USER_ERROR:
            return extend(true, {}, state, {TableTitle: {isOkAddUserValue: true}});
            break;

        case SEARCH_USER:
            return extend(true, {}, state, {TableTitle: {searchText: action.data}});
            break;

        case EDIT_CLICK:
            _Data = state.adtsTable.dataSource.concat();
            for (let i = 0; i < _Data.length; i++) {
                if (_Data[i].key === action.key)
                    _Data[i].account = action.data;
            }
            return extend(true, {}, state, {adtsTable: {dataSource: _Data}});
            break;

        case DELETE_USER:
            _Data = state.adtsTable.dataSource.concat();
            _length = _Data.length;
            let newArr = [];
            for (let j = 0; j < _length; j++) {
                if (_Data[j].key !== action.key)
                    newArr.push(_Data[j]);
            }
            return extend(true, {}, state, {adtsTable: {dataSource: newArr}});
            break;

        case SELECTED_ROWS:
            _Data = false;
            if (action.key.length !== 0) _Data = true;
            return extend(true, {}, state, {
                adtsTable: {
                    selectedRows: action.key,
                    selectedRowsType: action.keyType,
                    StarTestStatus: _Data
                }
            });
            break;

        case GET_TABLE_LIST:
            _Data = {adtsTable: {loading: false, dataSource: []}};
            switch (action.status) {
                case 0:
                    _Data.adtsTable.loading = true;
                    break;
                case 1:
                    _Data.adtsTable = {loading: false, dataSource: action.data};
                    break;
                case -1:
                    _Data.adtsTable = {loading: false, error: true};
                    break;
                default:
                    break;
            }
            return extend(true, {}, state, _Data);
            break;

        case GET_TABLE_LIST_HISTORY:
            _Data = {historyTable: {loading: false, dataSource: []}};
            switch (action.status) {
                case 0:
                    _Data.historyTable.loading = true;
                    break;
                case 1:
                    _Data.historyTable = {loading: false, dataSource: action.data};
                    break;
                case -1:
                    _Data.historyTable = {loading: false, error: true};
                    break;
                default:
                    break;
            }
            return extend(true, {}, state, _Data);
            break;

        case CHANGE_USER_VALUE_HISTORY:
            return extend(true, {}, state, {historyTable: {queryText: action.data}});
            break;

        case TIME_SELECTED:
            return extend(true, {}, state, {historyTable: {time: action.data}});
            break;

        default:
            return state
    }
}
