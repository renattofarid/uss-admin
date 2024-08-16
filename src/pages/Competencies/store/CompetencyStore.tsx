import { Competency, CompetencyBodyRequest, createCompetency, updateCompetency, getCompetencys, deleteCompetency } from "@/services/competencies";
import { ActionsTypes } from "@/types/general";
import { toast } from "sonner";
import { create } from "zustand";

interface TableCompetencies {
  [key: string | number]: string | number | JSX.Element;
  id: string;
  order: number;
}
type State = {
  competencies: Competency[];
  tags: string[];
  tableCompetencies: TableCompetencies[];
  competencySelected: Competency | null;
  action: ActionsTypes;
  loading: boolean;
  open: boolean;
};

type Actions = {
  getData: () => Promise<void>;
  setCompetencySelected: (competency: Competency | null, action: ActionsTypes) => void;
  crtCompetency: (body: CompetencyBodyRequest) => Promise<void>;
  updCompetency: (id: string, body: CompetencyBodyRequest) => Promise<void>;
  delCompetency: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
};

const mapCompetencysTotableCompetencies = (competencies: Competency[]): TableCompetencies[] => {
  return competencies.map((competency, idx) => ({
    name: competency.name,
    id: competency.id,
    order: idx + 1,
  }));
}

export const CompetencyStore = create<State & Actions>((set) => ({
  competencies: [],
  tags: [],
  tableCompetencies: [],
  competencySelected: null,
  action: 'none',
  loading: false,
  open: false,
  getData: async () => {
    try {
      set({ loading: true });
      const competencies = await getCompetencys();
      set({ competencies });
      const tableCompetencies = mapCompetencysTotableCompetencies(competencies);
      set({ tableCompetencies });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente");
    } finally {
      set({ loading: false });
    }
  },
  setCompetencySelected(competency, action) {
    const id = competency?.id;
    const competencySelected = CompetencyStore.getState().competencies.find((competency) => competency.id === id);
    set({ competencySelected, action, open: !!competency?.id });
  },
  crtCompetency: async (body) => {
    try {
      set({ loading: true });
      const newCompetency = await createCompetency(body);
      set({ competencies: [newCompetency, ...CompetencyStore.getState().competencies] });
      set({ tableCompetencies: mapCompetencysTotableCompetencies(CompetencyStore.getState().competencies) });
      set({ open: false });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  updCompetency: async (id, body) => {
    try {
      set({ loading: true });
      const updatedCompetency = await updateCompetency(id, body);
      const updatedCompetencys = CompetencyStore.getState().competencies.map((competency) =>
        competency.id === updatedCompetency.id ? updatedCompetency : competency
      );
      set({ competencies: updatedCompetencys });
      set({ tableCompetencies: mapCompetencysTotableCompetencies(updatedCompetencys) });
      set({ open: false });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  delCompetency: async (id) => {
    try {
      set({ loading: true });
      await deleteCompetency(id);
      const updatedCompetencys = CompetencyStore.getState().competencies.filter((competency) => competency.id !== id);
      set({ competencies: updatedCompetencys });
      set({ tableCompetencies: mapCompetencysTotableCompetencies(updatedCompetencys) });
      set({ open: false });
      toast.success("Autoridad eliminada correctamente");
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  setLoading: (loading) => set({ loading }),
  setOpen: (open) => set({ open }),
}));
