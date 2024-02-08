import { api } from "./api";

export interface User {
    id:       number;
    name:     string;
    email:    string;
    role:     string;
    image:    null | string;
    isActive: boolean;
}
export const getUsers = async (role?: string): Promise<User[]> => {
  const { data } = await api.get(`/users${role ? '?role='+role : ''}`);
  return data as User[];
};

export interface UserBodyRequest {
    name:     string;
    email:    string;
    password: string;
    image:    string;
    role:     string;
}
export const createUser = async (body: UserBodyRequest): Promise<User> => {
  const { data } = await api.post(`/users`, body);
  return data as User;
};