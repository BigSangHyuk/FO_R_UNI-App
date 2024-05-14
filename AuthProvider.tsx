import React, { ReactNode, createContext, useContext, useState } from 'react';

interface UserEntity {
    id: number;
    email: string;
    department: string;
    nickName: string;
    image: string;
}

type UserType = {
    userData: UserEntity | null;
    setUserData: (userData: UserEntity | null) => void;
};
const AuthContext = createContext<UserType | null>(null);

export const useUserContext = () => {
    const context = useContext(AuthContext);
    if (context === null) throw new Error('useUserContext must be used within a UserProvider');
    return context;
};
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserEntity | null>(null);

    return <AuthContext.Provider value={{ userData, setUserData }}>{children}</AuthContext.Provider>;
};
