import React from 'react';


const UserQuery = ({ obj }) => {
        const { query } = obj
        return <div className="user-query">
                <span>{query}</span>
        </div>
}


export default UserQuery