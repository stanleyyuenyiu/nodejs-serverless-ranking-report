import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { spinnerService, SpinnerComponent as Spinner } from 'Components/Common/Spinner';
class Total extends Component {

        constructor(props) {
            super(props);
        }

        
        componentWillMount(){
        }

        render() {
            let {total} = this.props 

            return (
                <div className="cartSpinner">
                    <Spinner name="cartSpinner" group="main">
                      <div className="spinner-container">
                        <div>
                            <div className="spinner">
                                <div className="spinner-loader">
                                    <div className="rect1"></div>
                                    <div className="rect2"></div>
                                    <div className="rect3"></div>
                                    <div className="rect4"></div>
                                    <div className="rect5"></div>
                                </div>
                            </div>
                        </div>
                      </div>
                    </Spinner>
                    <div className="row">
                        <div className="col-xs-7">
                           
                        </div>
                        <div className="col-xs-5 text-right">
                            Total : {typeof(total) != "undefined" ? total.total : 0}
                        </div>
                    </div>

                    <br/>
                    <br/>
                </div>
                )
        }
}



const mapStateToProps = state => {
    
    return {
        total : state.cart.entities.total
    };
};

export default compose(
    connect(mapStateToProps, null)
)(Total);


