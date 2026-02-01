import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '../features/todos/todoSlice';
import authReducer from '../features/auth/authSlice';
import modalReducer from '../features/modals/modalSlice';

const loadFromLocalStorage = () => {
    try {
        const state = localStorage.getItem('todoAppState');
        return state ? JSON.parse(state) : undefined;
    } catch { return undefined; }
};

const saveToLocalStorage = (state) => {
    try {
        if (state.auth.user?.role === 'guest') return;
        localStorage.setItem('todoAppState', JSON.stringify(state));
    } catch (e) { console.error(e); }
};

export const store = configureStore({
    reducer: {
        todos: todoReducer,
        auth: authReducer,
        modal: modalReducer
    },
    preloadedState: loadFromLocalStorage()
});

store.subscribe(() => saveToLocalStorage(store.getState()));