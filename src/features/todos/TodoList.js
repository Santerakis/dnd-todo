import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable as Orderable } from '@hello-pangea/dnd';
import {
    updatePosition,
    removeList,
    renameList,
    addTask,
    removeTask,
    reorderTasks
} from './todoSlice';
import './todos.css';

const TodoList = ({ list }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const nodeRef = useRef(null);

    // Флаг для блокировки перемещения карточки при dnd задач
    const [isDraggingTask, setIsDraggingTask] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isOwner = list.owner === user?.username;
    const canEdit = isAdmin || isOwner;

    const handleStop = (e, data) => {
        dispatch(updatePosition({ id: list.id, position: { x: data.x, y: data.y } }));
    };

    // Переименование по двойному клику
    const handleDoubleClick = () => {
        if (!canEdit) return;
        const newTitle = prompt('Введите новое название списка:', list.title);
        if (newTitle && newTitle.trim()) {
            dispatch(renameList({ id: list.id, title: newTitle.trim() }));
        }
    };

    const onDragStart = () => setIsDraggingTask(true);

    const onDragEnd = (result) => {
        setIsDraggingTask(false);
        if (!result.destination) return;
        dispatch(reorderTasks({
            listId: list.id,
            startIndex: result.source.index,
            endIndex: result.destination.index,
        }));
    };

    const renderTask = (task, index) => (
        <Orderable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
            {(provided, snapshot) => {
                const style = {
                    ...provided.draggableProps.style,
                    width: snapshot.isDragging ? '236px' : '100%',
                };

                const element = (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`task-item ${snapshot.isDragging ? 'dragging' : ''}`}
                        style={style}
                    >
                        <span className="task-text">{task.text}</span>
                        <button
                            className="delete-task-small"
                            onClick={() => dispatch(removeTask({ listId: list.id, taskId: task.id }))}
                        >
                            ×
                        </button>
                    </div>
                );

                if (snapshot.isDragging) {
                    return ReactDOM.createPortal(element, document.body);
                }
                return element;
            }}
        </Orderable>
    );

    return (
        <Draggable
            nodeRef={nodeRef}
            handle=".drag-handle"
            defaultPosition={list.position}
            onStop={handleStop}
            disabled={isDraggingTask}
        >
            <div className="todo-card" ref={nodeRef}>
                <div className="drag-handle">
          <span
              className="list-title"
              onDoubleClick={handleDoubleClick}
              title="Двойной клик для переименования"
          >
            {list.title}
          </span>
                    <button className="delete-list-icon" onClick={() => {
                        if(window.confirm('Удалить этот список?')) dispatch(removeList(list.id))
                    }}>×</button>
                </div>

                <div className="todo-body">
                    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                        <Droppable droppableId={list.id}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`tasks-container ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                >
                                    {list.tasks.map((task, index) => renderTask(task, index))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <button onClick={() => {
                        const t = prompt('Новая задача:');
                        if(t) dispatch(addTask({ listId: list.id, text: t, role: user.role }))
                    }} className="add-btn">+ Добавить задачу</button>
                </div>
            </div>
        </Draggable>
    );
};

export default TodoList;
