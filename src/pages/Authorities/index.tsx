import ModalAuthority from "./components/ModalAuthority"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Authority } from "@/services/authorities"
import { DataTable } from "@/components/DataTable/DataTable"
import { ExtraColumn } from "@/types/columns"
import { DeleteIcon, EditIcon } from "@/components/DataTable/TableIcons"
import { AuthorityStore } from "./store/AuthorityStore"

const columns = [
    {
        field: "name",
        headerName: "Autoridad",
        className: "w-1/3 font-bold"
    },
    {
        field: "hierachy",
        headerName: "Orden",
        className: ""
    },
    {
        field: "position",
        headerName: "Cargo",
        className: ""
    },
];

function AuthoritiesPage() {
    const { open, setOpen, getData, tableAuthorities, loading, setAuthoritySelected } = AuthorityStore()
    useEffect(() => {
        getData();
    }, [])

    const extraColumns: ExtraColumn[] = [
        {
            headerName: 'Acciones',
            field: 'actions',
            render: (row: Authority) => {
                return (
                    <div className="w-fit flex flex-row gap-1">
                        <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={() => setAuthoritySelected(row, 'edit')}>
                            <EditIcon />
                        </Button>
                        <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={async () => setAuthoritySelected(row, 'delete')}>
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
                <h1 className="text-2xl font-semibold">Listado de Autoridades</h1>
            </section>

            <section className="flex flex-row justify-between items-center gap-2">
                <div className="invisible">
                    Filtros
                </div>
                <div>
                    <Button
                        onClick={() => {
                            setAuthoritySelected(null, 'create')
                            setOpen(true)
                        }}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Nueva Autoridad
                    </Button>
                    {open && <ModalAuthority />}
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

export default AuthoritiesPage