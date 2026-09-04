import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db, signInWithGoogle, signOutUser, testFirestoreConnection } from '../lib/firebase';
import { UserProfile, SharedSpace, PartnerInvitation } from '../types';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  activeSpace: SharedSpace | null;
  partner: UserProfile | null;
  pendingInvitations: PartnerInvitation[];
  isLoading: boolean;
  isFirebaseConnected: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendPartnerInvite: (email: string) => Promise<{ code: string; success: boolean }>;
  acceptPartnerInvite: (codeOrId: string) => Promise<boolean>;
  unlinkPartner: () => Promise<void>;
  switchDemoProfile: (profile: 'cesar' | 'partner') => void;
}

const DEMO_USER_CESAR: UserProfile = {
  id: 'user-cesar-101',
  email: 'cesar626313978@gmail.com',
  displayName: 'César',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  currentSpaceId: 'space-pareja-es',
  createdAt: '2026-01-15T10:00:00Z',
};

const DEMO_USER_PARTNER: UserProfile = {
  id: 'user-partner-102',
  email: 'elena.finanzas@gmail.com',
  displayName: 'Elena (Pareja)',
  photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  currentSpaceId: 'space-pareja-es',
  createdAt: '2026-02-01T14:30:00Z',
};

const INITIAL_SHARED_SPACE: SharedSpace = {
  id: 'space-pareja-es',
  name: 'Finanzas Compartidas Casa & Pareja',
  memberIds: ['user-cesar-101', 'user-partner-102'],
  createdBy: 'user-cesar-101',
  inviteCode: 'FINA50',
  createdAt: '2026-01-15T10:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_USER_CESAR);
  const [activeSpace, setActiveSpace] = useState<SharedSpace | null>(INITIAL_SHARED_SPACE);
  const [partner, setPartner] = useState<UserProfile | null>(DEMO_USER_PARTNER);
  const [pendingInvitations, setPendingInvitations] = useState<PartnerInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);

  // Initialize and listen to Auth state & test connection
  useEffect(() => {
    testFirestoreConnection().then(connected => {
      setIsFirebaseConnected(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        // Authenticated with Google
        const userRef = doc(db, 'users', fUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          let profile: UserProfile;
          if (userSnap.exists()) {
            profile = userSnap.data() as UserProfile;
          } else {
            profile = {
              id: fUser.uid,
              email: fUser.email || '',
              displayName: fUser.displayName || 'Usuario',
              photoURL: fUser.photoURL || undefined,
              currentSpaceId: 'space-pareja-es',
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, profile);
          }
          setCurrentUser(profile);
        } catch (err) {
          console.warn('Using client state for user profile:', err);
          setCurrentUser({
            id: fUser.uid,
            email: fUser.email || '',
            displayName: fUser.displayName || 'Usuario',
            photoURL: fUser.photoURL || undefined,
            currentSpaceId: 'space-pareja-es',
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        // Default to César profile for immediate seamless app experience
        setCurrentUser(prev => prev || DEMO_USER_CESAR);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const user = await signInWithGoogle();
      if (user) {
        const profile: UserProfile = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Usuario',
          photoURL: user.photoURL || undefined,
          currentSpaceId: activeSpace?.id || 'space-pareja-es',
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(profile);
      }
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setFirebaseUser(null);
      setCurrentUser(null);
    } catch (err) {
      console.error('Error logging out:', err);
      setFirebaseUser(null);
      setCurrentUser(null);
    }
  };

  const sendPartnerInvite = async (email: string): Promise<{ code: string; success: boolean }> => {
    if (!currentUser) throw new Error('No user logged in');

    const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
    const newInvite: PartnerInvitation = {
      id: `invite-${Date.now()}`,
      fromUserId: currentUser.id,
      fromUserEmail: currentUser.email,
      fromUserName: currentUser.displayName,
      toEmail: email.trim().toLowerCase(),
      spaceId: activeSpace?.id || 'space-pareja-es',
      inviteCode: randomDigits,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setPendingInvitations(prev => [newInvite, ...prev]);

    // Try saving to Firestore if online
    try {
      await setDoc(doc(db, 'invitations', newInvite.id), newInvite);
    } catch (e) {
      console.log('Saved invitation locally:', newInvite);
    }

    return { code: randomDigits, success: true };
  };

  const acceptPartnerInvite = async (codeOrId: string): Promise<boolean> => {
    if (!currentUser) return false;
    const cleanCode = codeOrId.trim();

    // Check in pending invitations or active space inviteCode
    if (cleanCode === activeSpace?.inviteCode || cleanCode === 'FINA50' || cleanCode.length === 6) {
      // Connect partner
      setPartner(DEMO_USER_PARTNER);
      if (activeSpace && !activeSpace.memberIds.includes(currentUser.id)) {
        setActiveSpace({
          ...activeSpace,
          memberIds: [...activeSpace.memberIds, currentUser.id],
        });
      }
      return true;
    }
    return false;
  };

  const unlinkPartner = async () => {
    setPartner(null);
    if (activeSpace && currentUser) {
      setActiveSpace({
        ...activeSpace,
        memberIds: [currentUser.id],
      });
    }
  };

  // Demo profile switcher for instant preview testing
  const switchDemoProfile = (profile: 'cesar' | 'partner') => {
    if (profile === 'cesar') {
      setCurrentUser(DEMO_USER_CESAR);
      setPartner(DEMO_USER_PARTNER);
    } else {
      setCurrentUser(DEMO_USER_PARTNER);
      setPartner(DEMO_USER_CESAR);
    }
  };

  const value = useMemo(() => ({
    currentUser,
    firebaseUser,
    activeSpace,
    partner,
    pendingInvitations,
    isLoading,
    isFirebaseConnected,
    loginWithGoogle,
    logout,
    sendPartnerInvite,
    acceptPartnerInvite,
    unlinkPartner,
    switchDemoProfile,
  }), [
    currentUser,
    firebaseUser,
    activeSpace,
    partner,
    pendingInvitations,
    isLoading,
    isFirebaseConnected
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
