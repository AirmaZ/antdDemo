// application's entry

import React, {Component} from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {Router, Route, IndexRoute, browserHistory ,hashHistory ,Link} from 'react-router';
import reducers from 'reducers/index';
import '../css/common.scss';

// pages
import Page1 from './page1/index';
import Page2 from './page2/index';
import PL_history from './PL_history/index';
import PL_Mobile from './PL_Mobile/index';


const defaultState = {
    adtsTable: {
        dataSource: [],
        selectedRows: null,
        StarTestStatus: false,
        loading:false,
        error:false,
    },
    historyTable:{
        dataSource: [],
        loading:false,
        error:false,
        queryText: '',
        time:["",""]
    },
    TableTitle: {
        loading: false,
        visible: false,
        addUserValue: '',
        isOkAddUserValue: false,
        searchText: ''
    },
    check:false //用于权限鉴定
};

class Application extends Component {
    render() {
        return (
            <div>
                <div className="header">
                    <Link to="page1">page1</Link>
                    <Link to="page2">page2</Link>
                    <Link to="PL_history">PL_history</Link>
                    <Link to="PL_Mobile">PL_Mobile</Link>
                </div>
                {this.props.children}
            </div>
        );
    }
}


const store = createStore(reducers, defaultState, applyMiddleware(thunk));

render((
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/">
                <IndexRoute component={PL_Mobile}/>
                <Route path="page1" component={Page1}></Route>
                <Route path="page2" component={Page2}></Route>
                <Route path="PL_history" component={PL_history}></Route>
                <Route path="PL_Mobile" component={PL_Mobile}></Route>
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'));