import { createSlice } from '@reduxjs/toolkit';

const loadAllUsers = () => {
    const users = localStorage.getItem('app_users');
    return users ? JSON.parse(users) : [{ username: 'admin', password: '123', role: 'admin', avatar: null }];
};

const GUEST_USER = { username: 'Guest', role: 'guest', avatar: null };

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
            users.push({
                ...action.payload,
                role: 'user',
                avatar: null
            });
            localStorage.setItem('app_users', JSON.stringify(users));
            state.error = null;
        },
        login: (state, action) => {
            const user = loadAllUsers().find(
                u => u.username === action.payload.username && u.password === action.payload.password
            );
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
        },
        clearError: (state) => {
            state.error = null;
        },
        // Новый экшен — обновление аватара текущего пользователя
        updateAvatar: (state, action) => {
            const { avatarBase64 } = action.payload;
            state.user.avatar = avatarBase64;

            // Обновляем в current_user
            localStorage.setItem('current_user', JSON.stringify(state.user));

            // Обновляем в списке всех пользователей
            const users = loadAllUsers();
            const updatedUsers = users.map(u =>
                u.username === state.user.username
                    ? { ...u, avatar: avatarBase64 }
                    : u
            );
            localStorage.setItem('app_users', JSON.stringify(updatedUsers));
        }
    }
});

export const { register, login, logout, clearError, updateAvatar } = authSlice.actions;
export default authSlice.reducer;