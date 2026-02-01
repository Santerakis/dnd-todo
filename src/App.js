import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { logout, updateAvatar } from './features/auth/authSlice';
import { addList, moveList, reorderTasks } from './features/todos/todoSlice';
import { openModal } from './features/modals/modalSlice';
import { GlobalModal } from './components/GlobalModal';
import TodoList from './features/todos/TodoList';
import './App.css';

function App() {
    const { user } = useSelector(state => state.auth);
    const allLists = useSelector(state => state.todos.lists);
    const dispatch = useDispatch();

    const onDragEnd = (result) => {
        const { source, destination, type } = result;
        if (!destination) return;

        if (type === 'list') {
            dispatch(moveList({ sourceIndex: source.index, destinationIndex: destination.index }));
        } else {
            dispatch(reorderTasks({
                listId: source.droppableId,
                sourceIndex: source.index,
                destinationIndex: destination.index
            }));
        }
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
                ctx.drawImage(img, (img.width-size)/2, (img.height-size)/2, size, size, 0, 0, 128, 128);
                dispatch(updateAvatar({ avatarBase64: canvas.toDataURL('image/jpeg', 0.75) }));
            };
        };
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
                    if (title?.trim()) dispatch(addList({ title: title.trim(), owner: user.username }));
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
                        {user.avatar ? <img src={user.avatar} alt="avatar" style={{width:'100%', height:'100%', borderRadius:'50%'}} /> : user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-dropdown">
                        <div className="dropdown-user-name">{user.username}</div>
                        <label className="avatar-text-link">Изменить фото<input type="file" onChange={handleAvatarChange} style={{display:'none'}}/></label>
                        <button className="logout-btn-styled" onClick={() => user.role === 'guest' ? dispatch(openModal({type:'auth', props:{isLogin:false}})) : dispatch(logout())}>
                            {user.role === 'guest' ? 'Регистрация' : 'Выйти'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="workspace">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="all-lists" direction="horizontal" type="list">
                        {(provided) => (
                            <div className="todo-workspace" {...provided.droppableProps} ref={provided.innerRef}>
                                {allLists.filter(l => l.owner === user.username || user.role === 'admin').map((l, index) => (
                                    <Draggable key={l.id} draggableId={l.id} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <TodoList list={l} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </main>
        </div>
    );
}

export default App;