export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'Super Admin';
  createdAt: string;
}

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  url: string;
  key: string;
  isValid: boolean;
  createdAt: string;
  lastUsed?: string;
}

export interface ApiRequest {
  id: string;
  userId: string;
  apiKeyId: string;
  method: string;
  endpoint: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'user' | 'admin' | 'Super Admin') => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: 'user' | 'admin' | 'Super Admin') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
