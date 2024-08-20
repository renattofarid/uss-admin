import { Semester, SemesterBodyRequest, createSemester, updateSemester, getSemesters, deleteSemester } from "@/services/semesters";
import { ActionsTypes } from "@/types/general";
import { toast } from "sonner";
import { create } from "zustand";

interface TableSemesters {
  [key: string | number]: string | number | JSX.Element;
  id: string;
  order: number;
}
type State = {
  semesters: Semester[];
  tags: string[];
  tableSemesters: TableSemesters[];
  semesterSelected: Semester | null;
  action: ActionsTypes;
  loading: boolean;
  open: boolean;
};

type Actions = {
  getData: () => Promise<void>;
  setSemesterSelected: (semester: Semester | null, action: ActionsTypes) => void;
  createSemester: (body: SemesterBodyRequest) => Promise<void>;
  updateSemester: (id: string, body: SemesterBodyRequest) => Promise<void>;
  deleteSemester: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
};

const mapSemestersToTableSemesters = (semesters: Semester[]): TableSemesters[] => {
  return semesters.map((School, idx) => ({
    name: School.name,
    id: School.id,
    order: idx + 1,
  }));
}

export const SemesterStore = create<State & Actions>((set) => ({
  semesters: [],
  tags: [],
  tableSemesters: [],
  semesterSelected: null,
  action: 'none',
  loading: false,
  open: false,
  getData: async () => {
    try {
      set({ loading: true });
      const semesters = await getSemesters();
      set({ semesters });
      const tableSemesters = mapSemestersToTableSemesters(semesters);
      set({ tableSemesters });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente");
    } finally {
      set({ loading: false });
    }
  },
  setSemesterSelected(School, action) {
    const id = School?.id;
    const semesterSelected = SemesterStore.getState().semesters.find((School) => School.id === id);
    set({ semesterSelected, action, open: !!id });
  },
  createSemester: async (body) => {
    try {
      set({ loading: true });
      const newSemester = await createSemester(body);
      set({ semesters: [newSemester, ...SemesterStore.getState().semesters] });
      set({ tableSemesters: mapSemestersToTableSemesters(SemesterStore.getState().semesters) });
      set({ open: false });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  updateSemester: async (id, body) => {
    try {
      set({ loading: true });
      const updtSemester = await updateSemester(id, body);
      const updtSemesters = SemesterStore.getState().semesters.map((School) =>
        School.id === updtSemester.id ? updtSemester : School
      );
      set({ semesters: updtSemesters });
      set({ tableSemesters: mapSemestersToTableSemesters(updtSemesters) });
      set({ open: false });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  deleteSemester: async (id) => {
    try {
      set({ loading: true });
      await deleteSemester(id);
      const updtSemesters = SemesterStore.getState().semesters.filter((School) => School.id !== id);
      set({ semesters: updtSemesters });
      set({ tableSemesters: mapSemestersToTableSemesters(updtSemesters) });
      set({ open: false });
      toast.success("Semestre eliminado correctamente");
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  setLoading: (loading) => set({ loading }),
  setOpen: (open) => set({ open }),
}));
