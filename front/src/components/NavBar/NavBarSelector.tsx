import { useAuth } from "@/src/context/AuthContext";
import { MotoristaNavbar } from "./MotoristaNavBar";
import { AdminNavbar } from "./AdminNavBar";
import { AlunoNavbar } from "./AlunoNavBar";

export const NavbarSelector = () => {
  const { usuario } = useAuth();

  if (!usuario) return null;

  switch (usuario.perfil) {
    case 1:
      return <AdminNavbar />;
    case 2:
      return <AlunoNavbar />;
    case 3:
      return <MotoristaNavbar />;
    default:
      return null;
  }
};