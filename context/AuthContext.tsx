import {useContext, useState, createContext, useEffect} from "react";
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/constants/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
            setLoading(false)
        })
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{user, loading, signOut: () => signOut(auth)}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)!
}

