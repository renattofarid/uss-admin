import { useForm } from "react-hook-form";
import { homeStore } from "../store/HomeStore";
import { RequestUpdateHomePost, updateHomePost } from "@/services/home";
import { useEffect, useState } from "react";
import { postStore } from "@/pages/Posts/store/PostStore";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import Select from 'react-select';
import { toast } from "sonner";
import { Category, HomeSectionTypeMapper } from "@/services/posts";

function ModalHomePost() {
    const { setIdHomePostSelected, setOpen, action, idHomePostSelected, loading, open, getHomePosts, typePostSelected } = homeStore()
    const { posts } = postStore();
    const [type, setType] = useState<Category>()
    useEffect(() => {
        if (!typePostSelected) return
        setType(HomeSectionTypeMapper[typePostSelected])
    }, [typePostSelected])

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar HomePost'
            case 'delete':
                return 'Eliminar HomePost'
            case 'create':
                return 'Crear HomePost'
            default:
                return 'HomePost'
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
    } = useForm<RequestUpdateHomePost>({
        defaultValues: {
            postId: '',
        }
    })
    useEffect(() => {
        if (action === 'create') {
            return reset()
        }
        if (action === 'edit') {
            if (!idHomePostSelected) return
        }
        return () => {
            reset()
            setIdHomePostSelected(null)
        }
    }, [])
    const onSubmit = handleSubmit(async (data, e) => {
        (e as any).preventDefault();
        if (action === 'create') {
            // return await crtPost(data)
        }
        if (action === 'edit') {
            if (!idHomePostSelected) return
            await updateHomePost(idHomePostSelected, data)
            setIdHomePostSelected(null)
            setOpen(false)
            toast('HomePost actualizado correctamente')
            await getHomePosts()
            return
        }
        if (action === 'delete') {
            if (!idHomePostSelected) return
            // return await delPost(idHomePostSelected.id)
        }
    })
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className={"lg:max-w-screen-lg min-h-[500px] overflow-y-auto items-start"}
                onPointerDownOutside={e => {
                    e.preventDefault()
                }}>
                <DialogHeader>
                    <DialogTitle>{title()}</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} encType='multipart/form-data' className="">
                    <pre className="text-xs hidden">
                        <code>
                            {JSON.stringify({ form: watch(), action }, null, 4)}
                        </code>
                    </pre>
                    <div className="flex flex-col items-start gap-2 pb-[150px]">
                        <Label htmlFor="podcastUrl" className="text-right">
                            Posts
                        </Label>
                        <Select
                            options={
                                posts
                                .filter(post => post.category === type)
                                .map(post => ({ value: post.id, label: post.title }))
                            }
                            {...register("postId", {
                                required: {
                                    value: true,
                                    message: "Autor es requerido.",
                                },
                            })}
                            value={watch('postId') as any &&
                                posts.map(post =>
                                    ({ value: post.id, label: post.title }))
                                    .find(
                                        (item) => item.value === watch('postId')
                                    )}
                            isDisabled={loading}
                            className="w-full col-span-3 z-[100]"
                            onChange={(option) => {
                                setValue('postId', option.value)
                                setError('postId', {
                                    type: 'disabled'
                                })
                            }}
                        />
                        {errors.postId &&
                            <span className="text-red-600 text-xs">{errors.postId.message}</span>
                        }
                    </div>
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

export default ModalHomePost