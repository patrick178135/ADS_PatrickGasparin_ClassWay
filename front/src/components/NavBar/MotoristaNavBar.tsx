import { useLogout } from "@/src/hooks/useLogout";

export const MotoristaNavbar = () => {
  const logout = useLogout();

  return (
    <nav>
      <h3>Área Motorista</h3>
      <ul>
        <li>Gerenciar Usuários</li>
        <li>Relatórios</li>
        <li>
          <button onClick={logout}>Sair</button>
        </li>
      </ul>
    </nav>
  );
};
