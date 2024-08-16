import ModalTraining from "./components/ModalTraining"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Training } from "@/services/trainings"
import { DataTable } from "@/components/DataTable/DataTable"
import { ExtraColumn } from "@/types/columns"
import { DeleteIcon, EditIcon } from "@/components/DataTable/TableIcons"
import { TrainingStore } from "./store/TrainingStore"
import { BookIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

const columns = [
    {
        field: "code",
        headerName: "Código",
        className: ""
    },
    {
        field: "name",
        headerName: "Nombres",
        className: ""
    },
    {
        field: "organizer",
        headerName: "Organizador",
        className: ""
    },
    {
        field: "competency",
        headerName: "Competencia",
        className: ""
    },
    {
        field: "status",
        headerName: "Status",
        className: ""
    },
    {
        field: "modality",
        headerName: "Modalidad",
        className: ""
    },
];

function TrainingsPage() {
    const { open, setOpen, getData, tableTrainings: tableAuthorities, loading, setTrainingSelected } = TrainingStore()
    useEffect(() => {
        getData();
    }, [])
    const navigate = useNavigate()

    const extraColumns: ExtraColumn[] = [
        {
            headerName: 'Acciones',
            field: 'actions',
            render: (row: Training) => {
                return (
                    <div className="w-fit flex flex-row gap-1">
                        <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={() => setTrainingSelected(row, 'edit')}>
                            <EditIcon />
                        </Button>
                        <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={() => setTrainingSelected(row, 'list')}>
                            <BookIcon className="text-blue-400 p-1 border-[1px] border-blue-500  h-[30px] w-[30px] rounded-md" />
                        </Button>
                        <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={async () => setTrainingSelected(row, 'delete')}>
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
                <h1 className="text-2xl font-semibold">Listado de Capacitaciones</h1>
            </section>

            <section className="flex flex-row justify-between items-center gap-2">
                <div className="invisible">
                    Filtros
                </div>
                <div>
                    <Button
                        onClick={() => {
                            setTrainingSelected(null, 'create')
                            setOpen(true)
                        }}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Nueva Capacitación
                    </Button>
                    <Button
                        onClick={() => {
                            navigate('/capacitaciones-documento')
                        }}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 ml-1 rounded">Buscar por Documento
                    </Button>
                    {open && <ModalTraining />}
                </div>
            </section>
            <div>
                <DataTable
                    columns={columns}
                    data={tableAuthorities}
                    isLoading={loading}
                    extraColumns={extraColumns}
                />
            </div>
            <section>

            </section>
        </main>
    )
}

export default TrainingsPage