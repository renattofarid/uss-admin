import ModalPost from "./components/ModalPost"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Post} from "@/services/posts"
import { DataTable } from "@/components/DataTable/DataTable"
import { ExtraColumn } from "@/types/columns"
import { DeleteIcon, EditIcon } from "@/components/DataTable/TableIcons"
import { postStore } from "./store/PostStore"

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
    const { open, setOpen, getData, tablePosts, loading, setPostSelected } = postStore()
    useEffect(() => {
        getData();
    }, [])

    const extraColumns: ExtraColumn[] = [
        {
            headerName: 'Acciones',
            field: 'actions',
            render: (row: Post) => {
                return (
                    <div className="w-fit flex flex-row gap-1">
                        <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={() => setPostSelected(row.id, 'edit')}>
                            <EditIcon />
                        </Button>
                        <Button className='bg-transparent shadow-none p-0 hover:bg-transparent'
                            onClick={async () => setPostSelected(row.id, 'delete')}>
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
                <h1 className="text-2xl font-semibold">Listado de Posts</h1>
            </section>

            <section className="flex flex-row justify-between items-center gap-2">
                <div className="invisible">
                    Filtros
                </div>
                <div>
                    <Button
                        onClick={() => {
                            setPostSelected(null, 'create')
                            setOpen(true)
                        }}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Nuevo Post
                    </Button>
                    {open && <ModalPost />}
                </div>
            </section>
            <div>
                <DataTable
                    columns={columns}
                    data={tablePosts}
                    isLoading={loading}
                    extraColumns={extraColumns}
                />
            </div>
            <section>

            </section>
        </main>
    )
}

export default PostsPage