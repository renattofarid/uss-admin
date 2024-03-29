import { getHomePosts, HomePosts } from "@/services/home";
import { HomeSectionType } from "@/services/posts";
import { ActionsTypes } from "@/types/general";
import { create } from "zustand";

type State = {
    homePosts: HomePosts | null;
    idHomePostSelected: string | null;
    typePostSelected: HomeSectionType | null;
    open: boolean;
    loading: boolean;
    action: ActionsTypes;
}

type Actions = {
    getHomePosts: () => Promise<void>;
    setLoading: (loading: boolean) => void;
    setAction: (action: ActionsTypes) => void;
    setOpen: (open: boolean) => void;
    setIdHomePostSelected: (id: string | null) => void;
    setTypePostSelected: (type: HomeSectionType | null) => void;
}

export const homeStore = create<State & Actions>((set) => ({
    homePosts: null,
    open: false,
    loading: false,
    action: 'view',
    idHomePostSelected: null,
    typePostSelected: null,
    getHomePosts: async () => {
        set({ loading: true });
        try {
            const homePosts = await getHomePosts();
            set({ homePosts });
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },
    setTypePostSelected: (typePostSelected) => set({ typePostSelected }),
    setIdHomePostSelected: (id) => set({ idHomePostSelected: id }),
    setOpen: (open) => set({ open }),
    setLoading: (loading) => set({ loading }),
    setAction: (action) => set({ action })
}))