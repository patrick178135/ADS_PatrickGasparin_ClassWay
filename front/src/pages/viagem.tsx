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
  admin: number;
  motorista: number;
  rota: number;
  veiculo: number;
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
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [viagemSelecionada, setViagemSelecionada] = useState<Viagem | null>(null);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [viagemParaDeletar, setViagemParaDeletar] = useState<Viagem | null>(null);
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

  //converter data para o formato datetime-local
  const paraDatetimeLocal = (dataString: string): string => {
    try {
      const data = new Date(dataString);
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const dia = String(data.getDate()).padStart(2, '0');
      const hora = String(data.getHours()).padStart(2, '0');
      const minuto = String(data.getMinutes()).padStart(2, '0');
      return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
    } catch (error) {
      return dataString;
    }
  };

  useEffect(() => {
    carregarUsuario();
    fetchViagens();
    fetchAdmins();
    fetchMotoristas();
    fetchRotas();
    fetchVeiculos();
    fetchAlunos();
  }, [refresh]);

  const fetchViagens = async () => {
    try {
      setLoading(true);
      const dados = await viagemService.getViagens();
      setViagens(dados);
    } catch (error) {
      console.error("Erro ao buscar vaigens:");
    } finally {
      setLoading(false);
    }
  };

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

  // Abrir modal Edit
  const handleEditar = (vaigem: Viagem) => {
    setViagemSelecionada(vaigem);
    setShowModalEdit(true);
  };

  // Fechar modal Edit
  const handleFecharEdit = () => {
    setShowModalEdit(false);
    setViagemSelecionada(null);
  };

  //Alert
  const handleCloseToast = () => {
    setMensagem(null);
    setTipoMensagem(null);
  };

  const handleConfirmarExclusao = (vaigem: Viagem) => {
    setViagemParaDeletar(vaigem);
    setShowModalConfirm(true);
  };

  const handleFecharConfirm = () => {
    setShowModalConfirm(false);
    setViagemParaDeletar(null);
  };

  const handleAbrirAlunos = () => {
    setShowModalAlunos(true);
  };

  // Fechar modal Alunos
  const handleFecharAlunos = () => {
    setShowModalAlunos(false);
  };

  const handleFecharConfirmValidacao = () => setShowModalConfirmValidacao(false);

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
      console.error("Erro ao criar validações:", error);
      setMensagem("Erro ao registrar validação.");
      setTipoMensagem("error");
    } finally {
      setTimeout(() => {
        setMensagem(null);
        setTipoMensagem(null);
      }, 2000);
    }
  };

  // Atualizar 
  const handleSalvar = async () => {
    if (!viagemSelecionada?.ID_viagem) {
      console.warn("Nenhuma viagem selecionada para atualizar.");
      return;
    }

    const body = {
      nome: viagemSelecionada.nome,
      data: viagemSelecionada.data,
      admin: viagemSelecionada.admin,
      motorista: viagemSelecionada.motorista,
      rota: viagemSelecionada.rota,
      veiculo: viagemSelecionada.veiculo,
      alunos: viagemSelecionada.alunos.map(p => p.ID_usuario),
    };

    try {
      console.log("Enviando body para atualização:", body);
      await viagemService.updateViagem(viagemSelecionada.ID_viagem, body);

      setMensagem("Viagem atualizada com sucesso!");
      setTipoMensagem("success");
      handleFecharEdit();
      fetchViagens();

    } catch (error) {
      console.error("Erro ao atualizar Viagem:");
      setMensagem("Ocorreu um erro ao tentar atualizar. Tente novamente.");
      setTipoMensagem("error");
    } finally {
      setTimeout(() => {
        setMensagem(null);
        setTipoMensagem(null);
      }, 2000);
    }
  };

  const excluirViagem = async () => {
    if (!viagemParaDeletar?.ID_viagem) {
      console.error("ID da Viagem não encontrado para exclusão.");
      return;
    }

    try {
      await viagemService.deleteViagem(viagemParaDeletar?.ID_viagem);

      setMensagem("Viagem DELETADA com sucesso!");
      setTipoMensagem("success");
      setRefresh(prev => !prev);

    } catch (error) {
      console.error("Erro ao excluir Viagem");
      setMensagem("Erro ao excluir Viagem. Tente novamente.");
      setTipoMensagem("error");
    } finally {
      handleFecharConfirm();
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
  if (!usuario) return <p>Usuário não logado</p>;
  if (loading) return <Spinner animation="border" />;

  return (
    <>
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
        <h1 className="mb-4">Lista de Viagens </h1>

        <div className="d-flex justify-content-end mb-3">
          <Button href="create.viagem" className="mt-5 shadow">Adicionar Viagem</Button>
        </div>

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
                      variant="outline-warning"
                      size="sm"
                      onClick={() => handleEditar(u)}
                    >
                      <i className="bi bi-pencil me-1"></i>
                    </Button>

                    <Button
                      className="m-1 shadow"
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleVer(u)}
                    >
                      <i className="bi bi-eye me-1"></i>
                    </Button>

                    <Button
                      className="m-1 shadow"
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleConfirmarExclusao(u)}
                    >
                      <i className="bi bi-trash me-1"></i>
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
                      <p className="ms-4 mb-0">{adminMap.get(viagemSelecionada.admin) ?? "Não Encontrada"}</p>
                    </Col>

                    <Col md={6} xs={12}>
                      <strong><i className="bi bi-person-badge me-2"></i>Motorista:</strong>
                      <p className="ms-4 mb-0">{motoristaMap.get(viagemSelecionada.motorista) ?? "Não Encontrada"}</p>
                    </Col>

                    <Col md={6} xs={12}>
                      <strong><i className="bi bi-map me-2"></i>Rota:</strong>
                      <p className="ms-4 mb-0">{rotaMap.get(viagemSelecionada.rota)?.nome ?? "Não Encontrada"}</p>
                    </Col>

                    <Col md={6} xs={12}>
                      <strong><i className="bi bi-bus-front-fill me-2"></i>Veículo:</strong>
                      <p className="ms-4 mb-0">{VeiculoMap.get(viagemSelecionada.veiculo) ?? "Não Encontrada"}</p>
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


        MODAL EDIT 
        

        */}

        <Modal show={showModalEdit} onHide={handleFecharEdit} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Editar Viagem</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {viagemSelecionada && (
              <Card className="shadow-sm border-0 p-3">
                <Card.Body>
                  <Form>
                    <Card.Title className="mb-3">Informações da Viagem</Card.Title>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nome</Form.Label>
                          <Form.Control
                            type="text"
                            value={viagemSelecionada.nome}
                            onChange={(e) =>
                              setViagemSelecionada({
                                ...viagemSelecionada,
                                nome: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Data e Hora da Viagem:</Form.Label>
                          <Form.Control
                            id="dataHora"
                            type="datetime-local"
                            name="data"
                            value={paraDatetimeLocal(viagemSelecionada.data)}
                            onChange={(e) =>
                              setViagemSelecionada({
                                ...viagemSelecionada,
                                data: new Date(e.target.value).toISOString(),
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <hr className="my-4" />

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Administrador</Form.Label>
                          <Form.Select
                            value={viagemSelecionada.admin}
                            onChange={(e) =>
                              setViagemSelecionada({
                                ...viagemSelecionada,
                                admin: Number(e.target.value),
                              })
                            }
                          >
                            <option value={"0"}>Selecione o Administrador</option>
                            {admins.map((admin) => (
                              <option key={admin.ID_usuario} value={admin.ID_usuario.toString()}>
                                {admin.nome}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Motorista</Form.Label>
                          <Form.Select
                            value={viagemSelecionada.motorista}
                            onChange={(e) =>
                              setViagemSelecionada({
                                ...viagemSelecionada,
                                motorista: Number(e.target.value),
                              })
                            }
                          >
                            <option value={"0"}>Selecione o Motorista</option>
                            {motoristas.map((motorista) => (
                              <option key={motorista.ID_usuario} value={motorista.ID_usuario.toString()}>
                                {motorista.nome}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Rota</Form.Label>
                          <Form.Select
                            value={viagemSelecionada.rota}
                            onChange={(e) =>
                              setViagemSelecionada({
                                ...viagemSelecionada,
                                rota: Number(e.target.value),
                              })
                            }
                          >
                            <option value={"0"}>Selecione a Rota</option>
                            {rotas.map((rota) => (
                              <option key={rota.ID_rota} value={rota.ID_rota.toString()}>
                                {rota.nome}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Veículo</Form.Label>
                          <Form.Select
                            value={viagemSelecionada.veiculo}
                            onChange={(e) =>
                              setViagemSelecionada({
                                ...viagemSelecionada,
                                veiculo: Number(e.target.value),
                              })
                            }
                          >
                            <option value={"0"}>Selecione o Veículo</option>
                            {veiculos.map((veiculo) => (
                              <option key={veiculo.ID_veiculo} value={veiculo.ID_veiculo.toString()}>
                                {veiculo.modelo}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Selecione os Alunos:</Form.Label>
                          <Card className="p-3 border">
                            {alunos.length === 0 ? (
                              <p className="text-muted mb-0">Nenhum aluno cadastrado.</p>
                            ) : (
                              alunos.map((aluno) => (
                                <Form.Check
                                  key={aluno.ID_usuario}
                                  type="checkbox"
                                  id={`aluno-${aluno.ID_usuario}`}
                                  label={aluno.nome}
                                  checked={viagemSelecionada.alunos?.some(
                                    (p) => p.ID_usuario === aluno.ID_usuario
                                  )}
                                  onChange={(e) => {
                                    const checked = e.target.checked;

                                    const alunosAtuais = viagemSelecionada.alunos || [];

                                    const novosAlunos = checked
                                      ? [...viagemSelecionada.alunos, aluno]
                                      : viagemSelecionada.alunos.filter(
                                        (p) => p.ID_usuario !== aluno.ID_usuario
                                      );
                                    setViagemSelecionada({ ...viagemSelecionada, alunos: novosAlunos });
                                  }}
                                />
                              ))
                            )}
                          </Card>
                        </Form.Group>

                      </Col>
                    </Row>

                  </Form>
                </Card.Body>
              </Card>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleFecharEdit}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSalvar}>
              Salvar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 


        MODAL CONFIRMAR EXCLUSÃO 

        
        */}

        <Modal show={showModalConfirm} onHide={handleFecharConfirm} centered>
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Confirmação de Exclusão
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4">
            {viagemParaDeletar && (
              <>
                <p className="lead">
                  Você tem certeza que deseja EXCLUIR a Viagem:
                </p>
                <h4 className="text-danger text-center my-3">
                  {viagemParaDeletar.nome} (ID: {viagemParaDeletar.ID_viagem})
                </h4>
                <p className="text-muted text-center">
                  Esta ação é irreversível.
                </p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleFecharConfirm}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={excluirViagem}>
              <i className="bi bi-trash me-2"></i>
              Excluir Permanentemente
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
                    {rotaMap.get(viagemSelecionada?.rota)?.paradas?.map((parada: any) => (
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
