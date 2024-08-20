import { api } from "./api";
import { Professor } from "./professors";

export interface ProfessorParticipation {
  attended: number;
  pending: number;
}

export const getProfessorParticipationBySemester = async (
  semesterId: string = "dc888a19-a5e2-4a53-89f5-7c3cff282c37"
): Promise<ProfessorParticipation> => {
  const { data } = await api.get<ProfessorParticipation>(
    `/reports/professor-participation?semesterId=${semesterId}`
  );
  return data;
};

export interface SchoolStatitic {
  school: School;
  attended: number;
  pending: number;
  professorsCount: number;
  professors: Professor[];
}

interface School {
  name: string;
  createdAt: Date;
  id: string;
}

// {{url}}/api/training/:id/asistance-by-school
export const getAsistanceBySchool = async (): Promise<SchoolStatitic[]> => {
  const { data } = await api.get<SchoolStatitic[]>(
    "/training/97be5671-9b83-48f2-8c54-98e7731a7d06/asistance-by-school"
  );
  return data;
};

// {{url}}/api/reports/professor-participation-by-school?semesterId=dc888a19-a5e2-4a53-89f5-7c3cff282c37&trainingId
export const getProfessorParticipationBySchool = async (
  semesterId: string,
  trainingId?: string
): Promise<SchoolStatitic[]> => {
  const { data } = await api.get<SchoolStatitic[]>(
    `/reports/professor-participation-by-school`,
    {
      params: {
        semesterId,
        trainingId,
      },
    }
  );
  return data;
};

export interface ProffessorsByEmploymentType {
  full_time: number;
  part_time: number;
}
// {{url}}/api/reports/professors-by-employment-type
export const getProffessorsByEmploymentType =
  async (): Promise<ProffessorsByEmploymentType> => {
    const { data } = await api.get<ProffessorsByEmploymentType>(
      "/reports/professors-by-employment-type"
    );
    return data;
  };

export interface TrainingsByCompetency {
  competency: string;
  extra: number;
  scheduled: number;
}
export const getTrainingByCompetency = async (semesterId: string) => {
  const { data } = await api.get<TrainingsByCompetency[]>(
    "/reports/trainings-by-competency",
    {
      params: {
        semesterId,
      },
    }
  );
  return data;
};
