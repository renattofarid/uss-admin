import ModalUser from "./components/ModalUser"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { User } from "@/services/users"
import { DataTable } from "@/components/DataTable/DataTable"
import { ExtraColumn } from "@/types/columns"
import { DeleteIcon, EditIcon } from "@/components/DataTable/TableIcons"
import { UserStore } from "./store/UserStore"

const columns = [
    {
        field: "name",
        headerName: "Usuario",
        className: "w-1/3 font-bold"
    },
    {
        field: "email",
        headerName: "Email",
        className: ""
    },
    {
        field: "role",
        headerName: "Rol",
        className: ""
    },
];

function UsersPage() {
    const { open, setOpen, getData, tableUsers, loading, setUserSelected } = UserStore()
    useEffect(() => {
        getData();
    }, [])

    const extraColumns: ExtraColumn[] = [
        {
            headerName: 'Acciones',
            field: 'actions',
            render: (row: User) => {
                return (
                    <div className="w-fit flex flex-row gap-1">
                        <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={() => setUserSelected(row, 'edit')}>
                            <EditIcon />
                        </Button>
                        <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={async () => setUserSelected(row, 'delete')}>
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
                <h1 className="text-2xl font-semibold">Listado de Usuarios</h1>
            </section>

            <section className="flex flex-row justify-between items-center gap-2">
                <div className="invisible">
                    Filtros
                </div>
                <div>
                    <Button
                        onClick={() => {
                            setUserSelected(null, 'create')
                            setOpen(true)
                        }}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Nuevo Usuario
                    </Button>
                    {open && <ModalUser />}
                </div>
            </section>
            <div>
                <DataTable
                    columns={columns}
                    data={tableUsers}
                    isLoading={loading}
                    extraColumns={extraColumns}
                />
            </div>
            <section>

            </section>
        </main>
    )
}

export default UsersPage