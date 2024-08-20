import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";
import { SemesterStore } from "../store/SemesterStore";
import { Input } from "@/components/ui/input";
import { SemesterBodyRequest } from "@/services/semesters";

function ModalSemester() {
    const { setOpen, action, loading, open, semesterSelected, setSemesterSelected, createSemester, updateSemester, deleteSemester } = SemesterStore()

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Semestre'
            case 'delete':
                return 'Eliminar Semestre'
            case 'create':
                return 'Crear Semestre'
            default:
                return 'Semestre'
        }
    };

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<SemesterBodyRequest>({
        defaultValues: {
            name: '',
        }
    })
    useEffect(() => {
        if (action === 'create') {
            return reset()
        }
        if (action === 'edit') {
            if (!semesterSelected) return
            reset(semesterSelected)
        }
        return () => {
            reset()
            setSemesterSelected(null, 'none')
        }
    }, [])

    useEffect(() => {
    }, [semesterSelected])
    const onSubmit = handleSubmit(async (data, e) => {
        (e as any).preventDefault();
        if (action === 'create') {
            return await createSemester(data)
        }
        if (action === 'edit') {
            if (!semesterSelected) return
            await updateSemester(semesterSelected.id, data)
            setSemesterSelected(null, 'none')
            setOpen(false)
            toast('Semestre actualizado correctamente')
            return
        }
        if (action === 'delete') {
            if (!semesterSelected) return
            return await deleteSemester(semesterSelected.id)
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
                                ¿Estás seguro de eliminar a {semesterSelected?.name}?
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

export default ModalSemester