import { useEffect, useState } from "react";
import { useLogout } from "@/src/hooks/useLogout";
import { useAuth } from "@/src/context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import router from "next/router";
import { Leckerli_One, Libre_Caslon_Text } from "next/font/google";
import perfilService from "@/src/services/perfil.service";


const leckerliOne = Leckerli_One({
  subsets: ['latin'],
  weight: '400',
});

const libreCaslon = Libre_Caslon_Text({
  subsets: ['latin'],
  weight: '400',
});

export const AdminNavbar = () => {
  const logout = useLogout();
  const { usuario } = useAuth();

  const [offcanvasOpen, setOffcanvasOpen] = useState(false);;
  const [dropdownOpenPaginas, setDropdownOpenPaginas] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [perfis, setPerfis] = useState<{ ID_perfil: number, nome: string }[]>([]);
  const [perfilMap, setPerfilMap] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    fetchPerfis();
  }, []);

  const fetchPerfis = async () => {
    try {
      const dados = await perfilService.getPerfis();
      setPerfis(dados);
      const map = new Map<number, string>();
      dados.forEach((perfil: { ID_perfil: number, nome: string }) => map.set(perfil.ID_perfil, perfil.nome));
      setPerfilMap(map);
    } catch (error) {
      console.error("Erro ao buscar perfis:", error);
    }
  };

  const irDashboard = () => {
    router.push("/dashboard");
    setOffcanvasOpen(false)
  }

  const irAluno = () => {
    router.push("/create.aluno");
    setOffcanvasOpen(false)
  }

  const irMotorista = () => {
    router.push("/create.motorista");
    setOffcanvasOpen(false)
  }

  const irUsuário = () => {
    router.push("/create.usuario");
    setOffcanvasOpen(false)
  }

  const irVeiculo = () => {
    router.push("/create.veiculo");
    setOffcanvasOpen(false)
  }

  const irParada = () => {
    router.push("/create.parada");
    setOffcanvasOpen(false)
  }

  const irRota = () => {
    router.push("/create.rota");
    setOffcanvasOpen(false)
  }

  const irViagem = () => {
    router.push("/create.viagem");
    setOffcanvasOpen(false)
  }

  const irCidade = () => {
    router.push("/create.cidade");
    setOffcanvasOpen(false)
  }
  
  const irPerfil = () => {
    router.push("/create.perfil");
    setOffcanvasOpen(false)
  }

  return (
    <>
      <nav className="navbar navbar-expand-sm" style={{ backgroundColor: 'rgb(102, 17, 17)' }}>
        <div className="container-fluid">

          <a className={`navbar-brand text-light ${leckerliOne.className}`} href="home">
            ClassWay
          </a>

          <div className="d-none d-sm-block w-100 mt-2">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className={`nav-link text-light ${libreCaslon.className}`} href="aluno">Alunos</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link text-light ${libreCaslon.className}`} href="motorista">Motoristas</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link text-light ${libreCaslon.className}`} href="veiculo">Veículos</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link text-light ${libreCaslon.className}`} href="parada">Paradas</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link text-light ${libreCaslon.className}`} href="rota">Rotas</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link text-light ${libreCaslon.className}`} href="viagem">Viagens</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link text-light ${libreCaslon.className}`} href="usuario">Usuários</a>
              </li>
            </ul>
          </div>

          <div className="ms-auto">
            <button
              className="btn btn-outline-light me-2"
              onClick={() => setOffcanvasOpen(true)}
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>
      </nav>

      {offcanvasOpen && (
        <>
          <div
            className={`offcanvas offcanvas-start show d-flex flex-column justify-content-between ${libreCaslon.className}`}
            style={{
              visibility: "visible",
              position: "fixed",
              top: 0,
              left: 0,
              width: "300px",
              height: "100vh",
              zIndex: 1050,
              backgroundColor: 'rgb(102, 17, 17)'
            }}
          >
            <div>
              <div className="offcanvas-header">
                <h4 className="offcanvas-title text-light" >Menu</h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setOffcanvasOpen(false)}
                ></button>
              </div>

              <div className="dropdown m-3">
                <button className="btn btn-outline-secondary w-100 text-start text-light" onClick={irDashboard} >Dashboard</button>
              </div>

              <div className="dropdown m-3">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle w-100 text-start text-light" data-bs-toggle="dropdown"
                    onClick={() =>
                      setDropdownOpenPaginas(!dropdownOpenPaginas)
                    }
                  >
                    Páginas
                  </button>
                  {dropdownOpenPaginas && (
                    <ul className="dropdown-menu show w-100">
                      <li>
                        <a className="dropdown-item" href="aluno">
                          Aluno
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="viagem">
                          Viagem
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="rota">
                          Rota
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="motorista">
                          Motorista
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="veiculo">
                          Veículo
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="parada">
                          Parada
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="cidade">
                          Cidade
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="perfil">
                          Perfil
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="usuario">
                          Usuário
                        </a>
                      </li>
                    </ul>
                  )}
                </div>


              <h5 className="text-light m-3 mt-5">Cadastros:</h5>

              <div className="dropdown m-3">
                <button className="btn btn-outline-secondary w-100 text-start text-light" onClick={irAluno} >Aluno</button>
              </div>

              <div className="dropdown m-3">
                <button className="btn btn-outline-secondary w-100 text-start text-light" onClick={irViagem} >Viagem</button>
              </div>

              <div className="dropdown m-3">
                <button className="btn btn-outline-secondary w-100 text-start text-light" onClick={irRota} >Rota</button>
              </div>

              <div className="dropdown m-3">
                <button className="btn btn-outline-secondary w-100 text-start text-light" onClick={irMotorista} >Motorista</button>
              </div>  

              <div className="dropdown m-3">
                <button className="btn btn-outline-secondary w-100 text-start text-light" onClick={irVeiculo} >Veículo</button>
              </div>

              <div className="dropdown m-3">
                <button className="btn btn-outline-secondary w-100 text-start text-light" onClick={irParada} >Parada</button>
              </div>

              <div className="dropdown m-3">
                <button className="btn btn-outline-secondary w-100 text-start text-light" onClick={irCidade} >Cidade</button>
              </div> 

              <div className="dropdown m-3">
                <button className="btn btn-outline-secondary w-100 text-start text-light" onClick={irPerfil} >Perfil</button>
              </div>


              <div className="dropdown m-3">
                <button className="btn btn-outline-secondary w-100 text-start text-light" onClick={irUsuário} >Usuário</button>
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
                  <strong>{usuario?.nome ?? "Usuário"}</strong>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>
                    Perfil {perfilMap.get(usuario?.perfil ?? 0)}
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
                    <a className="dropdown-item" href="/meu_perfil">
                      Meu perfil
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
