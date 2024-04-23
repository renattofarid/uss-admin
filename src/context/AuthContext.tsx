/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, createContext } from 'react';
import { login as loginService } from '../services/Auth/auth.service';
import { getAuthenticatedUser } from '../services/Auth';
import { User } from '@/services/users';

interface LoginParams {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (params: LoginParams) => Promise<User | null>;
  logout: () => void;
  authenticate: () => Promise<void>;
  isLoading: boolean;
  isAuthenticating: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as any);

interface Props {
    children: React.ReactNode;
}
export const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthenticating, setIsAuthenticating] = useState(true)

    const login = async ({email, password}: LoginParams) => {
      try {
        setIsLoading(true)
        const {user, token} = await loginService({email, password})
        window.localStorage.setItem('token', token)
        setUser(user)
        return user
      } catch (error) {
        logout()
        return null
      } finally {
        setIsLoading(false)
      }
    }

    const logout = () => {
      setUser(null)
      window.localStorage.removeItem('token')
    }

    const authenticate = async () => {
      setIsLoading(true)
      setIsAuthenticating(true)
      const token = window.localStorage.getItem('token')
      if (!token) {
        logout()
        setIsAuthenticating(false)
        return setIsLoading(false)
      }
      try {
        const user = await getAuthenticatedUser(token)
        setUser(user)
      } catch (error) {
        logout()
      } finally {
        setIsLoading(false)
        setIsAuthenticating(false)
      }
    }

    const contextValue: AuthContextType = {
        user,
        authenticate,
        login,
        logout,
        isLoading,
        isAuthenticating
    };

    return (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    );
};
