import { useState } from "react";
import { useLogout } from "@/src/hooks/useLogout";
import { useAuth } from "@/src/context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import router from "next/router";

export const AdminNavbar = () => {
  const logout = useLogout();
  const { usuario } = useAuth();

  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const [dropdownOpenCadastro, setDropdownOpenCadastro] = useState(false);
  const [dropdownOpenViagem, setDropdownOpenViagem] = useState(false);
  const [dropdownOpenMotorista, setDropdownOpenMotorista] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const irDashboard = () => {
    router.push("/dashboard"); 
    setOffcanvasOpen(false)
  }

  return (
    <>
      <nav className="navbar navbar-expand-sm bg-body-tertiary">
        <div className="container-fluid">

          <button
            className="btn btn-outline-primary me-2"
            onClick={() => setOffcanvasOpen(true)}
          >
            <i className="bi bi-list"></i>
          </button>

          <a className="navbar-brand" href="home">
            ClassWay
          </a>

          <div className="d-none d-sm-block w-100 mt-2">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="aluno">Alunos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="viagem">Viagens</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="motorista">Motoristas</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="veiculo">Veículos</a>
              </li>
            </ul>
          </div>

          <div className="ms-auto">
            <button onClick={logout} className="btn btn-outline-danger">
              Sair
            </button>
          </div>
        </div>
      </nav>


      {offcanvasOpen && (
        <>
          <div
            className="offcanvas offcanvas-start show d-flex flex-column justify-content-between"
            style={{
              visibility: "visible",
              position: "fixed",
              top: 0,
              left: 0,
              width: "300px",
              height: "100vh",
              backgroundColor: "white",
              zIndex: 1050,
            }}
          >
            <div>
              <div className="offcanvas-header">
                <h5 className="offcanvas-title">Menu</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setOffcanvasOpen(false)}
                ></button>
              </div>

              <div className="offcanvas-body">
                <p>Algumas opções do menu</p>

                <div   className="dropdown mt-3">
                  <button className="btn btn-outline-secondary w-100 text-start" onClick={irDashboard} >Dashboard</button>
                </div>

                <div className="dropdown mt-3">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle w-100 text-start" data-bs-toggle="dropdown"
                    onClick={() =>
                      setDropdownOpenCadastro(!dropdownOpenCadastro)
                    }
                  >
                    Cadastro
                  </button>
                  {dropdownOpenCadastro && (
                    <ul className="dropdown-menu show w-100">
                      <li>
                        <a className="dropdown-item" href="aluno">
                          Aluno
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="create.usuario">
                          Motorista
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="create.usuario">
                          Usuário Admin
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="create.usuario">
                          Cidade
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="create.usuario">
                          Parada
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="create.usuario">
                          Rota
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="create.usuario">
                          Veículo
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="create.usuario">
                          Viagem
                        </a>
                      </li>
                    </ul>
                  )}
                </div>

                <div className="dropdown mt-3">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
                    onClick={() =>
                      setDropdownOpenViagem(!dropdownOpenViagem)
                    }
                  >
                    Viagens
                  </button>
                  {dropdownOpenViagem && (
                    <ul className="dropdown-menu show w-100">
                      <li>
                        <a className="dropdown-item" href="viagem">
                          Listar viagens
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="create.viagem">
                          Criar viagem
                        </a>
                      </li>
                    </ul>
                  )}
                </div>

                <div className="dropdown mt-3">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
                    onClick={() =>
                      setDropdownOpenMotorista(!dropdownOpenMotorista)
                    }
                  >
                    Motoristas
                  </button>
                  {dropdownOpenMotorista && (
                    <ul className="dropdown-menu show w-100">
                      <li>
                        <a className="dropdown-item" href="motorista">
                          Listar motoristas
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="create.usuario">
                          Adicionar motorista
                        </a>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div
              className="p-3 border-top"
              style={{
                backgroundColor: "#f8f9fa",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <div className="d-flex align-items-center">
                <i className="bi bi-person-circle fs-3 me-2 text-secondary"></i>
                <div>
                  <strong>{usuario?.email ?? "Usuário"}</strong>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>
                    Perfil {usuario?.perfil ?? "-"}
                  </p>
                </div>
              </div>

              {userDropdownOpen && (
                <ul
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    bottom: "60px",
                    left: "20px",
                    display: "block",
                  }}
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Meu perfil
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Configurações
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={logout}
                    >
                      Sair
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>

          <div
            className="offcanvas-backdrop fade show"
            onClick={() => setOffcanvasOpen(false)}
          ></div>
        </>
      )}
    </>
  );
};
