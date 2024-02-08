import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import ModalPost from "./components/ModalTag"
import { useContext, useEffect } from "react"
import { TagContext } from "./context/TagContext"
import { Button } from "@/components/ui/button"
import { getTags } from "@/services/tags"
import { toast } from "sonner"

const columns = [
    {
        field: "id",
        headerName: "ID",
        className: "w-8"
    },
    {
        field: "name",
        headerName: "Nombre",
        className: ""
    },
];

function TagsPage() {
    const { open, setOpen, setTags, loading, setLoading, setDraftTags, setTableTags, tableTags } = useContext(TagContext)

    const getData = async () => {
        try {
            setLoading(true);
            const resp = await getTags();
            setTags(resp);
            setDraftTags(resp);
            setTableTags(resp.map(tag => ({
                id: tag.id,
                name: tag.name,
            })));

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
                <h1 className="text-2xl font-semibold">Listado de Tags</h1>
            </section>

            <section className="flex flex-row justify-between items-center gap-2">
                <div>
                    Filtros
                </div>
                <div>
                    <Button
                        onClick={() => setOpen(!open)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Nuevo Tag
                    </Button>
                    {open && <ModalPost />}
                </div>
            </section>
            <div>
                <Table>
                    <TableCaption>
                        {loading ? '' : `Se encontraron ${tableTags.length} Tags`}
                    </TableCaption>
                    <TableHeader>
                        {columns.map((column, index) => (
                            <TableHead key={index}>{column.headerName}</TableHead>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? <TableRow><TableCell>Cargando...</TableCell></TableRow> : tableTags.map((row, index) => (
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

export default TagsPage