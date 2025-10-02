"use client "
import React from 'react'

// Table component for displaying tabular data.
function Table({
    className,       // Custom Tailwind CSS classes for the main table element.
    headersStyle,    // Custom CSS classes for the table header cells (<th>).
    columnStyle,     // Custom CSS classes for the table body cells (<td>).
    headers,         // An array of strings for the table column titles.
    data             // An array of arrays, where each inner array is a row of data.
}: {
    className?: string,
    headers?: string[],
    data?: any,
    headersStyle?: string,
    columnStyle?: string
}) {
    return (
      // Main table element with default and custom classes.
      <table className={`w-full text-left border-collapse ${className}`}>
    <thead>
        <tr>
            {/* Map over headers array to create table header row */}
            {headers?.map((header: string, index: number) => (
                // Header cell with a unique key and custom styling.
                <th key={index} className={`p-3 text-left ${headersStyle}`}>
                    {header}
                </th>
            ))}
        </tr>
    </thead>
    <tbody>
        {/* Map over the main data array to create table rows */}
        {data?.map((row:any, rowIndex: number) => (
            <tr key={rowIndex}>
                {/* Map over each row's data to create table cells */}
                {row.map((cellData: any, cellIndex: number) => (
                    // Data cell with unique key and default/custom styling.
                    <td key={cellIndex} className={`p-3 text-left border-b border-gray-200 ${columnStyle}`}>
                        {cellData}
                    </td>
                ))}
            </tr>
        ))}
    </tbody>
</table>
    )
}

export default Table