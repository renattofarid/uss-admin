import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { RequestStore } from "../store/RequestStore";
import { categoryMapper } from "@/services/posts";
import { ApprovalStatus } from "@/services/request";

function ModalRequest() {

    const { loading, open, setOpen, setRequestSelected, action, updRequestStatus, requestSelected } = RequestStore();
    const title = () => {
        switch (action) {
            case 'view':
                return 'Ver Solicitud'
            case 'edit':
                return 'Editar Solicitud'
            case 'delete':
                return 'Eliminar Solicitud'
            case 'create':
                return 'Crear Solicitud'
            case 'accept':
                return 'Aceptar Solicitud'
            default:
                return 'Solicitud'
        }
    };

    useEffect(() => {
        return () => {
            setRequestSelected('', 'none')
        }
    }, [])

    const onSubmit = async (e: any) => {
        (e as any).preventDefault();
        if (action === 'accept') {
            if (!requestSelected) return
            return await updRequestStatus(requestSelected.id, ApprovalStatus.APPROVED)
        }
        if (action === 'reject') {
            if (!requestSelected) return
            return await updRequestStatus(requestSelected.id, ApprovalStatus.REJECTED)
        }
    }

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
                            {JSON.stringify({ requestSelected, action }, null, 4)}
                        </code>
                    </pre>
                    {action === 'accept' ? (
                        <div>
                            <h1 className="py-6">
                                ¿Estás seguro de aceptar: {requestSelected?.title}?
                            </h1>
                        </div>
                    ) : action === 'reject' ? (
                        <div>
                            <h1 className="py-6">
                                ¿Estás seguro de rechazar: {requestSelected?.title}?
                            </h1>
                        </div>
                    ) : action === 'view' ? (
                        <div className="py-6 flex flex-col gap-2">
                            {requestSelected?.category && (
                                <div>
                                    <label className="text-xs italic">Categoría</label>
                                    <p className="font-semibold">{categoryMapper[requestSelected!.category]}</p>
                                </div>
                            )}
                            {requestSelected?.title && (
                                <div>
                                    <label className="text-xs italic">Título</label>
                                    <h1 className="font-semibold">{requestSelected?.title}</h1>
                                </div>
                            )}
                            {requestSelected?.description && (
                                <div>
                                    <label className="text-xs italic">Descripción</label>
                                    <p>{requestSelected?.description}</p>
                                </div>
                            )}
                            {requestSelected?.imageUrl && (
                                <div>
                                    <label className="text-xs italic">Imagen de post</label>
                                    <img
                                        className="w-48 h-48 rounded-lg object-cover"
                                        src={
                                            requestSelected?.imageUrl ||
                                            "https://avatars.githubusercontent.com/u/93000567"
                                        }
                                        alt={requestSelected?.title}
                                    />
                                </div>
                            )}
                            {requestSelected?.imageDescription && (
                                <div>
                                    <label className="text-xs italic">Descripción de imagen</label>
                                    <p>{requestSelected?.imageDescription}</p>
                                </div>
                            )}
                            {requestSelected?.content && (
                                <div>
                                    <label className="text-xs italic">Contenido</label>
                                    <div dangerouslySetInnerHTML={{ __html: requestSelected!.content }}></div>
                                </div>
                            )}
                            {requestSelected?.videoUrl && (
                                <div>
                                    <label className="text-xs italic">URL Video</label>
                                    <a href={requestSelected!.videoUrl} target="_blank" rel="noreferrer">
                                        {requestSelected!.videoUrl}
                                    </a>
                                </div>
                            )}
                            {requestSelected?.podcastUrl && (
                                <div>
                                    <label className="text-xs italic">URL Podcast</label>
                                    <a href={requestSelected!.podcastUrl} target="_blank" rel="noreferrer">
                                        {requestSelected!.podcastUrl}
                                    </a>
                                </div>
                            )}
                            {requestSelected?.attachments && (
                                <div>
                                    <label className="text-xs italic">Archivo Adjunto</label>
                                    {requestSelected?.attachments.map((attachment, index) => (
                                        <a key={index} href={attachment} target="_blank" rel="noreferrer">
                                            {attachment}
                                        </a>
                                    ))}
                                </div>
                            )}
                            {requestSelected?.tags && (
                                <div>
                                    <label className="text-xs italic">Tags</label>
                                    <div className="flex flex-row gap-0.5">
                                        {requestSelected?.tags.map((tag, index) => (
                                            <span key={index} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-lg text-xs font-semibold">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (<></>)}
                    <DialogFooter>
                        <Button
                            disabled={loading || (action === 'view')}
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

export default ModalRequest