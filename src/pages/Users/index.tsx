import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import ModalPost from "./components/ModalUser"
import { useContext, useEffect } from "react"
import { UserContext } from "./context/UserContext"
import { Button } from "@/components/ui/button"
import { getUsers } from "@/services/users"
import { toast } from "sonner"

const columns = [
    {
        field: "image",
        headerName: "Avatar",
        className: "w-8"
    },
    {
        field: "name",
        headerName: "Nombre",
        className: ""
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
    const { open, setOpen, setUsers, loading, setLoading, setDraftUsers, setTableUsers, tableUsers } = useContext(UserContext)

    const getData = async () => {
        try {
            setLoading(true);
            const resp = await getUsers();
            setUsers(resp);
            setDraftUsers(resp);
            const obj = resp.map(user => ({
                image: (
                    <img
                        className="w-6 rounded-full aspect-square object-cover"
                        src={user.image || 'https://avatars.githubusercontent.com/u/93000567'}
                        alt={user.name}
                    />
                ),
                name: user.name,
                email: user.email,
                role: user.role
            }))
            setTableUsers(obj);

        } catch (error) {
            toast.error('Ocurrió un error inesperado, intente nuevamente');
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getData();
    }, [])


    return (
        <main className="flex flex-col gap-4 p-4">
            <section className="">
                <h1 className="text-2xl font-semibold">Listado de Users</h1>
            </section>

            <section className="flex flex-row justify-between items-center gap-2">
                <div>
                    Filtros
                </div>
                <div>
                    <Button
                        onClick={() => setOpen(!open)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Nuevo Post
                    </Button>
                    {open && <ModalPost />}
                </div>
            </section>
            <div>
                <Table>
                    <TableCaption>
                        {loading ? '' : `Se encontraron ${tableUsers.length} Users`}
                    </TableCaption>
                    <TableHeader>
                        {columns.map((column, index) => (
                            <TableHead key={index} className={column.className}>{column.headerName}</TableHead>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? <TableRow><TableCell>Cargando...</TableCell></TableRow> : tableUsers.map((row, index) => (
                            <TableRow key={index}>
                                {columns.map((column, index) => (
                                    <TableCell key={index}>{row[column.field]}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <section>

            </section>
        </main>
    )
}

export default UsersPage