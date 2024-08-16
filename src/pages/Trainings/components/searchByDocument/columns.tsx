"use client"

import { Button } from "@/components/ui/button"
import { MapTrainingModality, SingleTraining } from "@/services/trainings"
import { ColumnDef } from "@tanstack/react-table"
import { SearchTrainingStore } from "../../store/SearchTrainingStore"

export const columns: ColumnDef<SingleTraining>[] = [
    {
        accessorKey: "code",
        header: "Código",
    },
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "organizer",
        header: "Organizador",
        cell(props) {
            const { organizer } = props.row.original
            return organizer === "DDA" ? "DDA" : organizer.name
        },
    },
    {
        accessorKey: "modality",
        header: "Modalidad",
        cell: (props) => MapTrainingModality[props.row.original.modality],
    },
    {
        accessorKey: "participant",
        header: "Estado",
        cell: (props) => {
            const { participant } = props.row.original
            return participant.certificate ? "Aprobado" : "Pendiente"
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const { participant } = row.original
            const { downloadCertificate } = SearchTrainingStore()

            if (!participant.certificate) return <></>

            return (
                // Descargar certificado
                <Button
                    size={"sm"}
                    onClick={() => {
                        if (!participant) return
                        downloadCertificate(participant)
                    }}
                >
                    <span className="text-xs">Descargar certificado</span>
                </Button>
            )
        },
    },
]
