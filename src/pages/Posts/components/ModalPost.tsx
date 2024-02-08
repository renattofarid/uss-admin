import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useEffect, useState } from "react";
import Select from 'react-select'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Tag, getTags } from "@/services/tags";
import { User, getUsers } from "@/services/users";
import { Category, PostBodyRequest, createPost, uploadImage } from "@/services/posts";
import { PostContext } from "../context/PostContext";
import { toast } from "sonner";

function ModalPost() {
    // const [open, setOpen] = useState(false);
    const { loading, setLoading, open, setOpen, setTablePosts } = useContext(PostContext)
    const [form, setForm] = useState<PostBodyRequest>({
        userId: 1,
        title: '',
        category: Category.NEWS,
        subCategory: null,
        description: null,
        content: '',
        imageUrl: null,
        imageDescription: null,
        videoUrl: null,
        podcastUrl: null,
        attachments: [],
        tags: []
    })
    const [tags, setTags] = useState<Tag[]>([]);
    const [authors, setAuthors] = useState<User[]>([]);
    const [editorState, setEditorState] = useState<any>(EditorState.createEmpty());

    const getData = async () => {
        try {
            setLoading(true);
            const [tags, authors] = await Promise.all([getTags(), getUsers()]);
            setTags(tags);
            setAuthors(authors);
        } catch (error) {
            toast.error('Ocurrió un error inesperado, intente nuevamente');
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getData();
        return () => {
            setForm({
                userId: 1,
                title: '',
                category: Category.NEWS,
                subCategory: null,
                description: null,
                content: '',
                imageUrl: null,
                imageDescription: null,
                videoUrl: null,
                podcastUrl: null,
                attachments: [],
                tags: []
            })
        }
    }, [])

    useEffect(() => {
        setForm({
            ...form,
            content: draftToHtml(convertToRaw(editorState.getCurrentContent()))
        })
    }, [editorState])

    useEffect(() => {
        switch (form.category) {
            case Category.NEWS:
                setForm({
                    ...form,
                    attachments: [],
                    videoUrl: null,
                    podcastUrl: null,
                });
                break;
            case Category.BITS:
                setForm({
                    ...form,
                    attachments: [],
                    videoUrl: null,
                    podcastUrl: null,
                });
                break;
            case Category.READS:
                setForm({
                    ...form,
                    imageDescription: null,
                    videoUrl: null,
                    podcastUrl: null,
                });
                break;
            case Category.TUBES:
                setForm({
                    ...form,
                    imageUrl: null,
                    imageDescription: null,
                    attachments: [],
                    podcastUrl: null,
                });
                break;
            case Category.PODCAST:
                setForm({
                    ...form,
                    imageUrl: null,
                    imageDescription: null,
                    attachments: [],
                    videoUrl: null,
                });
                break;
            default:
                break;
        }
    }, [form.category])



    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleOnChangeImageInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        try {
            setLoading(true);
            const { secure_url } = await uploadImage(file);
            setForm({
                ...form,
                imageUrl: secure_url,
            });
        } catch (error) {
            toast.error('Ocurrió un error inesperado, intente nuevamente');
        } finally {
            setLoading(false);
        }
    }

    const handleOnChangeArchiveInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        try {
            setLoading(true);
            const { secure_url } = await uploadImage(file);
            setForm({
                ...form,
                attachments: form.attachments ? [...form.attachments, secure_url] : [secure_url],
            });
        } catch (error) {
            toast.error('Ocurrió un error inesperado, intente nuevamente');
        } finally {
            setLoading(false);
        }
    }

    const handleSelectCategory = (value: Category) => {
        setForm({
            ...form,
            category: value,
        });
    }

    const handleSelectTags = (value: Tag[]) => {
        setForm({
            ...form,
            tags: value,
        });
    }

    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            const newPost = await createPost(form);
            setTablePosts(prev => [{
                title: newPost.title,
                category: newPost.category,
                readingTime: newPost.readingTime,
                likes: newPost.likes,
                createdAt: newPost.createdAt
            }, ...prev]);
            setOpen(false);
        } catch (error) {
            console.log(error)
            toast.error('Ocurrió un error inesperado, intente nuevamente');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            {/* <Button
                onClick={() => setOpen(!open)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Nuevo Post
            </Button> */}
            <DialogContent
                className={"lg:max-w-screen-lg max-h-screen overflow-y-scroll"}
                onPointerDownOutside={e => {
                    e.preventDefault()
                }}>
                <DialogHeader>
                    <DialogTitle>Nuevo Post</DialogTitle>
                    <DialogDescription>
                        Complete el formulario para crear un nuevo post
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleOnSubmit} encType='multipart/form-data'>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex flex-col items-start gap-2">
                            <Label htmlFor="category" className="text-right">
                                Categoría
                            </Label>
                            <Select
                                isDisabled={loading}
                                className="w-full col-span-3 z-[99]"
                                defaultValue={{ value: Category.NEWS, label: 'Noticias' }}
                                onChange={e => handleSelectCategory(e!.value)}
                                options={[
                                    { value: Category.NEWS, label: 'Noticias' },
                                    { value: Category.BITS, label: 'Bits' },
                                    { value: Category.READS, label: 'Reads' },
                                    { value: Category.TUBES, label: 'Tubes' },
                                    { value: Category.PODCAST, label: 'Podcast' },
                                ]} />
                        </div>
                        <div className="flex flex-col items-start gap-2">
                            <Label htmlFor="title" className="text-right">
                                Título
                            </Label>
                            <Input
                                id="title"
                                value={form.title}
                                name="title"
                                onChange={handleOnChange}
                                disabled={loading}
                                className="col-span-3" />
                        </div>
                        {(form.category !== Category.PODCAST) && (
                            <div className="flex flex-col items-start gap-2">
                                <Label htmlFor="description" className="text-right">
                                    Descripción
                                </Label>
                                <Input disabled={loading} id="description" value={form.description || ''} name="description" onChange={handleOnChange} className="col-span-3" />
                            </div>
                        )}

                        <div className="flex flex-col items-start gap-2">
                            <Label htmlFor="description" className="text-right">
                                Contenido
                            </Label>
                            <div className="border-[1px] rounded border-slate-200 w-full">
                                <Editor
                                    toolbar={{
                                        options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history'],
                                        inline: { inDropdown: true },
                                        list: { inDropdown: true },
                                        textAlign: { inDropdown: true },
                                        link: { inDropdown: true },
                                        history: { inDropdown: true },
                                    }}
                                    editorState={editorState}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorClassName"
                                    onEditorStateChange={setEditorState}
                                />
                            </div>
                        </div>
                        {(form.category !== Category.PODCAST && form.category !== Category.TUBES) && (
                            <>
                                <div className="flex flex-col items-start gap-2">
                                    <Label htmlFor="picture">Cargar Imagen</Label>
                                    {loading ? (
                                        <div className="w-full flex justify-center">
                                            Subiendo imagen...
                                            <div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500'></div>
                                        </div>
                                    ) : ''}
                                    {form?.imageUrl && (
                                        <img src={form.imageUrl} alt="Imagen" className="h-36 w-auto object-cover transition-all hover:scale-105" />
                                    )}
                                    <Input disabled={loading} id="picture" type="file" name="media" onChange={handleOnChangeImageInput} />
                                </div>
                                {/* <div className="flex flex-col items-start gap-2">
                                    <Label htmlFor="imageUrl" className="text-right">
                                        URL de la imagen
                                    </Label>
                                    <Input disabled={loading} readOnly id="imageUrl" value={form.imageUrl || ''} name="imageUrl" onChange={handleOnChange} className="col-span-3" />
                                </div> */}
                            </>
                        )}
                        {(form.category !== Category.READS && form.category !== Category.PODCAST && form.category !== Category.TUBES) && (
                            <div className="flex flex-col items-start gap-2">
                                <Label htmlFor="imageDescription" className="text-right">
                                    Descripción de la imagen
                                </Label>
                                <Input disabled={loading} id="imageDescription" value={form.imageDescription || ''} name="imageDescription" onChange={handleOnChange} className="col-span-3" />
                            </div>
                        )}
                        {(form.category === Category.TUBES) && (
                            <div className="flex flex-col items-start gap-2">
                                <Label htmlFor="videoUrl" className="text-right">
                                    URL del video
                                </Label>
                                <Input disabled={loading} id="videoUrl" value={form.videoUrl || ''} name="videoUrl" onChange={handleOnChange} className="col-span-3" />
                            </div>
                        )}
                        {(form.category === Category.PODCAST) && (
                            <div className="flex flex-col items-start gap-2">
                                <Label htmlFor="podcastUrl" className="text-right">
                                    URL del podcast
                                </Label>
                                <Input disabled={loading} id="podcastUrl" value={form.podcastUrl || ''} name="podcastUrl" onChange={handleOnChange} className="col-span-3" />
                            </div>
                        )}
                        {(form.category === Category.READS) && (
                            <>
                            <div className="flex flex-col items-start gap-2">
                                <Label htmlFor="picture">Cargar Archivo</Label>
                                {loading ? (
                                    <div className="w-full flex justify-center">
                                        Subiendo archivo...
                                        <div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500'></div>
                                    </div>
                                ) : ''}
                                {form?.attachments && (
                                    <p>{form.attachments.length} archivo cargado</p>
                                )}
                                <Input disabled={loading} id="archive" type="file" name="media" onChange={handleOnChangeArchiveInput} />
                            </div>
                        </>
                        )}
                        <div className="flex flex-col items-start gap-2">
                            <Label htmlFor="podcastUrl" className="text-right">
                                Author
                            </Label>
                            <Select
                                isDisabled={loading}
                                className="w-full col-span-3"
                                closeMenuOnSelect={true}
                                onChange={e => setForm({ ...form, userId: e!.value })}
                                options={authors.map(author => ({ value: author.id, label: author.name }))}
                            />
                        </div>
                        <div className="flex flex-col items-start gap-2">
                            <Label htmlFor="podcastUrl" className="text-right">
                                Tags
                            </Label>
                            <Select
                                isDisabled={loading}
                                className="w-full col-span-3"
                                closeMenuOnSelect={false}
                                // defaultValue={[colourOptions[0], colourOptions[1]]}
                                onChange={e => handleSelectTags(e.map((tag: any) => tag.value))}
                                isMulti
                                options={tags.map(tag => ({ value: tag, label: tag.name }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            // onClick={() => setOpen(!open)}
                            disabled={loading}
                            type="submit"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Guardar
                        </Button>
                        <Button
                            onClick={() => setOpen(!open)}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}

export default ModalPost