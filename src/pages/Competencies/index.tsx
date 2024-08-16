import ModalCompetency from "./components/ModalCompetency"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Competency } from "@/services/competencies"
import { DataTable } from "@/components/DataTable/DataTable"
import { ExtraColumn } from "@/types/columns"
import { DeleteIcon, EditIcon } from "@/components/DataTable/TableIcons"
import { CompetencyStore } from "./store/CompetencyStore"

const columns = [
    {
        field: "order",
        headerName: "N°",
        className: "w-1/5 font-bold"
    },
    {
        field: "name",
        headerName: "Nombre de Escuela",
        className: "w-4/5 font-bold"
    },
];

function CompetenciesPage() {
    const { open, setOpen, getData, tableCompetencies, loading, setCompetencySelected } = CompetencyStore()
    useEffect(() => {
        getData();
    }, [])

    const extraColumns: ExtraColumn[] = [
        {
            headerName: 'Acciones',
            field: 'actions',
            render: (row: Competency) => {
                return (
                    <div className="w-fit flex flex-row gap-1">
                        <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={() => setCompetencySelected(row, 'edit')}>
                            <EditIcon />
                        </Button>
                        <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={async () => setCompetencySelected(row, 'delete')}>
                            <DeleteIcon />
                        </Button>
                    </div>
                )
            }
        }
    ]


    return (
        <main className="flex flex-col gap-4 p-4">
            <section className="">
                <h1 className="text-2xl font-semibold">Listado de Competencias</h1>
            </section>

            <section className="flex flex-row justify-between items-center gap-2">
                <div className="invisible">
                    Filtros
                </div>
                <div>
                    <Button
                        onClick={() => {
                            setCompetencySelected(null, 'create')
                            setOpen(true)
                        }}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Nueva Competencia
                    </Button>
                    {open && <ModalCompetency />}
                </div>
            </section>
            <div>
                <DataTable
                    columns={columns}
                    data={tableCompetencies}
                    isLoading={loading}
                    extraColumns={extraColumns}
                />
            </div>
            <section>

            </section>
        </main>
    )
}

export default CompetenciesPage