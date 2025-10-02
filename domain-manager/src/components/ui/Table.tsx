"use client "
import React from 'react'

function Table({
    className,
    headersStyle,
    columnStyle,
    headers,
    data
}: {
    className?: string,
    headers?: string[],
    data?: any,
    headersStyle?: string,
    columnStyle?: string
}) {
    return (
      <table className={`w-full text-left border-collapse ${className}`}>
    <thead>
        <tr>
            {headers?.map((header: string, index: number) => (
                <th key={index} className={`p-3 text-left ${headersStyle}`}>
                    {header}
                </th>
            ))}
        </tr>
    </thead>
    <tbody>
        {data?.map((row:any, rowIndex: number) => (
            <tr key={rowIndex}>
                {row.map((cellData: any, cellIndex: number) => (
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