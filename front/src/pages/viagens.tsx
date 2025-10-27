import { useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";

const Viagem = () => {
  const { usuario, loading, carregarUsuario } = useAuth();

  useEffect(() => {
    carregarUsuario(); 
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (!usuario) return <p>Usuário não logado</p>;

  return (
    <div>
      <h1>Viagem</h1>
    </div>
  );
};

export default Viagem;
