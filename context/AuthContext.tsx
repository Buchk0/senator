import { useContext, useState, createContext, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/constants/firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface UserProfile {
  name: string;
  surname: string;
  birthDate: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profile: UserProfile | null;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Fetch profile immediately in the background — no await, no blocking
        getDoc(doc(db, 'users', firebaseUser.uid)).then((snap) => {
          if (snap.exists()) setProfile(snap.data() as UserProfile);
        });
      } else {
        setProfile(null);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, profile, signOut: () => signOut(auth) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext)!;
}
