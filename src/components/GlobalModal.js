import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../features/modals/modalSlice';
import { AuthForm } from '../features/auth/AuthForm';
import './GlobalModal.css';

export const GlobalModal = () => {
    const { isOpen, type, props } = useSelector(state => state.modal);
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState('');

    if (!isOpen) return null;

    const handleClose = () => dispatch(closeModal());

    const handleConfirm = () => {
        if (type === 'prompt') {
            props.onConfirm(inputValue);
            setInputValue('');
        } else {
            props.onConfirm();
        }
        handleClose();
    };

    const renderContent = () => {
        switch (type) {
            case 'auth':
                return <AuthForm initialIsLogin={props.isLogin} />;
            case 'confirm':
                return (
                    <div className="modal-inner">
                        <h3>{props.title || 'Вы уверены?'}</h3>
                        <p>{props.message}</p>
                        <div className="modal-btns">
                            <button className="main-btn" onClick={handleConfirm}>Да</button>
                            <button className="secondary-btn" onClick={handleClose}>Отмена</button>
                        </div>
                    </div>
                );
            case 'prompt':
                return (
                    <div className="modal-inner">
                        <h3>{props.title}</h3>
                        <input
                            className="modal-input"
                            autoFocus
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                            placeholder="Введите текст..."
                        />
                        <div className="modal-btns">
                            <button className="main-btn" onClick={handleConfirm}>ОК</button>
                            <button className="secondary-btn" onClick={handleClose}>Отмена</button>
                        </div>
                    </div>
                );
            case 'alert':
                return (
                    <div className="modal-inner">
                        <h3>Внимание</h3>
                        <p>{props.message}</p>
                        <button className="main-btn" onClick={handleClose}>Понятно</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {type !== 'auth' && <button className="modal-close-x" onClick={handleClose}>×</button>}
                {renderContent()}
            </div>
        </div>
    );
};