import React, {Component} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import isContainer from 'Hoc/isContainer';
import { loadReport } from 'Actions/report';
import Control from 'Components/Report/Control';
class List extends Component {
     constructor(props) {
          super(props);
      }

      componentWillReceiveProps(nextProps) {
        
            if(JSON.stringify(this.props.query.reportQuery) != JSON.stringify(nextProps.query.reportQuery))
            {
                let startDate = nextProps.query.reportQuery.startDate;

                console.log(startDate)
                let sStartDate  =  startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + startDate.getDate()
                
                let endDate = nextProps.query.reportQuery.endDate;
                let sEndDate  =  endDate.getFullYear() + "-" + (endDate.getMonth()+1) + "-" + endDate.getDate()
                

                this.props.reloadData({startDate:sStartDate, endDate:sEndDate})
            }
      }

        

      render(){

        let {data} = this.props;

        if(data == null || data.length == 0)
            return <div>No Data, Please try again</div>;
        return (
            <div>
                <table className="table">
                    <thead> 
                        <tr> 
                            <th>Website</th> 
                            <th># Visits</th> 
                            <th>Recorded At</th> 
                        </tr> 
                    </thead>
                    <tbody>
                {data.map((report,i) => 
                    <tr key={`report-container-${report.id}`} >
                        <td>
                            {report._website}
                        </td>
                        <td>
                            {report._visits}
                        </td>
                        <td>
                            {report._date}
                        </td>
                    </tr>
                )}
                </tbody>
                </table>
            </div>
        );
      }
}

const mapStateToProps = state => {
    return {
        query: state.report.reportAction
    };
};
export default connect(mapStateToProps)(List);

