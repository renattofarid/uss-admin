import { api } from "./api";

export enum ProfessorDocumentType {
  DNI = "dni",
  PASSPORT = "passport",
  FOREIGNER_CARD = "foreigner_card",
}
export interface Professor {
  name: string;
  email: string;
  documentType: ProfessorDocumentType;
  documentNumber: number;
  schoolId: string;
  createdAt: string;
  id: string;
}
export interface ProfessorBodyRequest {
  name: string;
  email: string;
  documentType: ProfessorDocumentType;
  documentNumber: number;
  schoolId: string;
}

export const getProfessors = async (): Promise<Professor[]> => {
  const { data } = await api.get<Professor[]>("/professors");
  return data;
};

export const createProfessor = async (
  Professor: ProfessorBodyRequest
): Promise<Professor> => {
  const { data } = await api.post<Professor>("/professors", Professor);
  return data;
};

export const updateProfessor = async (
  id: string,
  Professor: ProfessorBodyRequest
): Promise<Professor> => {
  const { data } = await api.put<Professor>(`/professors/${id}`, Professor);
  return data;
};

export const deleteProfessor = async (id: string): Promise<void> => {
  await api.delete(`/professors/${id}`);
};
