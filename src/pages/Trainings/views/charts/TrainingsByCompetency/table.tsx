"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useMemo } from "react"
import { TrainingsByCompetency } from "@/services/reports"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function CompetencyTrainingDataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const getTotalCountSchedule = useMemo(() => {
        return (data as TrainingsByCompetency[]).reduce((acc, curr) => acc + curr.scheduled, 0)
    }, [data])

    const getTotalCountExtra = useMemo(() => {
        return (data as TrainingsByCompetency[]).reduce((acc, curr) => acc + curr.extra, 0)
    }, [data])

    const getEfficacy = useMemo(() => {
        const total = getTotalCountExtra + getTotalCountSchedule
        return total > 0 ? `${((total / getTotalCountSchedule) * 100).toFixed(2)}%` : '0%';
    }, [data])

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            COMPETENCIAS DOCENTES
                        </TableHead>
                        <TableHead>
                            PROGRAMADAS
                        </TableHead>
                        <TableHead colSpan={2}>
                            EJECUTADAS
                        </TableHead>
                    </TableRow>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        <>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>

                            ))}
                            <TableRow>
                                <TableCell>
                                    TOTAL
                                </TableCell>
                                <TableCell>
                                    {getTotalCountSchedule}
                                </TableCell>
                                <TableCell>
                                    {(getTotalCountSchedule + getTotalCountExtra)}
                                </TableCell>
                                <TableCell>
                                    {getEfficacy}
                                </TableCell>
                            </TableRow>
                        </>
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
