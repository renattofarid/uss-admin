import { Post, PostBodyRequest, createPost, deletePost, getPostBySlug, getPosts, updatePost } from "@/services/posts";
import { getTags } from "@/services/tags";
import { User, getUsers } from "@/services/users";
import { ActionsTypes } from "@/types/general";
import { formatDate, transformSecondsToMinutes } from "@/utils/date";
import { create } from "zustand";

interface TablePosts {
  [key: string | number]: string | number | JSX.Element;
  id: string;
  title: string | JSX.Element;
  category: string;
  readingTime: number | string;
  likes: number;
  createdAt: string;
}
type State = {
  posts: Post[];
  tags: string[];
  users: User[];
  tablePosts: TablePosts[];
  postSelected: Post | null;
  action: ActionsTypes;
  loading: boolean;
  open: boolean;
};

type Actions = {
  getData: () => Promise<void>;
  setPostSelected: (id: string | null, action: ActionsTypes) => void;
  getPost: (slug: string) => Promise<Post>;
  crtPost: (body: PostBodyRequest) => Promise<void>;
  updPost: (id: string, body: PostBodyRequest) => Promise<void>;
  delPost: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
};

const mapPostsToTablePosts = (posts: Post[]): TablePosts[] => {
  return posts.map((post) => ({
    title: (
      <div className="flex flex-row gap-2">
        <img
          className="w-12 h-12 rounded-lg object-cover"
          src={
            post.imageUrl ||
            "https://avatars.githubusercontent.com/u/93000567"
          }
          alt={post.title}
        />
        <span className="text-xs font-semibold">{post.title}</span>
      </div>
    ),
    id: post.id,
    category: post.category,
    readingTime: transformSecondsToMinutes(Number(post.readingTime)),
    likes: post.likes,
    createdAt: formatDate(post.createdAt),
  }));
}

export const postStore = create<State & Actions>((set) => ({
  posts: [],
  tags: [],
  users: [],
  tablePosts: [],
  postSelected: null,
  action: 'none',
  loading: false,
  open: false,
  getData: async () => {
    try {
      set({ loading: true });
      const [posts, tags] = await Promise.all([getPosts(), getTags()]);
      const users = await getUsers();
      set({ posts, tags, users });
      const tablePosts = mapPostsToTablePosts(posts);
      set({ tablePosts });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente");
    } finally {
      set({ loading: false });
    }
  },
  getPost: async (slug) => {
    try {
      set({ loading: true });
      const post = await getPostBySlug(slug);
      return post;
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente");
      return {} as Post;
    } finally {
      set({ loading: false });
    }
  },
  setPostSelected(id, action) {
    const postSelected = postStore.getState().posts.find((post) => post.id === id);
    set({ postSelected, action, open: !!id ?? false });
  },
  crtPost: async (body) => {
    try {
      set({ loading: true });
      const newPost = await createPost(body);
      set({ posts: [newPost, ...postStore.getState().posts] });
      set({ tablePosts: mapPostsToTablePosts(postStore.getState().posts) });
      set({ open: false });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  updPost: async (id, body) => {
    try {
      set({ loading: true });
      const updatedPost = await updatePost(id, body);
      const updatedPosts = postStore.getState().posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      );
      set({ posts: updatedPosts });
      set({ tablePosts: mapPostsToTablePosts(updatedPosts) });
      set({ open: false });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  delPost: async (id) => {
    try {
      set({ loading: true });
      await deletePost(id);
      const updatedPosts = postStore.getState().posts.filter(
        (post) => post.id !== id
      );
      set({ posts: updatedPosts });
      set({ tablePosts: mapPostsToTablePosts(updatedPosts) });
      set({ open: false });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  setLoading: (loading) => set({ loading }),
  setOpen: (open) => set({ open }),
}));
