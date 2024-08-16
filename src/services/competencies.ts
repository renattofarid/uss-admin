import { api } from "./api";

export interface Competency {
  name: string;
  createdAt: string;
  id: string;
}
export interface CompetencyBodyRequest {
  name: string;
}

export const getCompetencys = async (): Promise<Competency[]> => {
  const { data } = await api.get<Competency[]>("/competencies");
  return data;
};

export const createCompetency = async (
  payload: CompetencyBodyRequest
): Promise<Competency> => {
  const { data } = await api.post<Competency>("/competencies", payload);
  return data;
};

export const updateCompetency = async (
  id: string,
  payload: CompetencyBodyRequest
): Promise<Competency> => {
  const { data } = await api.put<Competency>(`/competencies/${id}`, payload);
  return data;
};

export const deleteCompetency = async (id: string): Promise<void> => {
  await api.delete(`/competencies/${id}`);
};
