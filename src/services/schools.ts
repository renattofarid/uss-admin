import { api } from "./api";

export interface School {
  name: string;
  createdAt: string;
  id: string;
}
export interface SchoolBodyRequest {
  name: string;
}

export const getSchools = async (): Promise<School[]> => {
  const { data } = await api.get<School[]>('/schools');
  return data;
};

export const createSchool = async (School: SchoolBodyRequest): Promise<School> => {
  const { data } = await api.post<School>('/schools', School);
  return data;
};

export const updateSchool = async (id: string, School: SchoolBodyRequest): Promise<School> => {
  const { data } = await api.put<School>(`/schools/${id}`, School);
  return data;
};

export const deleteSchool = async (id: string): Promise<void> => {
  await api.delete(`/schools/${id}`);
};
