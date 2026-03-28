import { useState, useEffect, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, Operation } from '../firebase';
import { UserProfile, ChatSession, Message, AppSettings, UserRank } from '../types';

const OWNER_EMAIL = "markcvakgd@gmail.com";

export const useKiro = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings>({ proPrice: 10, premiumPrice: 25 });
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth & Profile
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userRef = doc(db, 'users', u.uid);
        try {
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            const isOwner = u.email === OWNER_EMAIL;
            const newProfile: UserProfile = {
              uid: u.uid,
              displayName: u.displayName || 'User',
              email: u.email || '',
              photoURL: u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`,
              rank: isOwner ? 'owner' : 'normal',
              messageCount: 0,
              createdAt: Timestamp.now(),
              lastActive: Timestamp.now()
            };
            await setDoc(userRef, newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, Operation.WRITE, `users/${u.uid}`);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // Sync Profile
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) setProfile(snap.data() as UserProfile);
    }, (error) => {
      handleFirestoreError(error, Operation.GET, `users/${user.uid}`);
    });
    return unsub;
  }, [user]);

  // Sync Sessions
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'sessions'), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatSession)));
    }, (error) => {
      handleFirestoreError(error, Operation.LIST, `users/${user.uid}/sessions`);
    });
    return unsub;
  }, [user]);

  // Sync Messages
  useEffect(() => {
    if (!user || !currentSessionId) {
      setMessages([]);
      return;
    }
    const q = query(collection(db, 'users', user.uid, 'sessions', currentSessionId, 'messages'), orderBy('timestamp', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
    }, (error) => {
      handleFirestoreError(error, Operation.LIST, `users/${user.uid}/sessions/${currentSessionId}/messages`);
    });
    return unsub;
  }, [user, currentSessionId]);

  // Sync Global Settings
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (snap) => {
      if (snap.exists()) setAppSettings(snap.data() as AppSettings);
    }, (error) => {
      handleFirestoreError(error, Operation.GET, 'settings/global');
    });
    return unsub;
  }, []);

  // Sync All Users (for Owner)
  useEffect(() => {
    if (profile?.rank !== 'owner') return;
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      setAllUsers(snap.docs.map(d => d.data() as UserProfile));
    }, (error) => {
      handleFirestoreError(error, Operation.LIST, 'users');
    });
    return unsub;
  }, [profile]);

  const login = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  const createSession = async (title = "New Chat") => {
    if (!user) return;
    try {
      const res = await addDoc(collection(db, 'users', user.uid, 'sessions'), {
        title,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      setCurrentSessionId(res.id);
      return res.id;
    } catch (error) {
      handleFirestoreError(error, Operation.CREATE, `users/${user.uid}/sessions`);
    }
  };

  const deleteSession = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'sessions', id));
      if (currentSessionId === id) setCurrentSessionId(null);
    } catch (error) {
      handleFirestoreError(error, Operation.DELETE, `users/${user.uid}/sessions/${id}`);
    }
  };

  const sendMessage = async (text: string, role: 'user' | 'assistant', imageUrl?: string) => {
    if (!user || !currentSessionId) return;
    const msg: any = {
      text,
      role,
      timestamp: Timestamp.now()
    };
    if (imageUrl) msg.imageUrl = imageUrl;
    
    try {
      await addDoc(collection(db, 'users', user.uid, 'sessions', currentSessionId, 'messages'), msg);
      await updateDoc(doc(db, 'users', user.uid, 'sessions', currentSessionId), { updatedAt: Timestamp.now() });
      
      if (role === 'user') {
        await updateDoc(doc(db, 'users', user.uid), { 
          messageCount: (profile?.messageCount || 0) + 1,
          lastActive: Timestamp.now()
        });
      }
    } catch (error) {
      handleFirestoreError(error, Operation.WRITE, `users/${user.uid}/sessions/${currentSessionId}`);
    }
  };

  const requestRank = async (rank: UserRank) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { requestedRank: rank });
    } catch (error) {
      handleFirestoreError(error, Operation.UPDATE, `users/${user.uid}`);
    }
  };

  const updateSettings = async (settings: AppSettings) => {
    if (profile?.rank !== 'owner') return;
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
    } catch (error) {
      handleFirestoreError(error, Operation.WRITE, 'settings/global');
    }
  };

  const updateUserRank = async (uid: string, rank: UserRank) => {
    if (profile?.rank !== 'owner') return;
    try {
      await updateDoc(doc(db, 'users', uid), { rank, requestedRank: null });
    } catch (error) {
      handleFirestoreError(error, Operation.UPDATE, `users/${uid}`);
    }
  };

  return {
    user,
    profile,
    sessions,
    currentSessionId,
    setCurrentSessionId,
    messages,
    appSettings,
    allUsers,
    loading,
    login,
    logout,
    createSession,
    deleteSession,
    sendMessage,
    requestRank,
    updateSettings,
    updateUserRank
  };
};
