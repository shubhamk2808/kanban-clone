import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';

export default function Task({ task, columnId, onUpdate, onDelete, isDragging }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description || '',
    dueDate: task.dueDate || '',
    status: task.status || 'pending'
  });

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      columnId
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(task.id, editedTask);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const statusOptions = ['pending', 'in-progress', 'completed'];

  // Separate drag handle from the content
  const DragHandle = () => (
    <div {...attributes} {...listeners} className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move text-gray-400 hover:text-gray-600 transition-colors duration-200">
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
      </svg>
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white dark:bg-gray-700/90 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600
        hover:shadow-md transition-shadow duration-200
        ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
    >
      {!isEditing && <DragHandle />}
      
      {isEditing ? (
        <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()} className="space-y-3">
          <div>
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
              placeholder="Task title"
              autoFocus
            />
          </div>
          
          <div>
            <textarea
              name="description"
              value={editedTask.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:text-white text-sm min-h-[60px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
              placeholder="Add description"
            />
          </div>
          
          <div className="flex gap-2">
            <input
              type="date"
              name="dueDate"
              value={editedTask.dueDate}
              onChange={handleChange}
              className="flex-1 p-2 border rounded-lg dark:bg-gray-600 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <select
              name="status"
              value={editedTask.status}
              onChange={handleChange}
              className="flex-1 p-2 border rounded-lg dark:bg-gray-600 dark:text-white text-sm capitalize focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(status => (
                <option key={status} value={status} className="capitalize">
                  {status.replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div 
          className="cursor-pointer pl-8" 
          onClick={() => setIsEditing(true)}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              {task.title}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="text-gray-400 bg-transparent hover:text-red-500 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {task.description}
            </p>
          )}
          
          <div className="flex gap-2 mt-3 text-xs">
            {task.dueDate && (
              <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {task.status && (
              <span className={`capitalize px-2.5 py-1 rounded-full text-xs font-medium
                ${task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' :
                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                {task.status.replace('-', ' ')}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 