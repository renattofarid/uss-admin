import { api } from '../api';
import { User } from '../users';
import { LoginResponse } from './auth.interface';

export interface LoginBody {
    email: string;
    password: string;
}
export async function login(body: LoginBody): Promise<LoginResponse> {
    const { data } = await api.post(`/auth/login`, body);
    return data as LoginResponse;
}

export async function getAuthenticatedUser(token: string): Promise<User> {
    const { data } = await api.get(`/auth/authenticate`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return data as User;
}
