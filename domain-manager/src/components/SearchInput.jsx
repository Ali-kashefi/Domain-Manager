"use client";
import React from "react";
function SearchInput({ classname, value, onChange }) {
  return (
    <>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`
    w-full
    p-2.5
    border
    border-gray-300
    rounded-md
    shadow-sm
    bg-white
    text-gray-900
    placeholder-gray-500
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    focus:border-blue-500
    transition-colors
    duration-200
    ${classname}
  `}
        placeholder="Search..."
        
      />
    </>
  );
}

export default SearchInput;
