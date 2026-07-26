import { useState, useEffect } from "react";

const Users = () => {
    const [users, setUsers] = useState([]);

    return (
        <article>
            <h1>Users List</h1>  
            {users?.length 
            ? (
                <ul>
                    {users.map((user, i) => <li key={i}>{user?.username}</li>)}
                </ul>
            ) : <p>No users to display.</p>
            }
        </article>
    );
};

export default Users;