


import { SchoolStatitic } from "@/services/reports";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<SchoolStatitic>[] = [
    {
        accessorKey: "Index",
        header: "N°",
        cell(props) {
            return props.row.index + 1
        },
    },
    {
        accessorKey: "school",
        header: "Escuela Profesional",
        cell(props) {
            return props.row.original.school.name
        },
    },
    // Cantidad de Docentes que participaron
    {
        accessorKey: "attended",
        header: "Cantidad",
        cell(props) {
            return props.row.original.attended
        },
    },
    {
        accessorKey: "percentageAttended",
        header: "Porcentaje",
        cell(props) {
            const { attended, pending } = props.row.original
            const total = attended + pending
            return total > 0 ? `${((attended / total) * 100).toFixed(2)}%` : "0%"
        },
    },
    // Cantidad de Docentes que NO participaron
    {
        accessorKey: "pending",
        header: "Cantidad",
        cell(props) {
            return props.row.original.pending
        },
    },
    {
        accessorKey: "percentagePending",
        header: "Porcentaje",
        cell(props) {
            const { attended, pending } = props.row.original
            const total = attended + pending
            return total > 0 ? `${((pending / total) * 100).toFixed(2)}%` : "0%"
        },
    },
    // Total de Docentes
    {
        accessorKey: "total",
        header: "Total",
        cell(props) {
            const { attended, pending } = props.row.original
            return attended + pending
        },
    },
    {
        accessorKey: "percentageTotal",
        header: "Porcentaje",
        cell(props) {
            const { attended, pending } = props.row.original
            const total = attended + pending
            return total > 0 ? "100%" : "0%"
        },
    }
]
