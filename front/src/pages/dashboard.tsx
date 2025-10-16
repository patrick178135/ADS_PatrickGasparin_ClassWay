import { useAuth } from "@/src/context/AuthContext";

const Dashboard = () => {
  const { usuario, loading } = useAuth();

  if (loading) return <p>Carregando...</p>; // evita renderizar antes de carregar o token
  if (!usuario) return <p>Usuário não logado</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {usuario.email}!</p>
      <p>Perfil: {usuario.perfil}</p>
    </div>
  );
};

export default Dashboard;