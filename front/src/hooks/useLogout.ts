import { useRouter } from "next/router";
import { useAuth } from "@/src/context/AuthContext";

export const useLogout = () => {
  const router = useRouter();
  const { setUsuario } = useAuth();

  const logout = () => {
    localStorage.removeItem("token"); // remove o token
    setUsuario(undefined);            // limpa o usuário no contexto
    router.push("/login");            // redireciona para login
  };

  return logout;
};
