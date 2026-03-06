import AsyncStorage from "@react-native-async-storage/async-storage";
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
  login: (username: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<undefined | AuthContextType>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app start
  useEffect(() => {
    AsyncStorage.getItem("authUser").then((value) => {
      if (value) setUser(JSON.parse(value));
      setIsLoading(false);
    });
  }, []);

  const login = async (
    username: string,
    _password: string,
    role: UserRole
  ) => {
    setIsLoading(true);
    // TODO: Replace mock with real Convex query in login feature branch
    await new Promise((r) => setTimeout(r, 900));

    const loggedInUser: AuthUser =
      role === "student"
        ? {
            _id: "stu_001",
            name: "Alex Tendean",
            username,
            role: "student",
            nim: "22416001",
            program: "S1 Informatika",
            semester: 5,
          }
        : {
            _id: "lec_001",
            name: "Dr. Ricky Muntu",
            username,
            role: "lecturer",
            nidn: "0001234567",
            department: "Informatika",
            title: "Dosen Tetap",
          };

    setUser(loggedInUser);
    await AsyncStorage.setItem("authUser", JSON.stringify(loggedInUser));
    setIsLoading(false);
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
