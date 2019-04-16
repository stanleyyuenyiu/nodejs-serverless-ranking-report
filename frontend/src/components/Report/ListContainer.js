import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import isContainer from 'Hoc/isContainer';
import { loadReport } from 'Actions/report';
import List from './List';

export default compose(
    isContainer({
        data: {
            loadAction: loadReport,
            entityGroup: 'report',
            entityKey: 'list'
        }
    })
)(List);


