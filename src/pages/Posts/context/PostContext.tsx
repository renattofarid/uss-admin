import React, { useState } from 'react';
import { Post } from '@/services/posts';

interface TablePosts {
    [key: string | number]: string | number | JSX.Element;
    title: string | JSX.Element;
    category: string;
    readingTime: number | string;
    likes: number;
    createdAt: string;
}
interface PostContextType {
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    draftPosts: Post[];
    setDraftPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    tablePosts: TablePosts[];
    setTablePosts: React.Dispatch<React.SetStateAction<TablePosts[]>>;
    postSelected: Post | null;
    setPostSelected: React.Dispatch<React.SetStateAction<Post | null>>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PostContext = React.createContext<PostContextType>({
    posts: [],
    setPosts: () => null,
    draftPosts: [],
    setDraftPosts: () => null,
    tablePosts: [],
    setTablePosts: () => null,
    postSelected: null,
    setPostSelected: () => null,
    open: false,
    setOpen: () => null,
    loading: false,
    setLoading: () => null,
});

interface Props {
    children: React.ReactNode;
}
export const PostProvider = ({ children }: Props) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [draftPosts, setDraftPosts] = useState<Post[]>([]);
    const [tablePosts, setTablePosts] = useState<TablePosts[]>([]);
    const [postSelected, setPostSelected] = useState<Post | null>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const contextValue: PostContextType = {
        posts,
        setPosts,
        draftPosts,
        setDraftPosts,
        tablePosts,
        setTablePosts,
        postSelected,
        setPostSelected,
        open,
        setOpen,
        loading,
        setLoading,
    };

    return (
        <PostContext.Provider value={contextValue}>
            {children}
        </PostContext.Provider>
    );
};
