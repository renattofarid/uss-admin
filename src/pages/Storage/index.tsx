import ModalStorage from "./components/ModalStorage"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable/DataTable"
import { ExtraColumn } from "@/types/columns"
import { DeleteIcon } from "@/components/DataTable/TableIcons"
import { StorageStore } from "./store/StorageStore"
import { StorageBlob } from "@/services/storage"

const columns = [
    {
        field: "order",
        headerName: "N°",
        className: "w-1/5 font-bold"
    },
    {
        field: "name",
        headerName: "Nombre",
        className: "w-3/5 font-bold"
    },
    {
        field: "createdAt",
        headerName: "Fecha creación",
        className: "w-1/5 font-bold"
    },
];

function StogarePage() {
    const { open, setOpen, getData, tableBlobs, loading, setBlobSelected } = StorageStore()
    useEffect(() => {
        getData();
    }, [])

    const extraColumns: ExtraColumn[] = [
        {
            headerName: 'Acciones',
            field: 'actions',
            render: (row: StorageBlob) => {
                return (
                    <div className="w-fit flex flex-row gap-1">
                        <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={async () => setBlobSelected(row, 'delete')}>
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
                <h1 className="text-2xl font-semibold">Cloud USS</h1>
            </section>

            <section className="flex flex-row justify-between items-center gap-2">
                <div className="invisible">
                    Filtros
                </div>
                <div>
                    <Button
                        onClick={() => {
                            setBlobSelected(null, 'create')
                            setOpen(true)
                        }}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Nuevo Recurso
                    </Button>
                    {open && <ModalStorage />}
                </div>
            </section>
            <div>
                <DataTable
                    columns={columns}
                    data={tableBlobs}
                    isLoading={loading}
                    extraColumns={extraColumns}
                />
            </div>
            <section>

            </section>
        </main>
    )
}

export default StogarePage