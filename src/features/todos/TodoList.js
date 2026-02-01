import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { toggleTask, removeTask, renameList, removeList, addTask } from './todoSlice';
import { openModal } from '../modals/modalSlice';
import './TodoList.css';

const TodoList = ({ list }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    const handleAddTask = () => {
        if (user.role === 'guest' && list.tasks.length >= 5) {
            dispatch(openModal({ type: 'alert', props: { message: 'Лимит гостя: 5 заметок!' } }));
            return;
        }
        dispatch(openModal({
            type: 'prompt',
            props: {
                title: 'Новая задача',
                onConfirm: (text) => { if(text?.trim()) dispatch(addTask({ listId: list.id, text: text.trim() })) }
            }
        }));
    };

    return (
        <div className="todo-list">
            <div className="list-header">
                <h3 className="list-title">{list.title}</h3>
                <div className="list-actions">
                    <button className="action-icon-btn" onClick={() => dispatch(openModal({type:'prompt', props:{title:'Переименовать', onConfirm:(t)=>dispatch(renameList({id:list.id, title:t}))}}))}>✎</button>
                    <button className="action-icon-btn delete-btn" onClick={() => dispatch(openModal({type:'confirm', props:{title:'Удалить?', onConfirm:()=>dispatch(removeList(list.id))}}))}>×</button>
                </div>
            </div>

            <Droppable droppableId={list.id} type="task">
                {(provided) => (
                    <div className="tasks-container" {...provided.droppableProps} ref={provided.innerRef}>
                        {list.tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided) => (
                                    <div className={`task-item ${task.completed ? 'completed' : ''}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <div className="task-text" onClick={() => dispatch(toggleTask({ listId: list.id, taskId: task.id }))}>
                                            <span className="checkbox">{task.completed ? '✓' : ''}</span>
                                            {task.text}
                                        </div>
                                        <button className="remove-task-btn" onClick={() => dispatch(removeTask({ listId: list.id, taskId: task.id }))}>×</button>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            <button className="add-task-btn" onClick={handleAddTask}>+ Добавить задачу</button>
        </div>
    );
};

export default TodoList;