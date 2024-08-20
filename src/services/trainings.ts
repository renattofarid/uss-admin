import { api } from "./api";
import { Competency } from "./competencies";
import { Professor } from "./professors";
import { School } from "./schools";
export enum TrainingStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export type MapTrainingStatusType = {
  [key in TrainingStatus]: string;
};
export const MapTrainingStatus: MapTrainingStatusType = {
  [TrainingStatus.ACTIVE]: "Activo",
  [TrainingStatus.INACTIVE]: "Inactivo",
};
export enum TrainingModality {
  PRESENTIAL = "presential",
  VIRTUAL = "virtual",
  SEMIPRESENTIAL = "semipresential",
}
export type MapTrainingModalityType = {
  [key in TrainingModality]: string;
};
export const MapTrainingModality: MapTrainingModalityType = {
  [TrainingModality.PRESENTIAL]: "Presencial",
  [TrainingModality.VIRTUAL]: "Virtual",
  [TrainingModality.SEMIPRESENTIAL]: "Semipresencial",
};
export enum RoleInscription {
  ASSISTANT = "assistant",
  SPEAKER = "speaker",
  ORGANIZER = "organizer",
}
// export enum MapRoleInscription {
//   assistant = "Asistente",
//   speaker = "Ponente",
//   organizer = "Organizador",
// }
export const MapRoleInscription: {
  [key in RoleInscription]: string;
} = {
  [RoleInscription.ASSISTANT]: "Asistente",
  [RoleInscription.SPEAKER]: "Ponente",
  [RoleInscription.ORGANIZER]: "Organizador",
};

export enum TypeTraining {
  EXTRA = "extra",
  SCHEDULED = "scheduled",
}
export const MapTypeTraining: {
  [key in TypeTraining]: string;
} = {
  [TypeTraining.EXTRA]: "Extraordinaria",
  [TypeTraining.SCHEDULED]: "Programada",
};

export interface Training {
  competencyId:  string;
  code:         string;
  name:         string;
  organizer: "DDA" | School;
  status:       TrainingStatus;
  modality:     TrainingModality;
  executions:   Execution[];
  competency: Competency;
  createdAt:    string;
  background?: string;
  signature?: string;
  issueDate?: string;
  type: TypeTraining;
  id:           string;
}

export enum AttendanceStatus {
  PENDING = 'pending',
  ATTENDED = 'attended',
}
export enum MapAttendanceStatus {
  pending = 'Pendiente',
  attended = 'Verificado',
}

export interface Attendance {
  id:            string;
  participantId: string;
  status:        string;
  createdAt:     string;
}
export interface Execution {
  from: string;
  to:   string;
  id:   string;
  place: string;
  attendance: Attendance[];
}
export interface TrainingBodyRequest {
  competencyId: string;
  code:       string;
  name:       string;
  organizer:  string;
  description: string
  capacity:   number;
  status:     string;
  modality:   string;
  semesterId: string;
  type:       TypeTraining;
  certificateOrganizer: string;
  certificateBackgroundUrl?: string;
  certificateSignatureUrl?: string;
  certificateEmisionDate?: string;
  executions: Partial<Execution>[];
}

export const getTrainings = async (): Promise<Training[]> => {
  const { data } = await api.get<Training[]>("/training");
  return data;
};

export const createTraining = async (
  Training: TrainingBodyRequest
): Promise<Training> => {
  const { data } = await api.post<Training>("/training", Training);
  return data;
};

export const updateTraining = async (
  id: string,
  Training: TrainingBodyRequest
): Promise<Training> => {
  const { data } = await api.put<Training>(`/training/${id}`, Training);
  return data;
};

export const deleteTraining = async (id: string): Promise<void> => {
  await api.delete(`/training/${id}`);
};


export interface Participant {
  id:               string;
  foreignId:        string;
  roles:             RoleInscription[];
  attendanceStatus: AttendanceStatus;
  certificates:      Certificate[];
  professor:        Professor;
  executions:       ParticipantExecution[];
}
export interface ParticipantExecution extends Execution {
  participantAttend: boolean;
}

export interface Certificate {
  id:               string;
  duration:         number;
  emisionDate:      string;
  trainingFromDate: string;
  trainingToDate:   string;
  url:              string;
  role:            RoleInscription;
}

// {{url}}/api/training/:id/participants
export const getParticipants = async (id: string): Promise<Participant[]> => {
  const { data } = await api.get<Participant[]>(`/training/${id}/participants`);
  return data;
};

// {{url}}/api/training/participants/:participantId/complete
export const completeStatusOfParticipant = async (participantId: string): Promise<Participant> => {
  const { data } = await api.post(`/training/participants/${participantId}/complete`);
  return data;
};

export interface SingleTraining extends Training {
  participant: Participant;
}
export interface TrainingByDocument {
  professor: Professor;
  trainings: SingleTraining[];
}

// {{url}}/api/training/by-document/:documentType/:documentNumber
export const getTrainingsByDocument = async (
  documentType: string = 'dni',
  documentNumber: number
): Promise<TrainingByDocument> => {
  const { data } = await api.get<TrainingByDocument>(
    `/training/by-document/${documentType}/${documentNumber}`
  );
  return data;
};