import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import ModalPost from "./components/ModalPost"
import { useContext, useEffect } from "react"
import { PostContext } from "./context/PostContext"
import { Button } from "@/components/ui/button"
import { getPosts } from "@/services/posts"
import { toast } from "sonner"

const columns = [
    {
        field: "title",
        headerName: "Título",
        className: ""
    },
    {
        field: "category",
        headerName: "Categoría",
        className: ""
    },
    {
        field: "readingTime",
        headerName: "Tiempo de lectura",
        className: ""
    },
    {
        field: "likes",
        headerName: "Likes",
        className: ""
    },
    {
        field: "createdAt",
        headerName: "Fecha creación",
        className: ""
    },
];

function PostsPage() {
    const { open, setOpen, posts, setPosts, loading, setLoading, setDraftPosts, setTablePosts, tablePosts } = useContext(PostContext)

    const getData = async () => {
        try {
            setLoading(true);
            const resp = await getPosts();
            setPosts(resp);
            setDraftPosts(resp);
            setTablePosts(resp.map(post => ({
                title: post.title,
                category: post.category,
                readingTime: post.readingTime,
                likes: post.likes,
                createdAt: post.createdAt
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
                <h1 className="text-2xl font-semibold">Listado de Posts</h1>
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
                        {loading ? '' : `Se encontraron ${posts.length} posts`}
                    </TableCaption>
                    <TableHeader>
                        {columns.map((column, index) => (
                            <TableHead key={index}>{column.headerName}</TableHead>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? <TableRow><TableCell>Cargando...</TableCell></TableRow> : tablePosts.map((row, index) => (
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

export default PostsPage