import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

interface UsuarioToken {
  sub: number;
  email: string;
  perfil: number;
}

interface AuthContextType {
  usuario?: UsuarioToken;
  setUsuario: (usuario?: UsuarioToken) => void; // <- novo
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  loading: true,
  setUsuario: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<UsuarioToken>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: UsuarioToken = jwtDecode(token);
        setUsuario(decoded);
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
