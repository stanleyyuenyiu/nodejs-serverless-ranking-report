import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setDate } from 'Actions/report';
class Control extends Component {

        constructor(props) {
            super(props);
            this.state = {
                startDate: new Date('1970-01-01'),
                endDate : new Date()
            }
            this.handleStartChange = this.handleStartChange.bind(this);
            this.handleEndChange = this.handleEndChange.bind(this);
            this.sendQuery = this.sendQuery.bind(this);
        }


        sendQuery(){
            console.log("sendQuery")
            this.props.setDate({...this.state})
        }

        handleStartChange(date) {
            this.setState({
              startDate: date
            });
        }

        handleEndChange(date) {
            this.setState({
              endDate: date
            });
        }

        render() {
            return (
                <div className="form-inline">
                    <div className="form-group">
                        <label htmlFor="start">Start: </label>
                        <DatePicker
                        selected={this.state.startDate}
                        selectsStart
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                         onChange={this.handleStartChange}
                         dateFormat="yyyy-MM-dd"
                         className="form-control"
                    />
                    </div>
                    <div className="form-group">
                        <label htmlFor="end">End: </label>
                        <DatePicker
                        selected={this.state.endDate}
                        selectsEnd
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                         onChange={this.handleEndChange}
                         dateFormat="yyyy-MM-dd"
                         className="form-control"
                    />
                    </div>
                    <button type="button" className="btn btn-default" onClick={()=>{this.sendQuery()}}>Send Query</button>
                </div>
                )
        }
}

const mapDispatchToProps = { setDate };

export default compose(
    connect(null, mapDispatchToProps)
)(Control);


