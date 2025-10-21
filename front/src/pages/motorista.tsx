import { useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";

const Motorista = () => {
  const { usuario, loading, carregarUsuario } = useAuth();

  useEffect(() => {
    carregarUsuario(); 
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (!usuario) return <p>Usuário não logado</p>;

  return (
    <div>
      <h1>Motorista</h1>
    </div>
  );
};

export default Motorista;
