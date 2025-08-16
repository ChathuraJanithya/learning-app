import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { LoggedInUser, LoginResponse } from "@/types";

interface AuthContextProps {
  isLoggedIn: boolean;
  user: LoggedInUser | null;
  logOut: () => Promise<void>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<LoggedInUser | null>>;
  handleLoginState: (response: LoginResponse) => Promise<LoggedInUser>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<LoggedInUser | null>(null);

  useEffect(() => {
    // Load login state and user details from storage
    const loadAuthState = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);

        // Navigate to Dashboard if credentials exist
        router.replace("/dashboard");
      } else {
        // Navigate to Login if no credentials exist
        setIsLoggedIn(false);
        router.replace("/sign-in");
      }
    };

    loadAuthState();
  }, []);

  // Save login state and user details to storage
  const handleLoginState = async (
    response: LoginResponse
  ): Promise<LoggedInUser> => {
    setIsLoggedIn(response.status === 201);
    const tempUser: LoggedInUser = {
      email: response.data.user.email,
      name: response.data.user.name,
      role: response.data.user.role,
      token: response.data.token,
    };
    setUser(tempUser);
    await AsyncStorage.setItem("user", JSON.stringify(tempUser));
    return tempUser;
  };

  const logOut = async () => {
    setIsLoggedIn(false);
    setUser(null);
    await AsyncStorage.removeItem("user");
    router.replace("/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        setUser,
        setIsLoggedIn,
        handleLoginState,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
