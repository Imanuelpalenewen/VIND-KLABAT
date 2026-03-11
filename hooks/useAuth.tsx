import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type UserRole = "student" | "lecturer";

export interface AuthUser {
  _id: string;
  name: string;
  username: string;
  email?: string;
  role: UserRole;
  // Student fields
  nim?: string;
  program?: string;
  semester?: number;
  // Lecturer fields
  nidn?: string;
  department?: string;
  title?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<undefined | AuthContextType>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loginMutation = useMutation(api.users.login);

  // Restore session on app start
  useEffect(() => {
    AsyncStorage.getItem("authUser").then((value) => {
      if (value) setUser(JSON.parse(value));
      setIsLoading(false);
    });
  }, []);

  const login = async (
    email: string,
    password: string,
    role: UserRole
  ) => {
    setIsLoading(true);
    try {
      const result = await loginMutation({ email, password, role });
      const loggedInUser: AuthUser = {
        _id: result._id,
        name: result.name,
        username: result.username,
        email: result.email ?? undefined,
        role: result.role,
        nim: result.nim,
        program: result.program,
        semester: result.semester,
        nidn: result.nidn,
        department: result.department,
        title: result.title,
      };
      setUser(loggedInUser);
      await AsyncStorage.setItem("authUser", JSON.stringify(loggedInUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context == undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


export default useAuth;
