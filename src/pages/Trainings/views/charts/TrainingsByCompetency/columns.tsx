


import { TrainingsByCompetency } from "@/services/reports";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TrainingsByCompetency>[] = [
    {
        accessorKey: "competency",
        header: "Compentencia",
        cell(props) {
            return props.row.original.competency
        },
    },
    // Cantidad de Docentes que participaron
    {
        accessorKey: "scheduled",
        header: "Nro",
        cell(props) {
            return props.row.original.scheduled
        },
    },
    {
        accessorKey: "extra",
        header: "Nro",
        cell({ row }) {
            return row.original.extra + row.original.scheduled
        },
    },
    // Porcentaje de eficacia
    {
        accessorKey: "efficacy",
        header: "% Eficacia",
        cell({ row }) {
            const total = row.original.extra + row.original.scheduled
            return total > 0 ? `${((total / row.original.scheduled)*100).toFixed(2)}%` : '0%';
        },
    },
]
