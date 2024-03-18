'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Column, ExtraColumn } from "@/types/columns";
import { Sort } from "@/types/sort.enum";
import { useEffect, useState } from "react";
import ResponsivePagination from 'react-responsive-pagination';
import './pagination.css';
import { SortIcon, Spinner } from '@/components/Icons';
import { cn } from "@/lib/utils";
export interface SortState {
    field: string,
    sort: Sort
}

interface Props {
    columns: Column[],
    extraColumns?: ExtraColumn[],
    isLoading: boolean,
    data: any[],
    perPage?: number,
    initialSortState?: SortState | null,
    onSort?: (sortState: SortState) => void,
    rowsPerPageOptions?: number[],
}

const DEFAULT_ROWS_PER_PAGE_OPTIONS = [
    15,
    30,
    50,
]

export function DataTable({
    columns,
    extraColumns = [],
    isLoading,
    data,
    perPage = 15,
    initialSortState = null,
    onSort,
    rowsPerPageOptions = DEFAULT_ROWS_PER_PAGE_OPTIONS,
}: Props) {

    const [currentSortState, setCurrentSortState] = useState<SortState | null>(initialSortState);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(perPage);
    const [currentData, setCurrentData] = useState<any[]>([])

    const handleSort = (column: Column) => {
        const { field } = column;
        const newSort = currentSortState && currentSortState.field === field ?
            (currentSortState.sort === Sort.ASC ? Sort.DESC : Sort.ASC) : Sort.ASC;
        setCurrentSortState({
            field,
            sort: newSort
        });
    }

    useEffect(() => {
        if (currentSortState && onSort) {
            onSort(currentSortState);
        }
    }, [currentSortState])

    const handlePageClick = (page: number) => {
        setPage(page);
    }

    const updateCurrentData = () => {
        console.log('cambiando current data')
        let sortedData;
        if (!currentSortState) {
            sortedData = data
        } else {
            sortedData = data.sort((a, b) => {
                const { field, sort } = currentSortState;
                let sortBy = columns.find(column => column.field === field)?.sortBy ?? field;
                if (a[sortBy] > b[sortBy]) {
                    return sort === Sort.ASC ? 1 : -1;
                }
                if (a[sortBy] < b[sortBy]) {
                    return sort === Sort.ASC ? -1 : 1;
                }
                return 0;
            });
        }
        const currentData = sortedData.slice((page - 1) * limit, page * limit);
        setCurrentData(currentData);
    }

    useEffect(() => {
        updateCurrentData();
    }, [data, page, limit, currentSortState]);

    useEffect(() => {
        setPage(1);
    }, [data, limit]);

    const pages = getPages({
        total: data.length,
        limit
    });

    return (
        <div>
            <div className="flex justify-end">
                <div className="flex flex-col gap-2">
                    <label htmlFor="rowsPerPageInput" className="text-xs w-fit">Registros por página:</label>
                    <select
                        id="rowsPerPageInput"
                        value={limit}
                        className="w-full py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-diamond focus:border-transparent transition-all duration-300 ease-in-out bg-transparent mb-4"
                        onChange={(e) => setLimit(+e.target.value)}>
                        {rowsPerPageOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="w-full max-h-[500px] overflow-y-scroll scrollSmooth">
                <Table className="border-collapse">
                    <TableHeader className="thead-border-radius h-12">
                        <TableRow className="bg-diamond hover:bg-diamond hover:bg-opacity-90 border-none">
                            {columns.map((column, index) => (
                                <TableHead key={index} className={cn(
                                    column.className,
                                    "text-black font-bold text-xs",
                                )}>
                                    <div className={cn("flex", column.className)}>
                                        {column.headerName}
                                        {
                                            column.sortable && (
                                                <button className="flex flex-col cursor-pointer" onClick={() => handleSort(column)}>
                                                    <SortIcon sort={Sort.ASC} isActive={currentSortState?.field === column.field && currentSortState.sort === Sort.ASC} />
                                                    <SortIcon sort={Sort.DESC} isActive={currentSortState?.field === column.field && currentSortState.sort === Sort.DESC} />
                                                </button>
                                            )}
                                    </div>
                                </TableHead>
                            ))}
                            {extraColumns.map((column, index) => (
                                <TableHead key={index} className="text-black font-semibold text-xs">{column.headerName}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="border-b border-white">
                        {
                            currentData.map((row, index) => (
                                <TableRow key={index} className="border-b h-16 border-gray-200 hover:bg-white hover:bg-opacity-10">
                                    {columns.map((column, index) => (
                                        <TableCell key={index} className={cn(row.className)}>{row[column.field]}</TableCell>
                                    ))}
                                    {extraColumns.map((column, index) => (
                                        <TableCell key={index}>{column.render(row)}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        }
                        {
                            isLoading && (
                                <TableRow className="bg-uss-green-600 opacity-30 absolute p-16 top-0 bottom-0 left-0 right-0 flex justify-center items-center">
                                    <Spinner />
                                </TableRow>)
                        }
                    </TableBody>
                </Table>
            </div>
            <div className='flex justify-center w-full py-3'>
                <div className="w-[300px]">
                    <ResponsivePagination
                        total={pages.length}
                        current={page}
                        className='w-full justify-center items-center flex gap-3'
                        onPageChange={page => handlePageClick(page)}
                        maxWidth={300}
                    />
                </div>
            </div>

        </div>
    )
}

function getPages({ total, limit }: { total: number, limit: number }) {
    if (!total) return [];
    return Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1)
}