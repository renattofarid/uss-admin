import React, { useState } from 'react';
import { Tag } from '@/services/tags';

interface TableTags {
    [key: string | number]: string | number;
    id: number;
    name: string;
}
interface TagContextType {
    tags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
    draftTags: Tag[];
    setDraftTags: React.Dispatch<React.SetStateAction<Tag[]>>;
    tableTags: TableTags[];
    setTableTags: React.Dispatch<React.SetStateAction<TableTags[]>>;
    tagSelected: Tag | null;
    setTagSelected: React.Dispatch<React.SetStateAction<Tag | null>>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TagContext = React.createContext<TagContextType>({
    tags: [],
    setTags: () => null,
    draftTags: [],
    setDraftTags: () => null,
    tableTags: [],
    setTableTags: () => null,
    tagSelected: null,
    setTagSelected: () => null,
    open: false,
    setOpen: () => null,
    loading: false,
    setLoading: () => null,
});

interface Props {
    children: React.ReactNode;
}
export const TagProvider = ({ children }: Props) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [draftTags, setDraftTags] = useState<Tag[]>([]);
    const [tableTags, setTableTags] = useState<TableTags[]>([]);
    const [tagSelected, setTagSelected] = useState<Tag | null>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const contextValue: TagContextType = {
        tags,
        setTags,
        draftTags,
        setDraftTags,
        tableTags,
        setTableTags,
        tagSelected,
        setTagSelected,
        open,
        setOpen,
        loading,
        setLoading,
    };

    return (
        <TagContext.Provider value={contextValue}>
            {children}
        </TagContext.Provider>
    );
};
