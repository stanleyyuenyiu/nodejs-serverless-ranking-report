import React from 'react'

const Loading = ({message = 'Loading.... please wait'}) => (
    <div className="text-loading">{message}</div>
);

export default Loading