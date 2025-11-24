import { useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { title } from "process";

const Dashboard = () => {
  const { usuario, loading, carregarUsuario } = useAuth();

  useEffect(() => {
    carregarUsuario();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (!usuario)
    return (
      <>
        <p>Usuário não logado</p>
        <a href="login">Voltar para o Login</a>
      </>
    ); 
  if (usuario.perfil != 1) return <p>É preciso ser Administrador para acessar essa página</p>;


  return (
    <>
    <title>Dashboard</title>
    
    <div className="container-sm">
      <div className="row">
        <div className="col-12 col-md-4 p-3 text-white text-center">
          <div className="card border-primary mb-3">
            <div className="card-header">Gráfico</div>
            <div className="card-body text-primary">
              <h5 className="card-title">Dados de alunos</h5>
              <p className="card-text">Informação</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4  p-3 text-white text-center">
        <div className="card border-primary mb-3">
            <div className="card-header">Gráfico</div>
            <div className="card-body text-primary">
              <h5 className="card-title">Dados de viagem</h5>
              <p className="card-text">Informação.</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 p-3 text-white text-center">
        <div className="card border-primary mb-3">
            <div className="card-header">Gráfico</div>
            <div className="card-body text-primary">
              <h5 className="card-title">Dados de Veículos</h5>
              <p className="card-text">Informação</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body p-0">
              <img 
                src="/img/Dashboard.png" 
                alt="Dashboard de Visão Geral" 
                className="img-fluid w-100" 
                style={{ borderRadius: '0.5rem' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
