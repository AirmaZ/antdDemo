/**
 * Created by Airma on 2017/3/17.
 */
import React,{Component} from 'react'
import {Input , Icon , DatePicker ,Button} from 'antd'
import {connect} from 'react-redux'
import {ChangeUserValueHistory , getTableListHistory ,selectTime} from 'actions/index'
import {get_unix_time} from 'common/tools'

const RangePicker = DatePicker.RangePicker;

class App extends Component{
    handTime(date, dateString){
        this.props.timeSeleced(dateString);
    }
    render(){
        const {queryText,time} = this.props;
        const suffix = queryText ? <Icon type="search" onClick={()=>{
            let params = {
                startTime: parseInt(get_unix_time(time[0])) ,
                endTime: parseInt(get_unix_time(time[1])) ,
                account: queryText
            };
            this.props.getTableList(params)
        }}/> : null;
        return(
            <div>
                <div className="table-title-history">ADTS-history</div>
                <RangePicker onChange={this.handTime.bind(this)} size='small'/>
                <Input
                    placeholder="Enter your userName"
                    prefix={<Icon type="user" />}
                    suffix={suffix}
                    value={queryText}
                    onChange={(data)=>{this.props.onInputChange(data.target.value)}}
                    size="small"
                    style={{ width: 200 , float: 'right'}}
                    ref='query-user-input'
                />
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return {
        queryText:state.historyTable.queryText,
        time:state.historyTable.time,
    }
};
const mapDispatchToProps = (dispatch) =>{
    return {
        onInputChange :(data)=>{dispatch(ChangeUserValueHistory(data))},
        getTableList : (params)=>{dispatch(getTableListHistory(params))},
        timeSeleced:(time)=>{dispatch(selectTime(time))}
    }
};
export default connect(
    mapStateToProps ,mapDispatchToProps
)(App);

