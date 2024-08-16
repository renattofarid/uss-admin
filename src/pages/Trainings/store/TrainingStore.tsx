import { Training, TrainingBodyRequest, createTraining, updateTraining, getTrainings, deleteTraining, MapTrainingModality, MapTrainingStatus, Participant, getParticipants, completeStatusOfParticipant } from "@/services/trainings";
import { ActionsTypes } from "@/types/general";
import { ErrorType } from "@/utils/types";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { TrainingErrorCode } from "../lib/error-codes";
import { Competency, getCompetencys } from "@/services/competencies";

interface TableTrainings {
  [key: string | number]: string | number | JSX.Element;
  id: string;
  code: string;
  name: string;
  organizer: string;
  competency: string;
  status: string;
  modality: string;
}
type State = {
  trainings: Training[];
  competencies: Competency[];
  tags: string[];
  tableTrainings: TableTrainings[];
  trainingSelected: Training | null;
  action: ActionsTypes;
  loading: boolean;
  open: boolean;
  participants: Participant[] | null;
  participantsDraft: Participant[] | null;
};

type Actions = {
  getData: () => Promise<void>;
  setTrainingSelected: (Training: Training | null, action: ActionsTypes) => void;
  crtTraining: (body: TrainingBodyRequest) => Promise<void>;
  updTraining: (id: string, body: TrainingBodyRequest) => Promise<void>;
  delTraining: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
  getParticipantsByTraining: () => Promise<void>;
  downloadCertificate: (participant: Participant) => Promise<void>;
  verifyAttendance: (participant: Participant) => Promise<void>;
  searchParticipants: (search: string) => void;
};

const mapTrainingsToTableTrainings = (trainings: Training[], competencies: any): TableTrainings[] => {
  return trainings.map((training) => ({
    name: training.name,
    competency: competencies.find((c: any) => c.id === training.competencyId)?.name,
    id: training.id,
    code: training.code,
    modality: MapTrainingModality[training.modality],
    organizer: training.organizer === "DDA" ? "DDA" : training.organizer.name,
    status: MapTrainingStatus[training.status],
  }));
}

export const TrainingStore = create<State & Actions>((set) => ({
  trainings: [],
  participantsDraft: [],
  competencies: [],
  tags: [],
  tableTrainings: [],
  trainingSelected: null,
  action: 'none',
  loading: false,
  open: false,
  participants: null,
  getData: async () => {
    try {
      set({ loading: true });
      const [trainings, competencies] = await Promise.all([getTrainings(), getCompetencys()]);
      set({ trainings });
      set({ competencies });
      const tableTrainings = mapTrainingsToTableTrainings(trainings, competencies);
      set({ tableTrainings });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  setTrainingSelected(training, action) {
    const id = training?.id;
    const trainingSelected = TrainingStore.getState().trainings.find((training) => training.id === id);
    set({ trainingSelected, action, open: !!training?.id });
  },
  crtTraining: async (body) => {
    const competencies = TrainingStore.getState().competencies;
    const trainings = TrainingStore.getState().trainings;
    try {
      set({ loading: true });
      const newTraining = await createTraining({ ...body, capacity: Number(body.capacity) });
      set({ trainings: [newTraining, ...trainings] });
      set({ tableTrainings: mapTrainingsToTableTrainings([newTraining, ...trainings], competencies) });
      set({ open: false });
    } catch (error) {
      console.log({ error })
      const code = ((error as AxiosError)?.response?.data as ErrorType)?.code as keyof typeof TrainingErrorCode;
      toast.error(TrainingErrorCode[code] ?? "Ocurrió un error inesperado, intente nuevamente");
    } finally {
      set({ loading: false });
    }
  },
  updTraining: async (id, body) => {
    const competencies = TrainingStore.getState().competencies;
    try {
      set({ loading: true });
      const updatedTraining = await updateTraining(id, body);
      const updatedTrainings = TrainingStore.getState().trainings.map((Training) =>
        Training.id === updatedTraining.id ? updatedTraining : Training
      );
      set({ trainings: updatedTrainings });
      set({ tableTrainings: mapTrainingsToTableTrainings(updatedTrainings, competencies) });
      set({ open: false });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  delTraining: async (id) => {
    const competencies = TrainingStore.getState().competencies;
    try {
      set({ loading: true });
      await deleteTraining(id);
      const updatedTrainings = TrainingStore.getState().trainings.filter((Training) => Training.id !== id);
      set({ trainings: updatedTrainings });
      set({ tableTrainings: mapTrainingsToTableTrainings(updatedTrainings, competencies) });
      set({ open: false });
      toast.success("Capacitación eliminada correctamente");
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  setLoading: (loading) => set({ loading }),
  setOpen: (open) => set({ open }),
  getParticipantsByTraining: async (): Promise<void> => {
    set({ participants: null });
    set({ participantsDraft: null });
    const trainingSelected = TrainingStore.getState().trainingSelected;
    if (!trainingSelected) {
      toast.error("No se ha seleccionado una capacitación")
      return;
    };
    try {
      set({ loading: true });
      const participants = await getParticipants(trainingSelected.id);
      set({ participants });
      set({ participantsDraft: participants });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  downloadCertificate: async (participant: Participant) => {
    try {
      set({ loading: true });
      if (!participant.certificate) return;
      const response = await fetch(participant.certificate?.url);
      console.log({ response })
      const blob = await response.blob();

      // Crea una URL para el Blob y descarga el archivo
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = urlBlob;
      a.download = "Certificado.pdf"; // Nombre del archivo descargado
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(urlBlob);
      document.body.removeChild(a);
    } catch (error) {
      console.log(error);
      toast.error("Error al generar PDF");
    } finally { set({ loading: false }); }
  },
  verifyAttendance: async (participant: Participant) => {
    const participants = TrainingStore.getState().participants;
    if (!participants) return;
    try {
      set({ loading: true });
      const newParticipant = await completeStatusOfParticipant(participant.id);
      toast.success("Asistencia verificada correctamente");

      // Actualiza la lista de participantes
      const newParticipants = [...participants].map((p) =>
        p.id === participant.id ? {
          ...newParticipant,
          professor: p.professor,
          roles: p.roles,
          executions: p.executions
        } : p
      );
      set({
        participants: newParticipants,
        participantsDraft: newParticipants,
      });
    } catch (error) {
      console.log({ error })
      const code = ((error as AxiosError)?.response?.data as ErrorType)?.code as keyof typeof TrainingErrorCode;
      toast.error(TrainingErrorCode[code] ?? "Ocurrió un error inesperado, intente nuevamente");
    } finally { set({ loading: false }); }
  },
  searchParticipants: (search) => {
    const participants = TrainingStore.getState().participants;
    if (!participants) return;
    const filteredParticipants = [...participants].filter((participant) =>
      participant.professor.email.toLowerCase().includes(search.toLowerCase()) ||
      participant.professor.name.toLowerCase().includes(search.toLowerCase()) ||
      participant.professor.documentNumber.toString().toLowerCase().includes(search.toLowerCase())
    );
    set({ participantsDraft: filteredParticipants });
  },
}));
