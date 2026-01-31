import { createSlice } from '@reduxjs/toolkit';

const loadAllUsers = () => {
    const users = localStorage.getItem('app_users');
    return users ? JSON.parse(users) : [{ username: 'admin', password: '123', role: 'admin' }];
};

const GUEST_USER = { username: 'Guest', role: 'guest' };

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('current_user')) || GUEST_USER,
        isAuthenticated: true,
        error: null
    },
    reducers: {
        register: (state, action) => {
            const users = loadAllUsers();
            if (users.find(u => u.username === action.payload.username)) {
                state.error = "Имя пользователя уже занято";
                return;
            }
            users.push({ ...action.payload, role: 'user' });
            localStorage.setItem('app_users', JSON.stringify(users));
            state.error = null;
        },
        login: (state, action) => {
            const user = loadAllUsers().find(u => u.username === action.payload.username && u.password === action.payload.password);
            if (user) {
                state.user = user;
                localStorage.setItem('current_user', JSON.stringify(user));
                state.error = null;
            } else {
                state.error = "Неверный логин или пароль";
            }
        },
        logout: (state) => {
            localStorage.removeItem('current_user');
            state.user = GUEST_USER;
            state.error = null;
        },
        clearError: (state) => { state.error = null; }
    }
});

export const { register, login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
