import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
    name: 'todos',
    initialState: { lists: [] },
    reducers: {
        addList: (state, action) => {
            const { title, owner, role } = action.payload;
            if (role === 'guest' && state.lists.filter(l => l.owner === owner).length >= 1) {
                alert("Гостям доступен только 1 список!");
                return;
            }
            state.lists.push({
                id: Date.now().toString(),
                title,
                owner,
                tasks: [],
                position: { x: 100, y: 100 }
            });
        },
        removeList: (state, action) => {
            state.lists = state.lists.filter(l => l.id !== action.payload);
        },
        renameList: (state, action) => {
            const list = state.lists.find(l => l.id === action.payload.id);
            if (list) list.title = action.payload.title;
        },
        updatePosition: (state, action) => {
            const list = state.lists.find(l => l.id === action.payload.id);
            if (list) list.position = action.payload.position;
        },
        addTask: (state, action) => {
            const list = state.lists.find(l => l.id === action.payload.listId);
            if (list) {
                if (action.payload.role === 'guest' && list.tasks.length >= 5) {
                    alert("Лимит гостя: 5 заметок!");
                    return;
                }
                list.tasks.push({ id: Date.now(), text: action.payload.text });
            }
        },
        removeTask: (state, action) => {
            const list = state.lists.find(l => l.id === action.payload.listId);
            if (list) list.tasks = list.tasks.filter(t => t.id !== action.payload.taskId);
        },
        reorderTasks: (state, action) => {
            const { listId, startIndex, endIndex } = action.payload;
            const list = state.lists.find(l => l.id === listId);
            if (list) {
                const [removed] = list.tasks.splice(startIndex, 1);
                list.tasks.splice(endIndex, 0, removed);
            }
        }
    }
});

export const { addList, removeList, renameList, updatePosition, addTask, removeTask, reorderTasks } = todoSlice.actions;
export default todoSlice.reducer;
