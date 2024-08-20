import { api } from "./api";

export interface StorageBlob {
    name:      string;
    createdAt: string;
    url:       string;
    id:        string;
}

export const getBlobs = async (): Promise<StorageBlob[]> => {
  const { data } = await api.get<StorageBlob[]>('/storage');
  return data;
};

export const deleteBlob = async (id: string): Promise<void> => {
  await api.delete(`/storage/${id}`);
};
