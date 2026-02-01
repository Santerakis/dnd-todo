import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from './authSlice';

export const AuthForm = ({ initialIsLogin = true }) => {
    const [isLogin, setIsLogin] = useState(initialIsLogin);
    const [form, setForm] = useState({ username: '', password: '' });
    const { error } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLogin(initialIsLogin);
    }, [initialIsLogin]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            dispatch(login(form));
        } else {
            dispatch(register(form));
            // Небольшая задержка перед переключением на вход после регистрации
            setTimeout(() => {
                if (!error) {
                    setIsLogin(true);
                    setForm(prev => ({ ...prev, password: '' }));
                }
            }, 500);
        }
    };

    return (
        <div className="auth-modal-inner">
            <form onSubmit={handleSubmit}>
                <h2 className="modal-title">{isLogin ? 'Вход' : 'Регистрация'}</h2>
                {error && <p className="auth-error">{error}</p>}
                <input
                    className="modal-input"
                    type="text"
                    placeholder="Логин"
                    value={form.username}
                    onChange={(e) => setForm({...form, username: e.target.value})}
                    required
                />
                <input
                    className="modal-input"
                    type="password"
                    placeholder="Пароль"
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    required
                />
                <button type="submit" className="main-btn auth-submit-btn">
                    {isLogin ? 'Войти' : 'Создать аккаунт'}
                </button>
                <p onClick={() => { setIsLogin(!isLogin); dispatch(clearError()); }} className="toggle-auth">
                    {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
                </p>
            </form>
        </div>
    );
};