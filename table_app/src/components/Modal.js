import React from 'react';
import '../styles/Modal.css';

const Modal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>{user.firstName} {user.lastName}</h2>
                <p>Возраст: {user.age}</p>
                <p>Пол: {user.gender}</p>
                <p>Адрес: {user.address.city}, {user.address.street}</p>
                <p>Рост: {user.height} см</p>
                <p>Вес: {user.weight} кг</p>
                <p>Телефон: {user.phone}</p>
                <p>Email: {user.email}</p>
            </div>
        </div>
    );
};

export default Modal;