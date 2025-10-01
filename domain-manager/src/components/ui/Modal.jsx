"use client";

import React from 'react';

export default function Modal({ 
  isOpen, 
  onClose, 
  onCreate, 
  title = "Modal Title", 
  createButtonText = "Create",
  children 
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm p-4 transition-opacity duration-300"
      onClick={onClose} 
    >
      
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} 
      >
        
        <div className="flex justify-between items-center p-5 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150 p-1"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
            {children}
        </div>

        <div className="flex justify-end p-5 border-t border-gray-200 gap-3 flex-shrink-0">
          
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition duration-150"
          >
            Cancel
          </button>
          
          <button
            onClick={onCreate} 
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition duration-150"
          >
            {createButtonText}
          </button>
        </div>

      </div>
    </div>
  );
}