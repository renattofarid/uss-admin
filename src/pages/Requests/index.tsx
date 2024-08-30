import ModalRequest from "./components/ModalRequest"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Post } from "@/services/posts"
import { DataTable } from "@/components/DataTable/DataTable"
import { ExtraColumn } from "@/types/columns"
import { RequestStore } from "./store/RequestStore"
import { Ban, CheckCheck, Eye, ListX } from "lucide-react"

const columns = [
    {
        field: "title",
        headerName: "Título",
        className: "w-1/3 font-bold"
    },
    {
        field: "category",
        headerName: "Categoría",
        className: ""
    },
    {
        field: "user",
        headerName: "Solicitante",
        className: ""
    },
    {
        field: "status",
        headerName: "Estado",
        className: ""
    },
    {
        field: "createdAt",
        headerName: "Fecha creación",
        className: ""
    },
];

function RequestsPage() {
    const { open, getData, tableRequests, loading, setRequestSelected } = RequestStore()
    useEffect(() => {
        getData();
    }, [])

    const extraColumns: ExtraColumn[] = [
        {
            headerName: 'Acciones',
            field: 'actions',
            render: (row: Post) => {
                return (
                    <div className="w-fit flex flex-row gap-1 items-center">
                        <Button className='bg-transparent shadow-none hover:bg-transparent border border-blue-500 h-7 w-7 p-1'
                            onClick={() => setRequestSelected(row.id, 'view')}>
                            <Eye className="text-blue-500" />
                        </Button>
                        <Button className='bg-transparent shadow-none hover:bg-transparent border border-green-500 h-7 w-7 p-1'
                            onClick={() => setRequestSelected(row.id, 'accept')}>
                            <CheckCheck className="text-green-500" />
                        </Button>
                        <Button className='bg-transparent shadow-none hover:bg-transparent border border-purple-500 h-7 w-7 p-1'
                            onClick={() => setRequestSelected(row.id, 'list-rejects')}>
                            <ListX className="text-purple-500" />
                        </Button>
                        <Button className='bg-transparent shadow-none hover:bg-transparent border border-red-500 h-7 w-7 p-1'
                            onClick={() => setRequestSelected(row.id, 'reject')}>
                            <Ban className="text-red-500" />
                        </Button>
                        {/* <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={() => setRequestSelected(row.id, 'accept')}>
                            <EditIcon />
                        </Button> */}
                        {/* TODO: service to decline request */}
                        {/* <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={async () => setRequestSelected(row.id, 'delete')}>
                            <DeleteIcon />
                        </Button> */}
                    </div>
                )
            }
        }
    ]


    return (
        <main className="flex flex-col gap-4 p-4">
            <section className="">
                <h1 className="text-2xl font-semibold">Listado de Solicitudes de Posts</h1>
            </section>

            <section className="flex flex-row justify-between items-center gap-2">
                <div className="invisible">
                    Filtros
                </div>
                <div>
                    {open && <ModalRequest />}
                </div>
            </section>
            <div>
                <DataTable
                    columns={columns}
                    data={tableRequests}
                    isLoading={loading}
                    extraColumns={extraColumns}
                />
            </div>
            <section>

            </section>
        </main>
    )
}

export default RequestsPage