import { api } from "./api";

export enum Category {
  NEWS = "edu-news",
  BITS = "edu-bits",
  READS = "edu-reads",
  TUBES = "edu-tubes",
  // PODCAST = 'edutrendspodcast',
  PODCAST = "edu-podcast",
}

export const CategoryMap: Record<Category, string> = {
  [Category.NEWS]: "Noticias",
  [Category.BITS]: "Bits",
  [Category.READS]: "Lecturas",
  [Category.TUBES]: "Tubes",
  [Category.PODCAST]: "Podcast",
};
export interface Post {
  id: string;
  title: string;
  slug: string;
  category: Category;
  content: string;
  subCategory: null;
  readingTime: number;
  description: null | string;
  videoUrl: null | string;
  podcastUrl: null | string;
  imageUrl: null | string;
  imageDescription: null | string;
  likes: number;
  userId: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}
export const getPosts = async (): Promise<Post[]> => {
  const { data } = await api.get(`/posts`);
  return data as Post[];
};

export interface PostBodyRequest {
  userId: string;
  title: string;
  category: Category;
  subCategory: string | null;
  description: string | null;
  content: string;
  imageUrl: string | null;
  imageDescription: string | null;
  videoUrl: string | null;
  podcastUrl: string | null;
  attachments: string[] | null;
  tags: string[];
}

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const { data } = await api.get(`/posts/${slug}`);
  return data as Post;
}
export const createPost = async (body: PostBodyRequest): Promise<Post> => {
  const { data } = await api.post(`/posts`, body);
  return data as Post;
};

export interface ResponseUploadFile {
  url: string;
}

export const uploadFile = async (
  file: File
): Promise<ResponseUploadFile> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<ResponseUploadFile>(
    `/storage/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data as ResponseUploadFile;
};

export const updatePost = async (id: string, body: PostBodyRequest): Promise<Post> => {
  const { data } = await api.put(`/posts/${id}`, body);
  return data as Post;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`);
};