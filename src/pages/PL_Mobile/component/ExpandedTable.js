/**
 * Created by Airma on 2017/3/14.
 */
import React,{Component} from 'react'
import { Table  } from 'antd';
import {connect } from 'react-redux'
import {deleteUser ,selectedRows } from 'actions/index'


class App extends Component {
    constructor(props){
        super(props);
        this.columns = [

        ]
    }


    render(){
        return(
            <div>
                <Table
                    dataSource={this.props.adtsTable.dataSource}
                    columns={this.columns}
                />
            </div>
        )
    }
}


const mapStateToProps = (state)=>{
    return state
};
const mapDispatchToProps = (dispatch)=>{
    return {
    }
};

const ExpandedTable = connect(
    mapStateToProps,mapDispatchToProps
)(App);

export default ExpandedTable;