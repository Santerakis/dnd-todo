import React from 'react';
import { useSelector } from 'react-redux';
import './AdminDashboard.css';

export const AdminDashboard = () => {
    // Загружаем всех пользователей из localStorage
    const allUsers = JSON.parse(localStorage.getItem('app_users')) || [];
    // Загружаем все списки из Redux
    const allLists = useSelector(state => state.todos.lists);

    const getUserStats = (username) => {
        const userLists = allLists.filter(l => l.owner === username);
        const totalTasks = userLists.reduce((sum, list) => sum + list.tasks.length, 0);
        return {
            listsCount: userLists.length,
            tasksCount: totalTasks
        };
    };

    return (
        <div className="crm-container">
            <h2 className="modal-title">Панель администратора (CRM)</h2>
            <table className="crm-table">
                <thead>
                <tr>
                    <th>Аватар</th>
                    <th>Пользователь</th>
                    <th>Списки</th>
                    <th>Задачи</th>
                </tr>
                </thead>
                <tbody>
                {allUsers.map(u => {
                    const stats = getUserStats(u.username);
                    return (
                        <tr key={u.username}>
                            <td>
                                <div className="avatar small-avatar">
                                    {u.avatar ? (
                                        <img src={u.avatar} alt="ava" />
                                    ) : (
                                        u.username.charAt(0).toUpperCase()
                                    )}
                                </div>
                            </td>
                            <td>
                                <span className="user-name-cell">{u.username}</span>
                                {u.role === 'admin' && <span className="admin-badge">Admin</span>}
                            </td>
                            <td>{stats.listsCount}</td>
                            <td>{stats.tasksCount}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};