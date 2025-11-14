import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import Parse from "../services/parseClient";

const AuthContext = createContext({
  user: null,
  isHydrating: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const current = (await Parse.User.currentAsync?.()) ?? Parse.User.current();
        if (current) {
          setUser(current);
        }
      } catch (error) {
        console.warn("Failed to hydrate auth state:", error);
      } finally {
        setIsHydrating(false);
      }
    };

    bootstrap();
  }, []);

  const signIn = async (username, password) => {
    try {
      const loggedUser = await Parse.User.logIn(username, password);
      setUser(loggedUser);
      return loggedUser;
    } catch (error) {
      Alert.alert("Erro de login", error.message);
      throw error;
    }
  };

  const signUp = async (username, password) => {
    try {
      const newUser = new Parse.User();
      newUser.set("username", username);
      newUser.set("password", password);
      await newUser.signUp();
      return newUser;
    } catch (error) {
      Alert.alert("Erro ao cadastrar", error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await Parse.User.logOut();
      setUser(null);
    } catch (error) {
      Alert.alert("Erro ao sair", error.message);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const current = (await Parse.User.currentAsync?.()) ?? Parse.User.current();
      setUser(current);
      return current;
    } catch (error) {
      console.warn("Failed to refresh user", error);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      user,
      isHydrating,
      signIn,
      signUp,
      signOut,
      refreshUser,
    }),
    [user, isHydrating]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

