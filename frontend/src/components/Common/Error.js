import React from 'react'
const Error = ({apiStatus, reloadData}) => {

	return (
  <div className="error">
    <p>
     Something Wrong, please <a href="#" onClick={(e)=>{window.location.reload(true)}}>Reload</a>
    </p>
  </div>
)}

export default Error