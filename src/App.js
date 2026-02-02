import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext } from '@hello-pangea/dnd';
import { logout, updateAvatar } from './features/auth/authSlice';
import { addList, updateListPosition, reorderTasks } from './features/todos/todoSlice';
import { openModal } from './features/modals/modalSlice';
import { GlobalModal } from './components/GlobalModal';
import TodoList from './features/todos/TodoList';
import { AdminDashboard } from './features/admin/AdminDashboard';
import './App.css';

function App() {
    const { user } = useSelector(state => state.auth);
    const allLists = useSelector(state => state.todos.lists);
    const dispatch = useDispatch();
    const [draggingList, setDraggingList] = useState(null);

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;
        dispatch(reorderTasks({
            listId: source.droppableId,
            sourceIndex: source.index,
            destinationIndex: destination.index
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 128; canvas.height = 128;
                const size = Math.min(img.width, img.height);
                ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 128, 128);
                dispatch(updateAvatar({ avatarBase64: canvas.toDataURL('image/jpeg', 0.75) }));
            };
        };
    };

    const handleMouseDown = (e, listId) => {
        if (e.target.closest('.tasks-container') || e.target.closest('button') || e.target.closest('input')) return;
        const list = allLists.find(l => l.id === listId);
        const currentPos = list?.position || { x: 50, y: 50 };
        const startX = e.pageX - currentPos.x;
        const startY = e.pageY - currentPos.y;
        const onMouseMove = (moveEvent) => {
            dispatch(updateListPosition({
                id: listId,
                position: { x: moveEvent.pageX - startX, y: moveEvent.pageY - startY }
            }));
        };
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            setDraggingList(null);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        setDraggingList(listId);
    };

    const handleCreateList = () => {
        if (user.role === 'guest' && allLists.filter(l => l.owner === user.username).length >= 1) {
            dispatch(openModal({ type: 'alert', props: { message: 'Гостям доступен только 1 список!' } }));
            return;
        }
        dispatch(openModal({
            type: 'prompt',
            props: {
                title: 'Новый список',
                onConfirm: (title) => {
                    if (title?.trim()) {
                        dispatch(addList({
                            title: title.trim(),
                            owner: user.username,
                            position: { x: 100, y: 100 }
                        }));
                    }
                }
            }
        }));
    };

    return (
        <div className="main-layout">
            <GlobalModal />
            <header className="app-header">
                <button className="create-list-btn" onClick={handleCreateList}>+ Создать список</button>
                <div className="app-logo">todos</div>
                <div className="profile-container">
                    <div className="avatar">
                        {user.avatar ? <img src={user.avatar} alt="avatar" /> : user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-dropdown">
                        <div className="dropdown-user-name">{user.username}</div>
                        <label className="avatar-text-link">Изменить фото<input type="file" onChange={handleAvatarChange} style={{ display: 'none' }} /></label>
                        <button className="logout-btn-styled" onClick={() => user.role === 'guest' ? dispatch(openModal({ type: 'auth', props: { isLogin: false } })) : dispatch(logout())}>
                            {user.role === 'guest' ? 'Регистрация' : 'Выйти'}
                        </button>
                    </div>
                </div>
            </header>
            <main className="workspace">
                {user.role === 'admin' && <AdminDashboard />}

                <DragDropContext onDragEnd={onDragEnd}>
                    {allLists
                        .filter(l => l.owner === user.username || user.role === 'admin')
                        .map((l) => {
                            const pos = l.position || { x: 50, y: 50 };
                            return (
                                <div
                                    key={l.id}
                                    className="draggable-list-wrapper"
                                    style={{
                                        left: pos.x,
                                        top: pos.y,
                                        position: 'absolute',
                                        zIndex: draggingList === l.id ? 100 : 10
                                    }}
                                    onMouseDown={(e) => handleMouseDown(e, l.id)}
                                >
                                    <TodoList list={l} />
                                </div>
                            );
                        })}
                </DragDropContext>
            </main>
        </div>
    );
}
export default App;