import React from 'react'

function Table({
    className,
    headersStyle,
    columnStyle,
    headers,
    data
}: {
    className: string,
    headers: string[],
    data: string[],
    headersStyle: string,
    columnStyle: string
}) {
    return (
        <table className={className}>

            <thead>
                <tr>
                    {headers?.map((header: string, index: number) => (
                        <th key={index} className={headersStyle}>
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>

                <tr>
                    {data?.map((cellData: string, index: number) => (
                        <td key={index} className={columnStyle}>
                            {cellData}
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    )
}

export default Table