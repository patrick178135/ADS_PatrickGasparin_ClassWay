import { useLogout } from "@/src/hooks/useLogout";

export const AlunoNavbar = () => {
  const logout = useLogout();

  return (
    <nav>
      <h3>Área Aluno</h3>
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
