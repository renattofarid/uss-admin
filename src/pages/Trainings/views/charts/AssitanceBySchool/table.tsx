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
import { SchoolStatitic } from "@/services/reports"
import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTableAssistanceBySchool<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const getTotalCountProffesors = useMemo(() => {
        return (data as SchoolStatitic[]).reduce((acc, curr) => acc + curr.professorsCount, 0)
    }, [data])

    const getTotalCountProffesorsAttended = useMemo(() => {
        return (data as SchoolStatitic[]).reduce((acc, curr) => acc + curr.attended, 0)
    }, [data])

    const getTotalCountProffesorsPending = useMemo(() => {
        return (data as SchoolStatitic[]).reduce((acc, curr) => acc + curr.pending, 0)
    }, [data])

    const joinProfessors = useMemo(() => {
        return (data as SchoolStatitic[]).flatMap(stat => stat.professors);
    }, [data]);

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead colSpan={2}>
                            {" "}
                        </TableHead>
                        <TableHead colSpan={2} className="text-center">
                            Docentes que participaron
                        </TableHead>
                        <TableHead colSpan={2} className="text-center">
                            Docentes que no participaron
                        </TableHead>
                        <TableHead colSpan={2} className="text-center">
                            Total de docentes
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
                                <TableCell colSpan={2} className="text-center">
                                    TOTAL
                                </TableCell>
                                <TableCell>
                                    {getTotalCountProffesorsAttended}
                                </TableCell>
                                <TableCell>
                                    {getTotalCountProffesors > 0 ? `${((getTotalCountProffesorsAttended / getTotalCountProffesors) * 100).toFixed(2)}%` : "0%"}
                                </TableCell>
                                <TableCell>
                                    {getTotalCountProffesorsPending}
                                </TableCell>
                                <TableCell>
                                    {getTotalCountProffesors > 0 ? `${((getTotalCountProffesorsPending / getTotalCountProffesors) * 100).toFixed(2)}%` : "0%"}
                                </TableCell>
                                <TableCell>
                                    {/* <Button variant={"outline"}> */}
                                        <ListProffesors data={joinProfessors} total={getTotalCountProffesors} />
                                    {/* </Button> */}
                                </TableCell>
                                <TableCell>
                                    100%
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


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Professor } from "@/services/professors"
import { TableListProffesors } from "./ListProffesors/table"
import { columns } from "./ListProffesors/columns"

function ListProffesors({
    total, data
}: { total: number, data: Professor[] }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">{total}</Button>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Lista Docentes</DialogTitle>
                    <DialogDescription>
                        {/* Make changes to your profile here. Click save when you're done. */}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <TableListProffesors data={data} columns={columns} />
                </div>
                <DialogFooter>
                    {/* <Button type="submit">Save changes</Button> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
