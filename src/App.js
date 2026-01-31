import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './features/auth/authSlice';
import { addList, removeList, renameList } from './features/todos/todoSlice';
import { AuthForm } from './features/auth/AuthForm';
import TodoList from './features/todos/TodoList';
import './App.css';

function App() {
    const { user } = useSelector(state => state.auth);
    const allLists = useSelector(state => state.todos.lists);
    const dispatch = useDispatch();

    const [authModal, setAuthModal] = useState({ open: false, isLogin: true });

    const isGuest = user?.role === 'guest';
    const isAdmin = user?.role === 'admin';

    // Закрытие модалки при успешном входе
    useEffect(() => {
        if (!isGuest && authModal.open) {
            setAuthModal(prev => ({ ...prev, open: false }));
        }
    }, [isGuest, authModal.open]);

    const handleCreateList = () => {
        const t = prompt('Название списка:');
        if(t) dispatch(addList({ title: t, owner: user.username, role: user.role }));
    };

    return (
        <div className="main-layout">
            <header className="app-header">
                <button className="create-list-btn" onClick={handleCreateList}>
                    + Создать список
                </button>
                <div className="app-logo">todos</div>
                <div className="profile-container">
                    <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
                    <div className="profile-dropdown">
                        <div className="dropdown-user-name">{user.username}</div>
                        <div className="dropdown-spacer"></div>
                        {isGuest ? (
                            <button
                                className="logout-btn-styled"
                                onClick={() => setAuthModal({ open: true, isLogin: false })}
                            >
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

            {/* МОДАЛЬНОЕ ОКНО */}
            {authModal.open && (
                <div
                    className="auth-modal-overlay"
                    onClick={() => setAuthModal({ ...authModal, open: false })}
                >
                    {/* Клик по самой форме не закрывает окно */}
                    <div onClick={e => e.stopPropagation()}>
                        <AuthForm initialIsLogin={authModal.isLogin} />
                    </div>
                </div>
            )}

            <main className="workspace">
                {isAdmin ? (
                    <div className="crm-container">
                        <h2 className="crm-title">CRM Управление</h2>
                        <table className="crm-table">
                            <thead><tr><th>Название</th><th>Владелец</th><th>Задач</th><th>Действия</th></tr></thead>
                            <tbody>
                            {allLists.map(l => (
                                <tr key={l.id}>
                                    <td>{l.title}</td><td>{l.owner}</td><td>{l.tasks.length}</td>
                                    <td>
                                        <button className="crm-btn edit" onClick={() => dispatch(renameList({id: l.id, title: prompt('Имя:', l.title)}))}>Изменить</button>
                                        <button className="crm-btn delete" onClick={() => dispatch(removeList(l.id))}>Удалить</button>
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
