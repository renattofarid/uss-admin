


import { MapProfessorEmploymentType, Professor } from "@/services/professors";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Professor>[] = [
    {
        accessorKey: "Index",
        header: "N°",
        cell(props) {
            return props.row.index + 1
        },
    },
    {
        accessorKey: "name",
        header: "Nombre",
        cell(props) {
            return props.row.original.name
        },
    },
    // Cantidad de Docentes que participaron
    {
        accessorKey: "email",
        header: "Email",
        cell(props) {
            return props.row.original.email
        },
    },
    {
        accessorKey: "documentNumber",
        header: "DNI",
        cell(props) {
            return props.row.original.documentNumber
        },
    },
    {
        accessorKey: "employmentType",
        header: "Tipo",
        cell(props) {
            return MapProfessorEmploymentType[props.row.original.employmentType]
        },
    },

]
