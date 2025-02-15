import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import Task from './Task';

export default function Column({ 
  column, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask,
  onUpdateColumn,
  onDeleteColumn 
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      columnId: column.id
    }
  });

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      onUpdateColumn({ title: editedTitle.trim() });
      setIsEditingTitle(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="h-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 flex flex-col border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 flex-1">
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex-1">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full p-1 text-lg border rounded dark:bg-gray-700 dark:text-white"
                autoFocus
                onBlur={handleTitleSubmit}
              />
            </form>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <h2 
                className="text-lg font-semibold text-gray-700 dark:text-gray-200 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsEditingTitle(true)}
              >
                {column.title}
              </h2>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {column.tasks.length}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddTask}
            className="p-1.5 px-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow"
          >
            + Add Task
          </button>
          <button
            onClick={onDeleteColumn}
            className="p-1.5 bg-white dark:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px] pr-2 custom-scrollbar">
        {column.tasks.map(task => (
          <Task
            key={task.id}
            task={task}
            columnId={column.id}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
} 