import { api } from "./api";

export enum Role {
  ADMIN = "admin",
  AUTHOR = "author",
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  image: string;
  isActive: boolean;
}
export const getUsers = async (role?: string): Promise<User[]> => {
  const { data } = await api.get(`/users${role ? "?role=" + role : ""}`);
  return data as User[];
};

export interface UserBodyRequest {
  name: string;
  email: string;
  password: string;
  image: string;
  role: string;
}
export const createUser = async (body: UserBodyRequest): Promise<User> => {
  const { data } = await api.post(`/users`, body);
  return data as User;
};

export const updateUser = async (id: string, body: UserBodyRequest): Promise<User> => {
  const { data } = await api.put(`/users/${id}`, body);
  return data as User;
}

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
}