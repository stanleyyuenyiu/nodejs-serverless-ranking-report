import React from 'react'
const Error = ({apiStatus, reloadData}) => (
  <div className="error">
    <p>
    {apiStatus.error.message
        ? apiStatus.error.message
        : apiStatus.error.code 
    }
    </p>
  </div>
)

export default Error