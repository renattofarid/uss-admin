import { api } from "./api";

export interface Semester {
  name: string;
  createdAt: string;
  id: string;
}
export interface SemesterBodyRequest {
  name: string;
}

export const getSemesters = async (): Promise<Semester[]> => {
  const { data } = await api.get<Semester[]>('/semesters');
  return data;
};

export const createSemester = async (Semester: SemesterBodyRequest): Promise<Semester> => {
  const { data } = await api.post<Semester>('/semesters', Semester);
  return data;
};

export const updateSemester = async (id: string, Semester: SemesterBodyRequest): Promise<Semester> => {
  const { data } = await api.put<Semester>(`/semesters/${id}`, Semester);
  return data;
};

export const deleteSemester = async (id: string): Promise<void> => {
  await api.delete(`/semesters/${id}`);
};
