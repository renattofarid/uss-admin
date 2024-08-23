import { User, UserBodyRequest, createUser, updateUser, getUsers, deleteUser, getCountries, Country } from "@/services/users";
import { ActionsTypes } from "@/types/general";
import { toast } from "sonner";
import { create } from "zustand";
import { MapRoleUser } from '../../../services/users';

interface TableUsers {
  [key: string | number]: string | number | JSX.Element;
  id: string;
  name: string | JSX.Element;
  country: string | JSX.Element;
  email: string;
  role: string;
}
type State = {
  users: User[];
  countries: Country[];
  tags: string[];
  tableUsers: TableUsers[];
  userSelected: User | null;
  action: ActionsTypes;
  loading: boolean;
  open: boolean;
};

type Actions = {
  getData: () => Promise<void>;
  setUserSelected: (user: User | null, action: ActionsTypes) => void;
  crtUser: (body: UserBodyRequest) => Promise<void>;
  updUser: (id: string, body: UserBodyRequest) => Promise<void>;
  delUser: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
};

const mapUsersToTableUsers = (users: User[]): TableUsers[] => {
  return users.map((user) => ({
    name: (
      <div className="flex flex-row gap-2">
        <img
          className="w-12 h-12 rounded-lg object-cover"
          src={
            user.image ||
            "https://avatars.githubusercontent.com/u/93000567"
          }
          alt={user.name}
        />
        <span className="text-xs font-semibold">{user.name}</span>
      </div>
    ),
    country: (
      <div className="flex flex-row gap-2 items-center">
        <img
          className="w-8 h-8 rounded-lg object-cover"
          src={user.country?.icon}
          alt={user.country?.name}
        />
        <span className="text-xs font-semibold">{user.country?.name}</span>
      </div>
    ),
    email: user.email,
    role: MapRoleUser[user.role],
    id: user.id,
  }));
}

export const UserStore = create<State & Actions>((set) => ({
  tags: [],
  users: [],
  countries: [],
  tableUsers: [],
  userSelected: null,
  action: 'none',
  loading: false,
  open: false,
  getData: async () => {
    try {
      set({ loading: true });
      const countries = await getCountries();
      const users = await getUsers();
      set({ users, countries });
      const tableUsers = mapUsersToTableUsers(users);
      set({ tableUsers });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente");
    } finally {
      set({ loading: false });
    }
  },
  setUserSelected(user, action) {
    const userSelected = UserStore.getState().users.find((User) => User.id === user?.id);
    set({ userSelected, action, open: !!user?.id});
  },
  crtUser: async (body) => {
    try {
      set({ loading: true });
      const newUser = await createUser(body);
      set({ users: [newUser, ...UserStore.getState().users] });
      set({ tableUsers: mapUsersToTableUsers(UserStore.getState().users) });
      set({ open: false });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  updUser: async (id, body) => {
    try {
      set({ loading: true });
      const updatedUser = await updateUser(id, body);
      const updatedUsers = UserStore.getState().users.map((User) =>
        User.id === updatedUser.id ? updatedUser : User
      );
      set({ users: updatedUsers });
      set({ tableUsers: mapUsersToTableUsers(updatedUsers) });
      set({ open: false });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  delUser: async (id) => {
    try {
      set({ loading: true });
      await deleteUser(id);
      const updatedUsers = UserStore.getState().users.filter((User) => User.id !== id);
      set({ users: updatedUsers });
      set({ tableUsers: mapUsersToTableUsers(updatedUsers) });
      set({ open: false });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
      toast.error("Ocurrió un error inesperado, intente nuevamente");
    } finally {
      set({ loading: false });
    }
  },
  setLoading: (loading) => set({ loading }),
  setOpen: (open) => set({ open }),
}));
