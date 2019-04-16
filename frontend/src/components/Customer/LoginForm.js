import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Control, Form, Errors,actions } from 'react-redux-form';
import { login, reset } from 'Actions/customer';
import { calTotal } from 'Actions/cart';
import { withRouter } from 'react-router-dom'
import _ from 'lodash';
class LoginForm extends Component {

        constructor(props) {
            super(props);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.renderMessage = this.renderMessage.bind(this);
            this.state = {
                messages : [],
                payload: {}
            }
        }

        componentWillUnmount() {
            this.props.reset();

        }

        handleSubmit(fm) {
            let {history,login, calTotal,cart} = this.props;
            let validation = window.__initialState.customers
            let result = validation.filter((v)=>v.user == fm.user && v.password == fm.password);
            if(result.length < 1)
            {
                this.setState({messages: [{error : "User or Password is incorrect"}]});
                return;
            }

            login({group:fm.user});
            history.push("/");
        }

        renderMessage(){
            const {messages} = this.state;
            return messages.map((message, k) => {
                if(typeof(message.success) != "undefined")
                {
                    return (
                        <div className="alert alert-success"  key="message-{k}">
                            {message.success}
                        </div> 
                    )
                }
                if(typeof(message.error) != "undefined")
                {
                    return (
                        <div className="alert alert-danger"  key="message-{k}">
                            {message.error}
                        </div> 
                    )
                }
            })
        }

        render() {
            const messages = this.renderMessage();
            let {history} = this.props;
            return (
                  <div>
                    {messages}
                    <Form model="login" onSubmit={(fm) => this.handleSubmit(fm)}>
                      <div className="row">
                        <div className="col-md-4 col-xs-12">
                          <div className="form-group" >
                            <label htmlFor="txt-user" className="control-label">User Name</label>
                            <Control.text model="login.user" name="user" id="txt-user" type="text" className="form-control" placeholder="User Name"
                            validators={{
                                required: (val) =>!_.isEmpty(val)
                            }}
                            validateOn="blur"
                             />
                             <Errors
                                className="help-block errors"
                                model="login.user"
                                show="touched"
                                messages={{
                                  required: "required"
                                }}
                              />
                          </div>
                        </div>

                        <div className="col-md-4 col-xs-12">
                          <div className="form-group">
                            <label htmlFor="txt-pwd" className="control-label">Password</label>
                            <Control.text model="login.password" name="password" id="txt-pwd" type="password" className="form-control" placeholder="Password"
                            validators={{
                                required: (val) =>!_.isEmpty(val)
                            }}
                            validateOn="blur"
                             />
                             <Errors
                                className="help-block errors"
                                model="login.password"
                                show="touched"
                                messages={{
                                  required: "required"
                                }}
                              />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xs-12 col-sm-4">
                            <div className="row">
                              <div className="col-xs-12 col-sm-6">
                                <button type="submit" id="btn-change-pwd" className="btn btn-danger">Login</button>&nbsp;
                                <button type="button" onClick={()=>{ history.push("/")}} className="btn ">Back</button>
                              </div>
                            </div>
                        </div>
                      </div>
                    </Form>
                  </div>
            )
        }
    };

function mapStateToProps(state) {
  return { 
    customer: state
   };
}
const mapDispatchToProps = { login, reset,calTotal };

export default compose(
    withRouter,
    connect(mapStateToProps,mapDispatchToProps)
)(LoginForm);


