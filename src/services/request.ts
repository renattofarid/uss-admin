import { api } from "./api";
import { Category } from "./posts";
import { User } from "./users";

export interface RequestPost {
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
  id: string;
  user: User;
  createdAt: Date;
  approvalStatus: ApprovalStatus;
}
export const getRequestPosts = async (): Promise<RequestPost[]> => {
  const { data } = await api.get(`/posts/find/requests`);
  return data as RequestPost[];
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
// {
// "approvalStatus": "rejected"//pending - approved - rejected
// }
export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}
export const MapApprovalStatus: { [key in ApprovalStatus]: string } = {
  [ApprovalStatus.PENDING]: "Pendiente",
  [ApprovalStatus.APPROVED]: "Aprobado",
  [ApprovalStatus.REJECTED]: "Rechazado",
};
export interface UpdateRequestStatus {
  approvalStatus: ApprovalStatus;
}
export const updateRequestStatus = async (
  id: string,
  body: UpdateRequestStatus
): Promise<RequestPost> => {
  const { data } = await api.post(`/posts/update-request/${id}`, body);
  return data;
};
