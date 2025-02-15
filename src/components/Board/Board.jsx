import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import Column from './Column';
import Task from './Task';
import AddColumnButton from './AddColumnButton';

const initialColumns = {
  todo: {
    id: 'todo',
    title: 'To Do',
    tasks: []
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    tasks: []
  },
  done: {
    id: 'done',
    title: 'Done',
    tasks: []
  }
};

export default function Board() {
  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem('kanbanColumns');
    return savedColumns ? JSON.parse(savedColumns) : initialColumns;
  });
  const [activeTask, setActiveTask] = useState(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  useEffect(() => {
    localStorage.setItem('kanbanColumns', JSON.stringify(columns));
  }, [columns]);

  const addColumn = (title) => {
    const id = uuidv4();
    setColumns(prev => ({
      ...prev,
      [id]: {
        id,
        title,
        tasks: []
      }
    }));
    setIsAddingColumn(false);
  };

  const updateColumn = (columnId, updates) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        ...updates
      }
    }));
  };

  const deleteColumn = (columnId) => {
    setColumns(prev => {
      const newColumns = { ...prev };
      delete newColumns[columnId];
      return newColumns;
    });
  };

  const addTask = (columnId) => {
    const newTask = {
      id: uuidv4(),
      title: 'New Task',
      description: '',
      dueDate: '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        tasks: [...prev[columnId].tasks, newTask]
      }
    }));
  };

  const updateTask = (columnId, taskId, updates) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        tasks: prev[columnId].tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      }
    }));
  };

  const deleteTask = (columnId, taskId) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        tasks: prev[columnId].tasks.filter(task => task.id !== taskId)
      }
    }));
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const activeColumn = Object.values(columns).find(col => 
      col.tasks.some(task => task.id === active.id)
    );
    const activeTaskData = activeColumn?.tasks.find(task => task.id === active.id);
    setActiveTask(activeTaskData);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeColumnId = active.data.current.columnId;
    const overColumnId = over.data.current.columnId;

    if (activeColumnId !== overColumnId) {
      setColumns(prev => {
        const activeColumn = prev[activeColumnId];
        const overColumn = prev[overColumnId];

        const activeTask = activeColumn.tasks.find(t => t.id === active.id);
        const filteredTasks = activeColumn.tasks.filter(t => t.id !== active.id);

        return {
          ...prev,
          [activeColumnId]: {
            ...activeColumn,
            tasks: filteredTasks
          },
          [overColumnId]: {
            ...overColumn,
            tasks: [...overColumn.tasks, activeTask]
          }
        };
      });
    }

    setActiveTask(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <div className="h-full overflow-x-auto">
        <div className="flex gap-4 h-full min-w-fit">
          {Object.values(columns).map(column => (
            <div key={column.id} className="min-w-[300px]">
              <Column
                column={column}
                onAddTask={() => addTask(column.id)}
                onUpdateTask={(taskId, updates) => updateTask(column.id, taskId, updates)}
                onDeleteTask={(taskId) => deleteTask(column.id, taskId)}
                onUpdateColumn={(updates) => updateColumn(column.id, updates)}
                onDeleteColumn={() => deleteColumn(column.id)}
              />
            </div>
          ))}
          <AddColumnButton 
            isAdding={isAddingColumn}
            onAdd={addColumn}
            onCancel={() => setIsAddingColumn(false)}
            onAddClick={() => setIsAddingColumn(true)}
          />
        </div>
      </div>
      <DragOverlay>
        {activeTask ? <Task task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
} 