import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

interface UsuarioToken {
  sub: number;
  nome: string;
  email: string;
  perfil: number;
}

interface AuthContextType {
  usuario?: UsuarioToken;
  setUsuario: (usuario?: UsuarioToken) => void;
  loading: boolean;
  carregarUsuario: () => void;
}

const AuthContext = createContext<AuthContextType>({
  loading: true,
  setUsuario: () => {},
  carregarUsuario: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<UsuarioToken>();
  const [loading, setLoading] = useState(true); // Começa como true

  // Função para carregar o usuário, agora também controla o estado de loading
  const carregarUsuario = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: UsuarioToken = jwtDecode(token);
        setUsuario(decoded);
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        setUsuario(undefined); // Limpa o usuário em caso de token inválido
      }
    } else {
      setUsuario(undefined); // Garante que não há usuário se não houver token
    }
    // Defina o loading como false APENAS DEPOIS de tentar carregar o usuário
    setLoading(false);
  };

  // O useEffect agora só precisa chamar a função
  useEffect(() => {
    carregarUsuario();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, loading, carregarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
