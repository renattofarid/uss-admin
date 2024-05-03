import { Authority, AuthorityBodyRequest, createAuthority, updateAuthority, getAuthorities, deleteAuthority } from "@/services/authorities";
import { ActionsTypes } from "@/types/general";
import { toast } from "sonner";
import { create } from "zustand";

interface TableAuthoritys {
  [key: string | number]: string | number | JSX.Element;
  id: string;
  name: string | JSX.Element;
  hierachy: number;
  position: string;
}
type State = {
  authorities: Authority[];
  tags: string[];
  tableAuthorities: TableAuthoritys[];
  authoritySelected: Authority | null;
  action: ActionsTypes;
  loading: boolean;
  open: boolean;
};

type Actions = {
  getData: () => Promise<void>;
  setAuthoritySelected: (Authority: Authority | null, action: ActionsTypes) => void;
  crtAuthority: (body: AuthorityBodyRequest) => Promise<void>;
  updAuthority: (id: string, body: AuthorityBodyRequest) => Promise<void>;
  delAuthority: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
};

const mapAuthoritysToTableAuthorities = (authorities: Authority[]): TableAuthoritys[] => {
  return authorities.map((authority) => ({
    name: (
      <div className="flex flex-row gap-2">
        <img
          className="w-12 h-12 rounded-lg object-cover"
          src={
            authority.imageUrl ||
            "https://avatars.githubAuthoritycontent.com/u/93000567"
          }
          alt={authority.name}
        />
        <span className="text-xs font-semibold">{authority.name}</span>
      </div>
    ),
    id: authority.id,
    hierachy: authority.hierachy,
    position: authority.position,
  }));
}

export const AuthorityStore = create<State & Actions>((set) => ({
  authorities: [],
  tags: [],
  tableAuthorities: [],
  authoritySelected: null,
  action: 'none',
  loading: false,
  open: false,
  getData: async () => {
    try {
      set({ loading: true });
      const authorities = await getAuthorities();
      set({ authorities });
      const tableAuthorities = mapAuthoritysToTableAuthorities(authorities);
      set({ tableAuthorities });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente");
    } finally {
      set({ loading: false });
    }
  },
  setAuthoritySelected(Authority, action) {
    const id = Authority?.id;
    const authoritySelected = AuthorityStore.getState().authorities.find((Authority) => Authority.id === id);
    set({ authoritySelected, action, open: !!Authority?.id ?? false });
  },
  crtAuthority: async (body) => {
    try {
      set({ loading: true });
      const newAuthority = await createAuthority(body);
      set({ authorities: [newAuthority, ...AuthorityStore.getState().authorities] });
      set({ tableAuthorities: mapAuthoritysToTableAuthorities(AuthorityStore.getState().authorities) });
      set({ open: false });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  updAuthority: async (id, body) => {
    try {
      set({ loading: true });
      const updatedAuthority = await updateAuthority(id, body);
      const updatedAuthoritys = AuthorityStore.getState().authorities.map((Authority) =>
        Authority.id === updatedAuthority.id ? updatedAuthority : Authority
      );
      set({ authorities: updatedAuthoritys });
      set({ tableAuthorities: mapAuthoritysToTableAuthorities(updatedAuthoritys) });
      set({ open: false });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  delAuthority: async (id) => {
    try {
      set({ loading: true });
      await deleteAuthority(id);
      const updatedAuthoritys = AuthorityStore.getState().authorities.filter((Authority) => Authority.id !== id);
      set({ authorities: updatedAuthoritys });
      set({ tableAuthorities: mapAuthoritysToTableAuthorities(updatedAuthoritys) });
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
