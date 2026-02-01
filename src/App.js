import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateAvatar } from './features/auth/authSlice';
import { addList, removeList, renameList } from './features/todos/todoSlice';
import { openModal } from './features/modals/modalSlice';
import { GlobalModal } from './components/GlobalModal';
import TodoList from './features/todos/TodoList';
import './App.css';

function App() {
    const { user } = useSelector(state => state.auth);
    const allLists = useSelector(state => state.todos.lists);
    const dispatch = useDispatch();

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
                canvas.width = 128;
                canvas.height = 128;
                const sourceSize = Math.min(img.width, img.height);
                const sourceX = (img.width - sourceSize) / 2;
                const sourceY = (img.height - sourceSize) / 2;
                ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, 128, 128);
                const base64 = canvas.toDataURL('image/jpeg', 0.75);
                dispatch(updateAvatar({ avatarBase64: base64 }));
            };
        };
    };

    const handleCreateList = () => {
        dispatch(openModal({
            type: 'prompt',
            props: {
                title: 'Новый список',
                onConfirm: (title) => {
                    if (title && title.trim()) {
                        dispatch(addList({ title: title.trim(), owner: user.username, role: user.role }));
                    }
                }
            }
        }));
    };

    return (
        <div className="main-layout">
            <GlobalModal />
            <header className="app-header">
                <button className="create-list-btn" onClick={handleCreateList}>
                    + Создать список
                </button>
                <div className="app-logo">todos</div>
                <div className="profile-container">
                    <div className="avatar" style={user.avatar ? { background: 'none' } : {}}>
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt="avatar"
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ) : (
                            user.username.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="profile-dropdown">
                        <div className="dropdown-user-name">{user.username}</div>

                        <label className="avatar-text-link">
                            Изменить фото
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                style={{ display: 'none' }}
                            />
                        </label>

                        {user.role === 'guest' ? (
                            <button className="logout-btn-styled" onClick={() => dispatch(openModal({ type: 'auth', props: { isLogin: false } }))}>
                                Регистрация
                            </button>
                        ) : (
                            <button className="logout-btn-styled" onClick={() => dispatch(logout())}>
                                Выйти
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="workspace">
                {user.role === 'admin' ? (
                    <div className="crm-container">
                        <table className="crm-table">
                            <thead>
                            <tr>
                                <th>Имя</th>
                                <th>Автор</th>
                                <th>Задач</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {allLists.map(l => (
                                <tr key={l.id}>
                                    <td>{l.title}</td>
                                    <td>{l.owner}</td>
                                    <td>{l.tasks.length}</td>
                                    <td>
                                        <button className="crm-btn edit" onClick={() => {
                                            dispatch(openModal({
                                                type: 'prompt',
                                                props: {
                                                    title: 'Переименовать',
                                                    onConfirm: (newTitle) => dispatch(renameList({ id: l.id, title: newTitle }))
                                                }
                                            }))
                                        }}>Изменить</button>
                                        <button className="crm-btn delete" onClick={() => {
                                            dispatch(openModal({
                                                type: 'confirm',
                                                props: {
                                                    title: 'Удаление',
                                                    message: `Удалить список "${l.title}"?`,
                                                    onConfirm: () => dispatch(removeList(l.id))
                                                }
                                            }))
                                        }}>Удалить</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="todo-workspace">
                        {allLists.filter(l => l.owner === user.username).map(l => <TodoList key={l.id} list={l} />)}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;