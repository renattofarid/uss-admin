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
import { UserBodyRequest, createUser } from "@/services/users";
import { uploadFile } from "@/services/posts";
import { UserContext } from "../context/UserContext";
import { toast } from "sonner";

function ModalPost() {
    // const [open, setOpen] = useState(false);
    const { loading, setLoading, open, setOpen, setTableUsers } = useContext(UserContext)
    const [form, setForm] = useState<UserBodyRequest>({
        email: '',
        name: '',
        password: 'password',
        role: 'author',
        image: '',
    })

    useEffect(() => {
        return () => {
            setForm({
                email: '',
                name: '',
                password: 'password',
                role: 'author',
                image: '',
            })
        }
    }, [])


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
            const { url } = await uploadFile(file);
            setForm({
                ...form,
                image: url,
            });
        } catch (error) {
            toast.error('Ocurrió un error inesperado, intente nuevamente');
        } finally {
            setLoading(false);
        }


    }

    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            const newUser = await createUser(form);
            setTableUsers(prev => [{
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                image: (
                    <img
                        className="h-8 w-8 rounded-full"
                        src={newUser.image || 'https://avatars.githubusercontent.com/u/93000567'}
                        alt={newUser.name}
                    />
                ),
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
                    <DialogTitle>Nuevo User</DialogTitle>
                    <DialogDescription>
                        Complete el formulario para crear un nuevo usuario
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleOnSubmit} encType='multipart/form-data'>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex flex-col items-start gap-2">
                            <Label htmlFor="title" className="text-right">
                                Nombres
                            </Label>
                            <Input
                                id="name"
                                value={form.name}
                                name="name"
                                onChange={handleOnChange}
                                disabled={loading}
                                className="col-span-3" />
                        </div>
                        <div className="flex flex-col items-start gap-2">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input disabled={loading} id="email" value={form.email || ''} name="email" onChange={handleOnChange} className="col-span-3" />
                        </div>
                        <div className="flex flex-col items-start gap-2">
                            <Label htmlFor="role" className="text-right">
                                Rol
                            </Label>
                            <Input readOnly disabled={loading} id="role" value={form.role || ''} name="role" onChange={handleOnChange} className="col-span-3" />
                        </div>

                        <div className="flex flex-col items-start gap-2">
                            <Label htmlFor="picture">Cargar Imagen</Label>
                            {loading ? (
                                <div className="w-full flex justify-center">
                                    Subiendo imagen...
                                    <div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500'></div>
                                </div>
                            ) : ''}
                            {form?.image && (
                                <img src={form.image} alt="Imagen" className="h-36 w-auto object-cover transition-all hover:scale-105" />
                            )}
                            <Input disabled={loading} id="picture" type="file" name="media" onChange={handleOnChangeImageInput} />
                        </div>
                        <div className="flex flex-col items-start gap-2">
                            <Label htmlFor="imageUrl" className="text-right">
                                URL del Avatar
                            </Label>
                            <Input disabled={loading} readOnly id="image" value={form.image || ''} name="image" onChange={handleOnChange} className="col-span-3" />
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