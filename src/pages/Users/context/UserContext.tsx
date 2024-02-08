import React, { useState } from 'react';
import { User } from '@/services/users';

interface TableUsers {
    [key: string]: string | number | JSX.Element;
    name: string;
    email: string;
    role: string;
    image: JSX.Element;
}
interface UserContextType {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    draftUsers: User[];
    setDraftUsers: React.Dispatch<React.SetStateAction<User[]>>;
    tableUsers: TableUsers[];
    setTableUsers: React.Dispatch<React.SetStateAction<TableUsers[]>>;
    userSelected: User | null;
    setUserSelected: React.Dispatch<React.SetStateAction<User | null>>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = React.createContext<UserContextType>({
    users: [],
    setUsers: () => null,
    draftUsers: [],
    setDraftUsers: () => null,
    tableUsers: [],
    setTableUsers: () => null,
    userSelected: null,
    setUserSelected: () => null,
    open: false,
    setOpen: () => null,
    loading: false,
    setLoading: () => null,
});

interface Props {
    children: React.ReactNode;
}
export const UserProvider = ({ children }: Props) => {
    const [users, setUsers] = useState<User[]>([]);
    const [draftUsers, setDraftUsers] = useState<User[]>([]);
    const [tableUsers, setTableUsers] = useState<TableUsers[]>([]);
    const [userSelected, setUserSelected] = useState<User | null>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const contextValue: UserContextType = {
        users,
        setUsers,
        draftUsers,
        setDraftUsers,
        tableUsers,
        setTableUsers,
        userSelected,
        setUserSelected,
        open,
        setOpen,
        loading,
        setLoading,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};
