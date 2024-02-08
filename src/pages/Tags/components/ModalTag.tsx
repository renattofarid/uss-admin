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
import { createTag } from "@/services/tags";
import { TagContext } from "../context/TagContext";
import { toast } from "sonner";

function ModalTag() {
    // const [open, setOpen] = useState(false);
    const { loading, setLoading, open, setOpen, setTableTags } = useContext(TagContext)
    const [form, setForm] = useState<{name: string}>({
        name: '',
    })

    useEffect(() => {
        return () => {
            setForm({
                name: '',
            })
        }
    }, [])

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };


    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            const newTag = await createTag(form.name);
            setTableTags(prev => [{
                id: newTag.id,
                name: newTag.name,
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
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Nuevo Tag
            </Button> */}
            <DialogContent
                // className={"lg:max-w-screen-lg max-h-screen overflow-y-scroll"}
                onPointerDownOutside={e => {
                    e.preventDefault()
                }}>
                <DialogHeader>
                    <DialogTitle>Nuevo Tag</DialogTitle>
                    <DialogDescription>
                        Complete el formulario para crear un nuevo Tag
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleOnSubmit} encType='multipart/form-data'>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex flex-col items-start gap-2">
                            <Label htmlFor="name" className="text-right">
                                Nombre
                            </Label>
                            <Input
                                id="name"
                                value={form.name}
                                name="name"
                                onChange={handleOnChange}
                                disabled={loading}
                                className="col-span-3" />
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

export default ModalTag