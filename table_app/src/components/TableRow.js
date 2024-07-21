import React from 'react';
import '../styles/TableRow.css';

const TableRow = ({ user, onClick }) => {
    return (
        <tr onClick={onClick} className="user-row">
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.age}</td>
            <td>{user.gender}</td>
            <td>{user.phone}</td>
            <td>{user.address.city}, {user.address.address}</td>
        </tr>
    );
};

export default TableRow;