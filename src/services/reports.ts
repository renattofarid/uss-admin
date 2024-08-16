import { api } from "./api";
export interface AsistanceByYear {
  [key: string]: Year;
}

export interface Year {
  attended: number;
  pending: number;
}

// {{url}}/api/professors/reports/asistance-by-year
export const getAsistanceByYear = async (): Promise<AsistanceByYear> => {
  const { data } = await api.get<AsistanceByYear>(
    "/professors/reports/asistance-by-year"
  );
  return data;
};

export interface SchoolStatitic {
  school:   School;
  attended: number;
  pending:  number;
}

interface School {
  name:      string;
  createdAt: Date;
  id:        string;
}

// {{url}}/api/training/:id/asistance-by-school
export const getAsistanceBySchool = async (): Promise<SchoolStatitic[]> => {
  const { data } = await api.get<SchoolStatitic[]>(
    "/training/97be5671-9b83-48f2-8c54-98e7731a7d06/asistance-by-school"
  );
  return data;
};