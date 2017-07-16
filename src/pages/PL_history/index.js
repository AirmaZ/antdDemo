import React,{Component} from 'react'
import TableContent from './component/TableContent'
import Query from './component/Query'
require('./index.css');

class History extends Component {
    render(){
        return(
            <div>
                <TableContent/>
            </div>
        )
    }
}

export default History;