import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        isOpen: false,
        type: null, // 'auth', 'prompt', 'confirm', 'alert'
        props: {}   // Данные для модалки: заголовок, callback и т.д.
    },
    reducers: {
        openModal: (state, action) => {
            state.isOpen = true;
            state.type = action.payload.type;
            state.props = action.payload.props;
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.type = null;
            state.props = {};
        }
    }
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;