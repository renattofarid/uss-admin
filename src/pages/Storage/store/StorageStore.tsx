import { Button } from "@/components/ui/button";
import { uploadFile } from "@/services/posts";
import { StorageBlob, deleteBlob, getBlobs } from "@/services/storage";
import { ActionsTypes } from "@/types/general";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { create } from "zustand";

interface TableStorage {
  [key: string | number]: string | number | JSX.Element;
  id: string;
  order: number;
}
type State = {
  blobs: StorageBlob[];
  tags: string[];
  tableBlobs: TableStorage[];
  blobSelected: StorageBlob | null;
  action: ActionsTypes;
  loading: boolean;
  open: boolean;
};

type Actions = {
  getData: () => Promise<void>;
  setBlobSelected: (semester: StorageBlob | null, action: ActionsTypes) => void;
  createBlob: (file: File, name: string) => Promise<void>;
  deleteBlob: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
};

const mapSemestersToTableSemesters = (storage: StorageBlob[]): TableStorage[] => {
  return storage.map((blob, idx) => ({
    name: (
      <div className="flex flex-row gap-1 items-center">
        <a
          href={blob.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {blob.name}
        </a>
        <Button
          variant="outline"
          className="w-5 h-5 p-0 m-0"
          onClick={() => {
            // copiar al portapapeles
            navigator.clipboard.writeText(blob.url);
          }}
        >
          <Copy className="w-3 h-3" />
        </Button>
      </div>
    ),
    id: blob.id,
    createdAt: blob.createdAt,
    order: idx + 1,
  }));
}

export const StorageStore = create<State & Actions>((set) => ({
  blobs: [],
  tags: [],
  tableBlobs: [],
  blobSelected: null,
  action: 'none',
  loading: false,
  open: false,
  getData: async () => {
    try {
      set({ loading: true });
      const blobs = await getBlobs();
      set({ blobs: blobs });
      const tableBlobs = mapSemestersToTableSemesters(blobs);
      set({ tableBlobs: tableBlobs });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente");
    } finally {
      set({ loading: false });
    }
  },
  setBlobSelected(blob, action) {
    const id = blob?.id;
    const semesterSelected = StorageStore.getState().blobs.find((blob) => blob.id === id);
    set({ blobSelected: semesterSelected, action, open: !!id });
  },
  createBlob: async (file, name) => {
    try {
      set({ loading: true });
      const newBlob = await uploadFile(file, name);
      set({ blobs: [(newBlob as StorageBlob), ...StorageStore.getState().blobs] });
      set({ tableBlobs: mapSemestersToTableSemesters(StorageStore.getState().blobs) });
      set({ open: false });
      toast.success("Recurso creado correctamente");
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  deleteBlob: async (id) => {
    try {
      set({ loading: true });
      await deleteBlob(id);
      const updtBlobs = StorageStore.getState().blobs.filter((School) => School.id !== id);
      set({ blobs: updtBlobs });
      set({ tableBlobs: mapSemestersToTableSemesters(updtBlobs) });
      set({ open: false });
      toast.success("Recurso eliminado correctamente");
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  setLoading: (loading) => set({ loading }),
  setOpen: (open) => set({ open }),
}));
