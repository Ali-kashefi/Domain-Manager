import React from 'react'

function Actions({ onEdit, onDelete }) {
  return (
 <div className="flex gap-2">
            <button 
                onClick={onEdit}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
            >
                Edit
            </button>
            <button 
                onClick={onDelete}
                className="text-red-600 hover:text-red-800 transition-colors duration-150"
            >
                Delete
            </button>
        </div>
  )
}

export default Actions
 