import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import Select from 'react-select'
import Creatable from 'react-select/creatable'
import { Editor } from "react-draft-wysiwyg";
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Category, PostBodyRequest, uploadFile } from "@/services/posts";
import { toast } from "sonner";
import { postStore } from "../store/PostStore";
import { useForm } from 'react-hook-form'
import { OPTIONS_CATEGORY } from "@/lib/utils";

function ModalPost() {

    const { loading, setLoading, open, setOpen, tags, users: authors, postSelected, setPostSelected, action, getPost, crtPost, updPost, delPost } = postStore();
    const [editorState, setEditorState] = useState<any>(EditorState.createEmpty());
    // const [contentState, setContentState] = useState<any>();

    // useEffect(() => {
    //     switch (form.category) {
    //         case Category.NEWS:
    //             setForm({
    //                 ...form,
    //                 attachments: [],
    //                 videoUrl: null,
    //                 podcastUrl: null,
    //             });
    //             break;
    //         case Category.BITS:
    //             setForm({
    //                 ...form,
    //                 attachments: [],
    //                 videoUrl: null,
    //                 podcastUrl: null,
    //             });
    //             break;
    //         case Category.READS:
    //             setForm({
    //                 ...form,
    //                 imageDescription: null,
    //                 videoUrl: null,
    //                 podcastUrl: null,
    //             });
    //             break;
    //         case Category.TUBES:
    //             setForm({
    //                 ...form,
    //                 imageUrl: null,
    //                 imageDescription: null,
    //                 attachments: [],
    //                 podcastUrl: null,
    //             });
    //             break;
    //         case Category.PODCAST:
    //             setForm({
    //                 ...form,
    //                 imageUrl: null,
    //                 imageDescription: null,
    //                 attachments: [],
    //                 videoUrl: null,
    //             });
    //             break;
    //         default:
    //             break;
    //     }
    // }, [form.category])

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Post'
            case 'delete':
                return 'Eliminar Post'
            case 'create':
                return 'Crear Post'
            default:
                return 'Post'
        }
    };

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        setError,
    } = useForm<PostBodyRequest>({
        defaultValues: {
            userId: '',
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
        }
    })

    useEffect(() => {
        if (action === 'create') {
            return reset()
        }
        if (action === 'edit') {
            if (!postSelected) return
            (
                async () => {
                    const post = await getPost(postSelected.slug)
                    const contentState: ContentState = ContentState.createFromBlockArray(convertFromHTML(post.content).contentBlocks)
                    const editorState = EditorState.createWithContent(contentState);
                    setEditorState(editorState)
                    reset(post)
                    return
                }
            )()
        }
        return () => {
            reset()
            setPostSelected(null, 'none')
        }
    }, [])

    const handleOnChangeImageInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        try {
            setLoading(true);
            const { url } = await uploadFile(file);
            setValue('imageUrl', url)
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
            const { url } = await uploadFile(file);
            setValue('attachments', [...(watch('attachments') ?? []), url])
        } catch (error) {
            toast.error('Ocurrió un error inesperado, intente nuevamente');
        } finally {
            setLoading(false);
        }
    }

    const onSubmit = handleSubmit(async (data, e) => {
        (e as any).preventDefault();
        if (action === 'create') {
            return await crtPost(data)
        }
        if (action === 'edit') {
            if (!postSelected) return
            return await updPost(postSelected.id, data)
        }
        if (action === 'delete') {
            if (!postSelected) return
            return await delPost(postSelected.id)
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className={"lg:max-w-screen-lg max-h-screen overflow-y-scroll"}
                onPointerDownOutside={e => {
                    e.preventDefault()
                }}>
                <DialogHeader>
                    <DialogTitle>{title()}</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} encType='multipart/form-data'>
                    <pre className="text-xs hidden">
                        <code>
                            {JSON.stringify({ form: watch(), action }, null, 4)}
                        </code>
                    </pre>
                    {action === 'delete' ? (
                        <div>
                            <h1 className="py-6">
                                ¿Estás seguro de eliminar a {postSelected?.title}?
                            </h1>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 py-4">
                            <div className="flex flex-col items-start gap-2">
                                <Label htmlFor="category" className="text-right">
                                    Categoría
                                </Label>
                                <Select
                                    options={OPTIONS_CATEGORY}
                                    {...register("category", {
                                        required: {
                                            value: true,
                                            message: "Categoría es requerida.",
                                        },
                                    })}
                                    value={watch('category') as any &&
                                        OPTIONS_CATEGORY.find(
                                            (item) => item.value === watch('category')
                                        )}
                                    isDisabled={loading}
                                    className="w-full col-span-3 z-[99]"
                                    defaultValue={{ value: Category.NEWS, label: 'Noticias' }}
                                    onChange={(option) => {
                                        setValue('category', option.value)
                                        setError('category', {
                                            type: 'disabled'
                                        })
                                    }}
                                />
                                {errors.category &&
                                    <span className="text-red-600 text-xs">{errors.category.message}</span>
                                }
                            </div>
                            <div className="flex flex-col items-start gap-2">
                                <Label htmlFor="title" className="text-right">
                                    Título
                                </Label>
                                <Input
                                    id="title"
                                    value={watch('title')}
                                    disabled={loading}
                                    className="col-span-3"
                                    placeholder="Título del post"
                                    {...register('title', {
                                        required: {
                                            value: true,
                                            message: 'Título es requerido.'
                                        },
                                        maxLength: {
                                            value: 80,
                                            message: 'Título debe tener 80 caracteres como máximo.'
                                        }
                                    })}
                                />
                                {errors.title &&
                                    <span className="text-red-600 text-xs">{errors.title.message}</span>
                                }
                            </div>
                            {(watch('category') !== Category.PODCAST) && (
                                <div className="flex flex-col items-start gap-2">
                                    <Label htmlFor="description" className="text-right">
                                        Descripción
                                    </Label>
                                    <Input
                                        disabled={loading}
                                        value={watch('description') || ''}
                                        className="col-span-3"
                                        placeholder="Descripción del post"
                                        {...register('description', {
                                            required: {
                                                value: true,
                                                message: 'Descripción es requerida.'
                                            },
                                            maxLength: {
                                                value: 200,
                                                message: 'Descripción debe tener 200 caracteres como máximo.'
                                            }
                                        })}
                                    />
                                    {errors.description &&
                                        <span className="text-red-600 text-xs">{errors.description.message}</span>
                                    }
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
                                        {...register('content', {
                                            required: {
                                                value: true,
                                                message: 'Contenido es requerido.'
                                            },
                                            validate: {
                                                empty: (_value: string) => {
                                                    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
                                                    if (content === '<p></p>\n') {
                                                        return 'Contenido es requerido.'
                                                    }
                                                    return true
                                                }
                                            }
                                        })}
                                        onChange={(_option) => {
                                            setValue('content', draftToHtml(convertToRaw(editorState.getCurrentContent())))
                                            setError('content', {
                                                type: 'disabled'
                                            })
                                        }}
                                        onEditorStateChange={setEditorState}
                                    />
                                </div>
                                {errors.content &&
                                    <span className="text-red-600 text-xs">{errors.content.message}</span>
                                }
                            </div>
                            {(watch('category') !== Category.PODCAST && watch('category') !== Category.TUBES) && (
                                <div className="flex flex-col items-start gap-2">
                                    <Label htmlFor="picture">Cargar Imagen</Label>
                                    {loading ? (
                                        <div className="w-full flex justify-center">
                                            Subiendo imagen...
                                            <div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500'></div>
                                        </div>
                                    ) : ''}
                                    {watch('imageUrl') && (
                                        <img src={watch('imageUrl')!} alt="Imagen" className="h-36 w-auto object-cover transition-all hover:scale-105" />
                                    )}
                                    <Input disabled={loading} id="picture" type="file" name="media" onChange={handleOnChangeImageInput} />
                                    <Input
                                        disabled={loading}
                                        value={watch('imageUrl') || ''}
                                        className="hidden"
                                        {...register('imageUrl', {
                                            required: {
                                                value: true,
                                                message: 'Imagen es requerida.'
                                            },
                                        })}
                                    />
                                    {errors.imageUrl &&
                                        <span className="text-red-600 text-xs">{errors.imageUrl.message}</span>
                                    }
                                </div>
                            )}
                            {(watch('category') !== Category.READS && watch('category') !== Category.PODCAST && watch('category') !== Category.TUBES) && (
                                <div className="flex flex-col items-start gap-2">
                                    <Label htmlFor="imageDescription" className="text-right">
                                        Descripción de la imagen
                                    </Label>
                                    <Input
                                        disabled={loading}
                                        value={watch('imageDescription') || ''}
                                        {...register('imageDescription', {
                                            required: {
                                                value: true,
                                                message: 'Descripción de imagen es requerida.'
                                            },
                                        })}
                                    />
                                    {errors.imageDescription &&
                                        <span className="text-red-600 text-xs">{errors.imageDescription.message}</span>
                                    }
                                </div>
                            )}
                            {(watch('category') === Category.TUBES) && (
                                <div className="flex flex-col items-start gap-2">
                                    <Label htmlFor="videoUrl" className="text-right">
                                        URL del video
                                    </Label>
                                    <Input
                                        disabled={loading}
                                        value={watch('videoUrl') || ''}
                                        {...register('videoUrl', {
                                            required: {
                                                value: true,
                                                message: 'URL del video es requerido.'
                                            },
                                        })}
                                    />
                                    {errors.videoUrl &&
                                        <span className="text-red-600 text-xs">{errors.videoUrl.message}</span>
                                    }
                                </div>
                            )}
                            {(watch('category') === Category.PODCAST) && (
                                <div className="flex flex-col items-start gap-2">
                                    <Label htmlFor="podcastUrl" className="text-right">
                                        URL del podcast
                                    </Label>
                                    <Input
                                        disabled={loading}
                                        value={watch('podcastUrl') || ''}
                                        {...register('podcastUrl', {
                                            required: {
                                                value: true,
                                                message: 'URL del podcast es requerido.'
                                            },
                                        })}
                                    />
                                    {errors.podcastUrl &&
                                        <span className="text-red-600 text-xs">{errors.podcastUrl.message}</span>
                                    }
                                </div>
                            )}
                            {(watch('category') === Category.READS) && (
                                <div className="flex flex-col items-start gap-2">
                                    <Label htmlFor="picture">Cargar Documento</Label>
                                    {loading ? (
                                        <div className="w-full flex justify-center">
                                            Subiendo documento...
                                            <div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500'></div>
                                        </div>
                                    ) : ''}
                                    {watch('attachments') && (
                                        <p>{watch('attachments')?.length} Documento adjunto cargado:
                                            {watch('attachments')?.map((attachment: string, index: number) => (
                                                <a
                                                    key={index}
                                                    href={attachment}
                                                    className="text-blue-500 hover:underline"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {attachment}
                                                </a>
                                            ))}
                                        </p>

                                    )}
                                    <Input disabled={loading} id="archive" type="file" name="media" onChange={handleOnChangeArchiveInput} />
                                    <Input
                                        disabled={loading}
                                        className="hidden"
                                        {...register('attachments', {
                                            required: {
                                                value: true,
                                                message: 'Documento adjunto es requerido.'
                                            },
                                            validate: {
                                                min: (value: string[] | null) => {
                                                    if (value && value.length < 1) {
                                                        return 'Documento adjunto es requerido.'
                                                    }
                                                    return true
                                                }
                                            }
                                        })}
                                    />
                                    {errors.attachments &&
                                        <span className="text-red-600 text-xs">{errors.attachments.message}</span>
                                    }
                                </div>
                            )}
                            <div className="flex flex-col items-start gap-2">
                                <Label htmlFor="podcastUrl" className="text-right">
                                    Author
                                </Label>
                                <Select
                                    options={authors.map(author => ({ value: author.id, label: author.name }))}
                                    {...register("userId", {
                                        required: {
                                            value: true,
                                            message: "Autor es requerido.",
                                        },
                                    })}
                                    value={watch('userId') as any &&
                                        authors.map(author =>
                                            ({ value: author.id, label: author.name }))
                                            .find(
                                                (item) => item.value === watch('userId')
                                            )}
                                    isDisabled={loading}
                                    className="w-full col-span-3 z-[100]"
                                    onChange={(option) => {
                                        setValue('userId', option.value)
                                        setError('userId', {
                                            type: 'disabled'
                                        })
                                    }}
                                />
                                {errors.userId &&
                                    <span className="text-red-600 text-xs">{errors.userId.message}</span>
                                }
                            </div>
                            <div className="flex flex-col items-start gap-2">
                                <Label htmlFor="podcastUrl" className="text-right">
                                    Tags
                                </Label>
                                <Creatable
                                    closeMenuOnSelect={false}
                                    isMulti
                                    options={tags.map(tag => ({ value: tag, label: tag }))}
                                    {...register("tags", {
                                        required: {
                                            value: true,
                                            message: "Tags son requeridos.",
                                        },
                                        validate: {
                                            min: (value: string[]) => {
                                                if (value.length < 1) {
                                                    return 'Tags son requeridos.'
                                                }
                                                return true
                                            }
                                        }
                                    })}
                                    value={watch('tags') as any &&
                                        watch('tags').map(tag =>
                                            ({ value: tag, label: tag }))}
                                    isDisabled={loading}
                                    className="w-full col-span-3 z-[99]"
                                    onChange={(options) => {
                                        const map = options.map((option: any) => option.value)
                                        setValue('tags', map)
                                        setError('tags', {
                                            type: 'disabled'
                                        })
                                    }}
                                />
                                {errors.tags &&
                                    <span className="text-red-600 text-xs">{errors.tags.message}</span>
                                }
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            disabled={loading}
                            type="submit"
                            className="bg-uss-green-700 hover:bg-uss-green-800 text-white font-bold py-2 px-4 rounded duration-300">
                            Guardar
                        </Button>
                        <Button
                            onClick={() => setOpen(!open)}
                            className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded duration-300">
                            Cancelar
                        </Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}

export default ModalPost