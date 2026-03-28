export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  imageUrl?: string;
  timestamp: any;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: any;
  updatedAt: any;
}

export type UserRank = 'normal' | 'pro' | 'premium' | 'owner';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  rank: UserRank;
  messageCount: number;
  createdAt: any;
  lastActive: any;
  requestedRank?: UserRank | null;
}

export interface AppSettings {
  proPrice: number;
  premiumPrice: number;
}
