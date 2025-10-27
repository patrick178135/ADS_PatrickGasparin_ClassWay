import { useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";

const Dashboard = () => {
  const { usuario, loading, carregarUsuario } = useAuth();

  useEffect(() => {
    carregarUsuario();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (!usuario) return <p>Usuário não logado</p>;

  return (
    <div className="container-sm">
      <div className="row">
        <div className="col-12 col-md-4 bg-warning p-3 text-white text-center">
          <div className="card border-primary mb-3">
            <div className="card-header">Header</div>
            <div className="card-body text-primary">
              <h5 className="card-title">Primary card title</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 bg-danger p-3 text-white text-center">
        <div className="card border-primary mb-3">
            <div className="card-header">Header</div>
            <div className="card-body text-primary">
              <h5 className="card-title">Primary card title</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 bg-warning p-3 text-white text-center">
        <div className="card border-primary mb-3">
            <div className="card-header">Header</div>
            <div className="card-body text-primary">
              <h5 className="card-title">Primary card title</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
