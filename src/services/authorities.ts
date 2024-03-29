import { api } from "./api";

export interface Authority {
  name: string;
  imageUrl: string;
  hierachy: number;
  position: string;
  createdAt: string;
  id: string;
}
export interface AuthorityBodyRequest {
  name: string;
  imageUrl: string;
  hierachy: number;
  position: string;
}

export const getAuthorities = async (): Promise<Authority[]> => {
  const { data } = await api.get<Authority[]>('/authorities');
  return data;
};

export const createAuthority = async (authority: AuthorityBodyRequest): Promise<Authority> => {
  const { data } = await api.post<Authority>('/authorities', authority);
  return data;
};

export const updateAuthority = async (id: string, authority: AuthorityBodyRequest): Promise<Authority> => {
  const { data } = await api.put<Authority>(`/authorities/${id}`, authority);
  return data;
};

export const deleteAuthority = async (id: string): Promise<void> => {
  await api.delete(`/authorities/${id}`);
};
