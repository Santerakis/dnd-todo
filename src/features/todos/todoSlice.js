import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        lists: [
            {
                id: crypto.randomUUID(),
                title: 'Основные задачи',
                owner: 'admin',
                position: { x: 50, y: 50 },
                tasks: [{ id: crypto.randomUUID(), text: 'Добро пожаловать!', completed: false }]
            }
        ]
    },
    reducers: {
        addList: (state, action) => {
            state.lists.push({
                id: crypto.randomUUID(),
                title: action.payload.title,
                owner: action.payload.owner,
                position: action.payload.position || { x: 100, y: 100 },
                tasks: []
            });
        },
        updateListPosition: (state, action) => {
            const list = state.lists.find(l => l.id === action.payload.id);
            if (list) {
                list.position = action.payload.position;
            }
        },
        removeList: (state, action) => {
            state.lists = state.lists.filter(l => l.id !== action.payload);
        },
        renameList: (state, action) => {
            const list = state.lists.find(l => l.id === action.payload.id);
            if (list) list.title = action.payload.title;
        },
        addTask: (state, action) => {
            const list = state.lists.find(l => l.id === action.payload.listId);
            if (list) list.tasks.push({ id: crypto.randomUUID(), text: action.payload.text, completed: false });
        },
        toggleTask: (state, action) => {
            const list = state.lists.find(l => l.id === action.payload.listId);
            const task = list?.tasks.find(t => t.id === action.payload.taskId);
            if (task) task.completed = !task.completed;
        },
        removeTask: (state, action) => {
            const list = state.lists.find(l => l.id === action.payload.listId);
            if (list) list.tasks = list.tasks.filter(t => t.id !== action.payload.taskId);
        },
        reorderTasks: (state, action) => {
            const { listId, sourceIndex, destinationIndex } = action.payload;
            const list = state.lists.find(l => l.id === listId);
            if (list) {
                const [removed] = list.tasks.splice(sourceIndex, 1);
                list.tasks.splice(destinationIndex, 0, removed);
            }
        }
    }
});

export const { addList, updateListPosition, removeList, renameList, addTask, toggleTask, removeTask, reorderTasks } = todoSlice.actions;
export default todoSlice.reducer;