import ModalSemester from "./components/ModalSemester"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { School } from "@/services/schools"
import { DataTable } from "@/components/DataTable/DataTable"
import { ExtraColumn } from "@/types/columns"
import { DeleteIcon, EditIcon } from "@/components/DataTable/TableIcons"
import { SemesterStore } from "./store/SemesterStore"

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

function SemestersPage() {
    const { open, setOpen, getData, tableSemesters: tableAuthorities, loading, setSemesterSelected: setSchoolSelected } = SemesterStore()
    useEffect(() => {
        getData();
    }, [])

    const extraColumns: ExtraColumn[] = [
        {
            headerName: 'Acciones',
            field: 'actions',
            render: (row: School) => {
                return (
                    <div className="w-fit flex flex-row gap-1">
                        <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={() => setSchoolSelected(row, 'edit')}>
                            <EditIcon />
                        </Button>
                        <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={async () => setSchoolSelected(row, 'delete')}>
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
                <h1 className="text-2xl font-semibold">Listado de Semestres</h1>
            </section>

            <section className="flex flex-row justify-between items-center gap-2">
                <div className="invisible">
                    Filtros
                </div>
                <div>
                    <Button
                        onClick={() => {
                            setSchoolSelected(null, 'create')
                            setOpen(true)
                        }}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Nuevo Semestre
                    </Button>
                    {open && <ModalSemester />}
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

export default SemestersPage