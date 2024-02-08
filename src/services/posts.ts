import { api, apiCloudinary } from "./api";
import { Tag } from "./tags";

export enum Category {
    NEWS = 'edu-news',
    BITS = 'edu-bits',
    READS = 'edu-reads',
    TUBES = 'edu-tubes',
    // PODCAST = 'edutrendspodcast',
    PODCAST = 'edu-podcast',
}
export interface Post {
    id:               number;
    title:            string;
    slug:             string;
    category:         Category;
    subCategory:      null;
    readingTime:      number;
    description:      null | string;
    videoUrl:         null | string;
    podcastUrl:       null | string;
    imageUrl:         null | string;
    imageDescription: null | string;
    likes:            number;
    userId:           number;
    attachments:      string[];
    createdAt:        string;
    updatedAt:        string;
}
export const getPosts = async (): Promise<Post[]> => {
  const { data } = await api.get(`/posts`);
  return data as Post[];
};

export interface PostBodyRequest {
    userId: number,
    title: string,
    category: Category,
    subCategory: string | null,
    description: string | null,
    content: string,
    imageUrl: string | null,
    imageDescription: string | null,
    videoUrl: string | null,
    podcastUrl: string | null
    attachments: string[] | null,
    tags: Tag[],
}
export const createPost = async (body: PostBodyRequest): Promise<Post> => {
  const { data } = await api.post(`/posts`, body);
  return data as Post;
};

export interface ResponseImageCloudinary {
    asset_id:           string;
    public_id:          string;
    version:            number;
    version_id:         string;
    signature:          string;
    width:              number;
    height:             number;
    format:             string;
    resource_type:      string;
    created_at:         string;
    tags:               any[];
    bytes:              number;
    type:               string;
    etag:               string;
    placeholder:        boolean;
    url:                string;
    secure_url:         string;
    folder:             string;
    access_mode:        string;
    original_filename:  string;
    original_extension: string;
}

export const uploadImage = async (file: File): Promise<ResponseImageCloudinary> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'crba6bkk');
    const { data } = await apiCloudinary.post<ResponseImageCloudinary>(`/image/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return data as ResponseImageCloudinary;
}