import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
  } from "react";
  import {
    login as apiLogin,
    me as apiMe,
  } from "@/src/modules/auth/service/auth.service";
  
  type Usuario = {
    ID_usuario: number;
    nome: string;
    email: string;
    perfil: number;
  } | null;
  
  type AuthContextType = {
    usuario: Usuario;
    token: string | null;
    loading: boolean;
    signIn: (email: string, senha: string) => Promise<void>;
    signOut: () => void;
  };
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  type AuthProviderProps = {
    children: ReactNode;
  };
  
  export function AuthProvider({ children }: AuthProviderProps) {
    const [usuario, setUsuario] = useState<Usuario>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadUser = async () => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
          setToken(savedToken);
          try {
            const dadosUsuario = await apiMe();
            setUsuario(dadosUsuario);
          } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            localStorage.removeItem("token");
            setToken(null);
          }
        }
        setLoading(false);
      };
      loadUser();
    }, []);
  
    const signIn = async (email: string, senha: string) => {
      try {
        const data = await apiLogin(email, senha);
        const accessToken = data.accessToken || data.token;
  
        if (!accessToken) throw new Error("Token não recebido da API");
  
        localStorage.setItem("token", accessToken);
        setToken(accessToken);
  
        const userData = await apiMe();
        setUsuario(userData);
      } catch (error) {
        console.error("Erro no login:", error);
        throw error;
      }
    };
  
    const signOut = () => {
      localStorage.removeItem("token");
      setToken(null);
      setUsuario(null);
    };
  
    return (
      <AuthContext.Provider
        value={{ usuario, token, loading, signIn, signOut }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  // Hook para usar o contexto
  export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
      throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
    return ctx;
  }
  