export interface UserProfile {
  username: string;
  name: string;
  email: string;
  roles: string[];
}

export interface AuthContextValue {
  authenticated: boolean;
  profile: UserProfile | null;
  sessionExpired: boolean;
  login: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}
