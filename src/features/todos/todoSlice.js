import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        lists: [
            {
                id: 'l1',
                title: 'Основные задачи',
                owner: 'admin',
                tasks: [
                    { id: 't1', text: 'Добро пожаловать!', completed: false }
                ]
            }
        ]
    },
    reducers: {
        // Добавление нового списка
        addList: (state, action) => {
            const { title, owner } = action.payload;
            state.lists.push({
                id: Date.now().toString(),
                title,
                owner,
                tasks: []
            });
        },

        // Удаление списка
        removeList: (state, action) => {
            state.lists = state.lists.filter(l => l.id !== action.payload);
        },

        // Переименование списка
        renameList: (state, action) => {
            const list = state.lists.find(l => l.id === action.payload.id);
            if (list) {
                list.title = action.payload.title;
            }
        },

        // Добавление задачи в конкретный список
        addTask: (state, action) => {
            const list = state.lists.find(l => l.id === action.payload.listId);
            if (list) {
                list.tasks.push({
                    id: Date.now().toString(),
                    text: action.payload.text,
                    completed: false
                });
            }
        },

        // Переключение статуса выполнения задачи
        toggleTask: (state, action) => {
            const list = state.lists.find(l => l.id === action.payload.listId);
            if (list) {
                const task = list.tasks.find(t => t.id === action.payload.taskId);
                if (task) {
                    task.completed = !task.completed;
                }
            }
        },

        // Удаление задачи
        removeTask: (state, action) => {
            const list = state.lists.find(l => l.id === action.payload.listId);
            if (list) {
                list.tasks = list.tasks.filter(t => t.id !== action.payload.taskId);
            }
        },

        // Редьюсер для Drag & Drop задач (внутри списка или между списками)
        reorderTasks: (state, action) => {
            const { listId, sourceIndex, destinationIndex } = action.payload;
            const list = state.lists.find(l => l.id === listId);
            if (list) {
                const [removed] = list.tasks.splice(sourceIndex, 1);
                list.tasks.splice(destinationIndex, 0, removed);
            }
        },

        // Редьюсер для Drag & Drop самих списков (колонок)
        moveList: (state, action) => {
            const { sourceIndex, destinationIndex } = action.payload;
            const [removed] = state.lists.splice(sourceIndex, 1);
            state.lists.splice(destinationIndex, 0, removed);
        }
    }
});

// Экспортируем все экшены
export const {
    addList,
    removeList,
    renameList,
    addTask,
    toggleTask,
    removeTask,
    reorderTasks,
    moveList
} = todoSlice.actions;

// Экспортируем редьюсер для стора
export default todoSlice.reducer;