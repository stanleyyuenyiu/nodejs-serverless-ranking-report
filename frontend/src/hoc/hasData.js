import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { CLEAR }  from 'Reducers/root'
import _ from 'lodash';

const unsetData = ( payload ) => {
    return { type: CLEAR, payload };
}


const hasData = ({loadAction,
    payload = {},
    loadingMessage,
    entityGroup,
    entityKey,
    hasPage = false,
    isReadUrlParam = false,
    localized = false,
    cache = false,
    unloadData = false,
    stateParam = {}
}) => WrappedComponent => {

    class HasData extends Component {

        constructor(props) {
            super(props);

            this.reloadData = this.reloadData.bind(this);
            this.loadData = false;
        }

        componentDidMount() {
            this.reloadData();
            this.loadData = true;
        }

        componentWillUnmount() {
             let { apiStatus } = this.props;
        
             this.loadData = false;

             if(unloadData)
             {
                this.props.unsetData( { entityGroup,entityKey});
             }
        }

        componentWillReceiveProps(nextProps) {

        }

        reloadData(_payload) {
            if(!_.isNil(this.props.data) && cache)
            {
                return;
            }

            let actionPayload = {
                ...payload,
                key: entityKey
            }

            if(!_.isNil(_payload))
            {
                actionPayload = {
                    ..._payload,
                    key: entityKey
                }
            }

            console.log(actionPayload)
            this.props.loadAction(actionPayload);
        }

        render() {
            
            return (
                <WrappedComponent
                    {...this.state}
                    {...this.props}
                    reloadData={this.reloadData}
                />
            )
        }
    };

    const mapStateToProps = (state) => {
        let data = state[entityGroup].entities[entityKey];
        let apiStatus = state[entityGroup].apiStatus[entityKey];
        let props = { data,apiStatus };

        return props;
    }

    const mapDispatchToProps = { loadAction, unsetData };

    return connect(mapStateToProps, mapDispatchToProps)(HasData);
}

export default hasData;