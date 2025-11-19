import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import usuarioService from "../services/usuario.service";
import { Table, Spinner, Container, Button, Modal, Form, Card, Row, Col, ToastContainer, Toast } from "react-bootstrap";
import rotaService from "../services/rota.service";
import viagemService from "../services/viagem.service";
import veiculoService from "../services/veiculo.service";
import validacaoService from "../services/validacao.service";

type Viagem = {
  ID_viagem?: number;
  nome: string;
  data: string;
  admin: { ID_usuario: number; nome: string };
  motorista: { ID_usuario: number; nome: string };
  rota: { ID_rota: number; nome: string, paradas?: any[] };
  veiculo: { ID_veiculo: number; modelo: string };
  alunos: { ID_usuario: number; nome: string }[];
};
const Viagem = () => {
  const { usuario, loading: loadingAuth, carregarUsuario } = useAuth();
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [tipoMensagem, setTipoMensagem] = useState<"success" | "error" | "warning" | "info" | null>(null);
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<{ ID_usuario: number, nome: string }[]>([]);
  const [adminMap, setAdminMap] = useState<Map<number, string>>(new Map());
  const [motoristas, setMotoristas] = useState<{ ID_usuario: number, nome: string }[]>([]);
  const [motoristaMap, setMotoristaMap] = useState<Map<number, string>>(new Map());
  const [rotas, setRotas] = useState<{ ID_rota: number, nome: string }[]>([]);
  const [rotaMap, setRotaMap] = useState<Map<number, any>>(new Map());
  const [veiculos, setVeiculos] = useState<{ ID_veiculo: number, modelo: string }[]>([]);
  const [VeiculoMap, setVeiculoMap] = useState<Map<number, string>>(new Map());
  const [alunos, setAlunos] = useState<{ ID_usuario: number, nome: string }[]>([]);
  const [alunoMap, setAlunoMap] = useState<Map<number, string>>(new Map());
  const [refresh, setRefresh] = useState(false);
  const [showModalVer, setShowModalVer] = useState(false);
  const [viagemSelecionada, setViagemSelecionada] = useState<Viagem | null>(null);
  const [showModalAlunos, setShowModalAlunos] = useState(false);
  const [paradaSelecionada, setParadaSelecionada] = useState<number | null>(null);
  const [showModalConfirmValidacao, setShowModalConfirmValidacao] = useState(false);
  const [tipoEvento, setTipoEvento] = useState<'embarque' | 'desembarque'>('embarque');
  const [alunosSelecionados, setAlunosSelecionados] = useState<any[]>([]);
  const [showModalValidacoes, setShowModalValidacoes] = useState(false);
  const [validacoes, setValidacoes] = useState<any[]>([]);


  // formatar data no formato dia/mês/ano hora:minuto
  const formatarData = (dataString: string): string => {
    try {
      const data = new Date(dataString);
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      const hora = String(data.getHours()).padStart(2, '0');
      const minuto = String(data.getMinutes()).padStart(2, '0');
      return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    } catch (error) {
      return dataString;
    }
  };

  useEffect(() => {
    const carregarDadosDoAluno = async () => {
      setLoading(true);
      try {
        const dadosViagens = await viagemService.getViagensHistoricoMotorista(usuario!.sub);
        console.log('Viagens carregadas:', dadosViagens);
        setViagens(dadosViagens);

        await Promise.all([
          fetchAdmins(),
          fetchMotoristas(),
          fetchRotas(),
          fetchVeiculos(),
          fetchAlunos(),
        ]);

      } catch (error) {
        console.error("Erro ao carregar dados da página:");
        setMensagem("Falha ao carregar as viagens. Tente novamente.");
        setTipoMensagem("error");
      } finally {
        setLoading(false);
      }
    };

    if (usuario) {
      carregarDadosDoAluno();
    } else {
      setViagens([]);
    }

  }, [usuario, refresh]);

  const fetchAdmins = async () => {
    try {
      const dados = await usuarioService.getAdmins();
      setAdmins(dados);
      const map = new Map<number, string>();
      dados.forEach((admin: { ID_usuario: number, nome: string }) => map.set(admin.ID_usuario, admin.nome));
      setAdminMap(map);
      console.log('Administrador Map Atualizado:', Array.from(adminMap.entries()));
    } catch (error) {
      console.error("Erro ao buscar Administradores:");
    }
  };

  const fetchMotoristas = async () => {
    try {
      const dados = await usuarioService.getMotristas();
      setMotoristas(dados);
      const map = new Map<number, string>();
      dados.forEach((motorista: { ID_usuario: number, nome: string }) => map.set(motorista.ID_usuario, motorista.nome));
      setMotoristaMap(map);
      console.log('Motorista Map Atualizado:', Array.from(motoristaMap.entries()));
    } catch (error) {
      console.error("Erro ao buscar motoristas:");
    }
  };

  const fetchRotas = async () => {
    try {
      const dados = await rotaService.getRotas();
      setRotas(dados);

      const map = new Map<number, any>();
      dados.forEach((rota: any) => map.set(rota.ID_rota, rota));
      setRotaMap(map);

      console.log("Rotas carregadas:", dados); // só pra debug
    } catch (error) {
      console.error("Erro ao buscar rotas:", error);
    }
  };
  const fetchVeiculos = async () => {
    try {
      const dados = await veiculoService.getVeiculos();
      setVeiculos(dados);
      const map = new Map<number, string>();
      dados.forEach((veiculo: { ID_veiculo: number, modelo: string }) => map.set(veiculo.ID_veiculo, veiculo.modelo));
      setVeiculoMap(map);
      console.log('Veículo Map Atualizado:', Array.from(VeiculoMap.entries()));
    } catch (error) {
      console.error("Erro ao buscar veículos:");
    }
  };

  const fetchAlunos = async () => {
    try {
      const dados = await usuarioService.getAlunos();
      setAlunos(dados);
      const map = new Map<number, string>();
      dados.forEach((aluno: { ID_usuario: number, nome: string }) => map.set(aluno.ID_usuario, aluno.nome));
      setAlunoMap(map);
      console.log('Aluno Map Atualizado:', Array.from(alunoMap.entries()));
    } catch (error) {
      console.error("Erro ao buscar alunos:");
    }
  };

  // Abrir modal Ver
  const handleVer = (viagem: Viagem) => {
    setViagemSelecionada(viagem);
    setShowModalVer(true);
    console.log('Viagem Selecionada Atualizada:', viagem);
  };

  // Fechar modal ver
  const handleFecharVer = () => {
    setShowModalVer(false);
    setViagemSelecionada(null);
  };

  //Alert
  const handleCloseToast = () => {
    setMensagem(null);
    setTipoMensagem(null);
  };

  const handleAbrirAlunos = () => {
    setShowModalAlunos(true);
  };

  // Fechar modal Alunos
  const handleFecharAlunos = () => {
    setShowModalAlunos(false);
  };

  const handleFecharConfirmValidacao = () => {
    setShowModalConfirmValidacao(false)
  };

  const handleConfirmarEvento = async () => {
    if (!viagemSelecionada) return;

    try {
      const validacoes = alunosSelecionados.map((aluno) => ({
        tipo_evento: tipoEvento,
        aluno: aluno.ID_usuario,
        parada: paradaSelecionada,
        viagem: viagemSelecionada.ID_viagem!,
      }));

      await validacaoService.criarValidacoesEmLote(validacoes);

      setMensagem(`Validação de ${tipoEvento} registrada com sucesso!`);
      setTipoMensagem("success");
      setAlunosSelecionados([]);
      setShowModalConfirmValidacao(false);
    } catch (error) {
      console.error("Erro ao criar validações:");
      setMensagem("Erro ao registrar validação.");
      setTipoMensagem("error");
    } finally {
      setTimeout(() => {
        setMensagem(null);
        setTipoMensagem(null);
      }, 2000);
    }
  };

  const toggleAlunoSelecionado = (idAluno: number) => {
    const alunoObj = viagemSelecionada?.alunos.find(a => a.ID_usuario === idAluno);
    if (!alunoObj) return;

    setAlunosSelecionados((prev) =>
      prev.some((a) => a.ID_usuario === idAluno)
        ? prev.filter((a) => a.ID_usuario !== idAluno)
        : [...prev, alunoObj]
    );
  };

  const handleValidarAlunos = (tipoEvento: "embarque" | "desembarque") => {
    if (!viagemSelecionada) return;
    if (alunosSelecionados.length === 0) return;

    setTipoEvento(tipoEvento);
    setShowModalConfirmValidacao(true);
  };

  const handleAbrirValidacoes = async () => {

    const dadosValidacoes = await validacaoService.getValidacoesPorViagem(viagemSelecionada!.ID_viagem!);
    console.log('Validações carregadas:', dadosValidacoes);
    setValidacoes(dadosValidacoes);

    setShowModalValidacoes(true);
  };

  const handleFecharValidacoes = () => {
    setShowModalValidacoes(false);
    setValidacoes([]);
  };


  if (loadingAuth) return <Spinner animation="border" />;
  if (!usuario)
    return (
      <>
        <p>Usuário não logado</p>
        <a href="login">Voltar para o Login</a>
      </>
    );
  if (usuario.perfil != 2) return <p>É preciso ser Motorista para acessar essa página</p>;
  if (loading) return <Spinner animation="border" />;

  return (
    <>
      <title>Viagens</title>

      <ToastContainer
        className="p-3"
        position="top-end"
        style={{ zIndex: 15000 }}
      >
        {mensagem && tipoMensagem && (
          <Toast
            onClose={handleCloseToast}
            show={!!mensagem}
            delay={5000}
            autohide
            bg="dark"
          >
            <Toast.Header closeButton>
              <strong className="me-auto">
                {tipoMensagem === "success" && "Sucesso"}
                {tipoMensagem === "info" && "Informação"}
                {tipoMensagem === "warning" && "Atenção"}
                {tipoMensagem === "error" && "Erro"}
              </strong>
            </Toast.Header>
            <Toast.Body className='text-white'>
              {mensagem}
            </Toast.Body>
          </Toast>
        )}
      </ToastContainer>

      <Container className="mt-5 rounded-4 shadow p-5">
        <h1 className="mb-4">Histórico de viagens de {usuario?.nome ?? "Usuário"} </h1>

        {/* 


        TABELA 


        */}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>id</th>
              <th>Nome</th>
              <th>data</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {viagens.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  Nenhuma viagem encontrada
                </td>
              </tr>
            ) : (
              viagens.map((u, index) => (
                <tr key={index}>
                  <td>{u.ID_viagem}</td>
                  <td>{u.nome}</td>
                  <td>{formatarData(u.data)}</td>
                  <td className="d-flex justify-content-center">

                    <Button
                      className="m-1 shadow"
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleVer(u)}
                    >
                      <i className="bi bi-eye me-1"></i>
                    </Button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* 


        MODAL VER 
        

        */}


        <Modal show={showModalVer} onHide={handleFecharVer} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Detalhes da Viagem</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {viagemSelecionada && (
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex align-items-center mb-4">
                    <i className="bi bi-ticket-perforated fs-1 me-3 text-primary"></i>
                    <div>
                      <Card.Title as="h2" className="mb-0">{viagemSelecionada.nome}</Card.Title>
                    </div>
                  </div>

                  <hr />

                  <Row className="g-3">

                    <Col xs={12}>
                      <strong><i className="bi bi-textarea-resize me-2"></i>Data:</strong>
                      <p className="ms-4 mb-0">{formatarData(viagemSelecionada.data)}</p>
                    </Col>

                    <Col md={6} xs={12}>
                      <strong><i className="bi bi-person-gear me-2"></i>Administrador:</strong>
                      <p className="ms-4 mb-0">{viagemSelecionada.admin?.nome ?? "Não Encontrado"}</p>
                    </Col>

                    <Col md={6} xs={12}>
                      <strong><i className="bi bi-person-badge me-2"></i>Motorista:</strong>
                      <p className="ms-4 mb-0">{viagemSelecionada.motorista?.nome ?? "Não Encontrado"}</p>
                    </Col>

                    <Col md={6} xs={12}>
                      <strong><i className="bi bi-map me-2"></i>Rota:</strong>
                      <p className="ms-4 mb-0">{viagemSelecionada.rota?.nome ?? "Não Encontrada"}</p>
                    </Col>

                    <Col md={6} xs={12}>
                      <strong><i className="bi bi-bus-front-fill me-2"></i>Veículo:</strong>
                      <p className="ms-4 mb-0">{viagemSelecionada.veiculo?.modelo ?? "Não Encontrado"}</p>
                    </Col>

                  </Row>
                </Card.Body>
              </Card>
            )}
          </Modal.Body>

          <Modal.Footer>
            {viagemSelecionada && viagemSelecionada.alunos?.length > 0 && (
              <Button variant="primary" onClick={handleAbrirAlunos}>
                <i className="bi bi-pin-map me-2"></i>Ver Alunos ({viagemSelecionada.alunos.length})
              </Button>
            )}

            <Button variant="primary" onClick={handleAbrirValidacoes}>
              <i className="bi bi-check2-square me-2"></i> Ver Validações
            </Button>


            <Button variant="secondary" onClick={handleFecharVer}>
              Sair
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 


        MODAL VER ALUNOS DA VIAGEM 

        
        */}

        <Modal show={showModalAlunos} onHide={handleFecharAlunos} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Alunos da Viagem: {viagemSelecionada?.nome}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {viagemSelecionada && viagemSelecionada.alunos?.length > 0 ? (
              <>
                <Row className="g-3">
                  {viagemSelecionada.alunos.map((aluno) => (
                    <Col key={aluno.ID_usuario} xs={12} sm={6} md={4}>
                      <Card
                        onClick={() => toggleAlunoSelecionado(aluno.ID_usuario)}
                        className={`shadow-sm h-100 cursor-pointer ${alunosSelecionados.some(a => a.ID_usuario === aluno.ID_usuario)
                          ? "border border-primary bg-light"
                          : "border"
                          }`}
                      >
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                          <div className="mb-3">
                            <i
                              className={`bi bi-person-circle fs-1 ${alunosSelecionados.includes(aluno.ID_usuario)
                                ? "text-primary"
                                : "text-secondary"
                                }`}
                            ></i>
                          </div>
                          <Card.Title>{alunoMap.get(aluno.ID_usuario) || `Aluno ID ${aluno.ID_usuario}`}</Card.Title>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Selecione a Parada</Form.Label>
                  <Form.Select
                    value={paradaSelecionada ?? ""}
                    onChange={(e) => setParadaSelecionada(Number(e.target.value))}
                  >
                    <option value="">Selecione a parada</option>
                    {rotaMap.get(viagemSelecionada?.rota?.ID_rota)?.paradas?.map((parada: any) => (
                      <option key={parada.ID_parada} value={parada.ID_parada}>
                        {parada.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <div className="d-flex justify-content-center mt-4 gap-3">
                  <Button
                    variant="success"
                    className="shadow"
                    disabled={alunosSelecionados.length === 0}
                    onClick={() => handleValidarAlunos("embarque")}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>Embarque
                  </Button>
                  <Button
                    variant="danger"
                    className="shadow"
                    disabled={alunosSelecionados.length === 0}
                    onClick={() => handleValidarAlunos("desembarque")}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>Desembarque
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center text-muted">Esta viagem não possui alunos.</p>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleFecharAlunos}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 


        MODAL CONFIMAR VALIDAÇÃO 
        
        
        */}

        <Modal show={showModalConfirmValidacao} onHide={handleFecharConfirmValidacao} centered>
          <Modal.Header
            closeButton
            className={
              tipoEvento === "embarque" ? "bg-success text-white" : "bg-danger text-white"
            }
          >
            <Modal.Title>
              <i
                className={
                  tipoEvento === "embarque"
                    ? "bi bi-box-arrow-in-right me-2"
                    : "bi bi-box-arrow-left me-2"
                }
              ></i>
              {tipoEvento === "embarque" ? "Confirmação de Embarque" : "Confirmação de Desembarque"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="py-4">
            {alunosSelecionados && alunosSelecionados.length > 0 ? (
              <>
                <p className="lead text-center">
                  Você tem certeza que deseja confirmar o{" "}
                  <strong>{tipoEvento}</strong> dos seguintes alunos?
                </p>

                <ul className="list-group my-3">
                  {alunosSelecionados.map((aluno: any) => (
                    <li
                      key={aluno.ID_usuario}
                      className="list-group-item text-center fw-semibold"
                    >
                      {aluno.nome}
                    </li>
                  ))}
                </ul>

                <p className="text-muted text-center mb-0">
                  Esta ação registrará o {tipoEvento} no sistema.
                </p>
              </>
            ) : (
              <p className="text-center text-muted">Nenhum aluno selecionado.</p>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleFecharConfirmValidacao}>
              Cancelar
            </Button>
            <Button
              variant={tipoEvento === "embarque" ? "success" : "danger"}
              onClick={handleConfirmarEvento}
            >
              <i
                className={
                  tipoEvento === "embarque"
                    ? "bi bi-check2-circle me-2"
                    : "bi bi-arrow-left-circle me-2"
                }
              ></i>
              Confirmar {tipoEvento.charAt(0).toUpperCase() + tipoEvento.slice(1)}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 


        MODAL VER VALIDAÇÕES
        
        
        */}

        <Modal show={showModalValidacoes} onHide={handleFecharValidacoes} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Validações da Viagem: {viagemSelecionada?.nome}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {validacoes.length === 0 ? (
              <p className="text-muted">Nenhuma validação encontrada para esta viagem.</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Tipo</th>
                    <th>Parada</th>
                    <th>Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {validacoes.map((validacao, index) => (
                    <tr key={index}>
                      <td>{`${validacao.aluno?.nome} `}</td>
                      <td>
                        <span className={`badge fs-6 rounded-pill ms-2 bg-${validacao.tipo_evento === 'embarque' ? 'success' : 'danger'}`}>
                          {validacao.tipo_evento === 'embarque' ? 'Embarque' : 'Desembarque'}
                        </span>
                      </td>
                      <td>{`${validacao.parada?.nome}`}</td>
                      <td>{formatarData(validacao.data_hora)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleFecharValidacoes}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Viagem;
