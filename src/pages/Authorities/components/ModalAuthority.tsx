import { useForm } from "react-hook-form";
import { AuthorityBodyRequest } from "@/services/authorities";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";
import { uploadFile } from "@/services/posts";
import { AuthorityStore } from "../store/AuthorityStore";
import { Input } from "@/components/ui/input";

function ModalAuthority() {
    const { setOpen, action, loading, open, authoritySelected, setAuthoritySelected, crtAuthority, updAuthority, setLoading, delAuthority } = AuthorityStore()

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Autoridad'
            case 'delete':
                return 'Eliminar Autoridad'
            case 'create':
                return 'Crear Autoridad'
            default:
                return 'Autoridad'
        }
    };

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<AuthorityBodyRequest>({
        defaultValues: {
            name: '',
            hierachy: 0,
            imageUrl: '',
            position: '',
        }
    })
    useEffect(() => {
        if (action === 'create') {
            return reset()
        }
        if (action === 'edit') {
            if (!authoritySelected) return
            reset(authoritySelected)
        }
        return () => {
            reset()
            setAuthoritySelected(null, 'none')
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
    const onSubmit = handleSubmit(async (data, e) => {
        (e as any).preventDefault();
        if (action === 'create') {
            return await crtAuthority(data)
        }
        if (action === 'edit') {
            if (!authoritySelected) return
            await updAuthority(authoritySelected.id, data)
            setAuthoritySelected(null, 'none')
            setOpen(false)
            toast('Authority actualizado correctamente')
            return
        }
        if (action === 'delete') {
            if (!authoritySelected) return
            return await delAuthority(authoritySelected.id)
        }
    })
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className={"lg:max-w-screen-lg max-h-screen overflow-y-auto"}
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
                    {action === 'delete' && (
                        <div>
                            <h1 className="py-6">
                                ¿Estás seguro de eliminar a {authoritySelected?.name}?
                            </h1>
                        </div>
                    )}
                    {(action === 'create' || action === 'edit') && (
                        <>
                            <div className="flex flex-col items-start gap-2">
                                <Label htmlFor="title" className="text-right">
                                    Nombre
                                </Label>
                                <Input
                                    id="title"
                                    value={watch('name')}
                                    disabled={loading}
                                    className="col-span-3"
                                    placeholder="Nombre"
                                    {...register('name', {
                                        required: {
                                            value: true,
                                            message: 'Nombre es requerido.'
                                        },
                                        maxLength: {
                                            value: 80,
                                            message: 'Nombre debe tener 80 caracteres como máximo.'
                                        }
                                    })}
                                />
                                {errors.name &&
                                    <span className="text-red-600 text-xs">{errors.name.message}</span>
                                }
                            </div>
                            <div className="flex flex-col items-start gap-2">
                                <Label htmlFor="title" className="text-right">
                                    Orden
                                </Label>
                                <Input
                                    id="title"
                                    value={watch('hierachy')}
                                    disabled={loading}
                                    className="col-span-3"
                                    placeholder="Orden"
                                    {...register('hierachy', {
                                        required: {
                                            value: true,
                                            message: 'Orden es requerido.'
                                        },
                                    })}
                                />
                                {errors.hierachy &&
                                    <span className="text-red-600 text-xs">{errors.hierachy.message}</span>
                                }
                            </div>
                            <div className="flex flex-col items-start gap-2">
                                <Label htmlFor="title" className="text-right">
                                    Cargo
                                </Label>
                                <Input
                                    id="title"
                                    value={watch('position')}
                                    disabled={loading}
                                    className="col-span-3"
                                    placeholder="Cargo"
                                    {...register('position', {
                                        required: {
                                            value: true,
                                            message: 'Cargo es requerido.'
                                        },
                                    })}
                                />
                                {errors.position &&
                                    <span className="text-red-600 text-xs">{errors.position.message}</span>
                                }
                            </div>
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
                        </>
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

export default ModalAuthority