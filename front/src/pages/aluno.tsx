import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import usuarioService from "../services/usuario.service";
import { Table, Spinner, Container, Button, Modal, Form, Card, Row, Col, ToastContainer, Toast } from "react-bootstrap";
import perfilService from "../services/perfil.service";
import cidadeService from "../services/cidade.service";
import validacaoService from "../services/validacao.service";

type Usuario = {
  ID_usuario?: number;
  nome: string;
  email: string;
  CPF: string;
  senhaHash: string;
  ativo: boolean;
  perfil_usuario: number;
  cidade: number;
};

const Aluno = () => {
  const { usuario, loading: loadingAuth, carregarUsuario } = useAuth();
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [tipoMensagem, setTipoMensagem] = useState<"success" | "error" | "warning" | "info" | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [cidades, setCidades] = useState<{ ID_cidade: number, nome: string }[]>([]);
  const [perfis, setPerfis] = useState<{ ID_perfil: number, nome: string }[]>([]);
  const [cidadeMap, setCidadeMap] = useState<Map<number, string>>(new Map());
  const [perfilMap, setPerfilMap] = useState<Map<number, string>>(new Map());
  const [refresh, setRefresh] = useState(false);
  const [showModalVer, setShowModalVer] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState<Usuario | null>(null);
  const [showModalValidacoes, setShowModalValidacoes] = useState(false);
  const [validacoes, setValidacoes] = useState<any[]>([]);

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
    carregarUsuario();
    fetchUsuarios();
    fetchCidades();
    fetchPerfis();
  }, [refresh]);

  const fetchCidades = async () => {
    try {
      const dados = await cidadeService.getCidades();
      setCidades(dados);
      const map = new Map<number, string>();
      dados.forEach((cidade: { ID_cidade: number, nome: string }) => map.set(cidade.ID_cidade, cidade.nome));
      setCidadeMap(map);
    } catch (error) {
      console.error("Erro ao buscar cidades:");
    }
  };

  const fetchPerfis = async () => {
    try {
      const dados = await perfilService.getPerfis();
      setPerfis(dados);
      const map = new Map<number, string>();
      dados.forEach((perfil: { ID_perfil: number, nome: string }) => map.set(perfil.ID_perfil, perfil.nome));
      setPerfilMap(map);
    } catch (error) {
      console.error("Erro ao buscar perfis:");
    }
  };

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const dados = await usuarioService.getAlunos();
      setUsuarios(dados);
    } catch (error) {
      console.error("Erro ao buscar usuários:");
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal Ver
  const handleVer = (user: Usuario) => {
    setUsuarioSelecionado(user);
    setShowModalVer(true);
  };

  // Fechar modal Edit
  const handleFecharVer = () => {
    setShowModalVer(false);
    setUsuarioSelecionado(null);
  };


  // Abrir modal Edit
  const handleEditar = (user: Usuario) => {
    setUsuarioSelecionado(user);
    setShowModalEdit(true);
  };

  // Fechar modal Edit
  const handleFecharEdit = () => {
    setShowModalEdit(false);
    setUsuarioSelecionado(null);
  };

  //Alert
  const handleCloseToast = () => {
    setMensagem(null);
    setTipoMensagem(null);
  };


  const handleConfirmarExclusao = (usuario: Usuario) => {
    setUsuarioParaDeletar(usuario);
    setShowModalConfirm(true);
  };

  const handleFecharConfirm = () => {
    setShowModalConfirm(false);
    setUsuarioParaDeletar(null);
  };

  // Atualizar usuário
  const handleSalvar = async () => {
    if (!usuarioSelecionado?.ID_usuario) {
      console.warn("Nenhum usuário selecionado para atualizar.");
      return;
    }
    if (!usuarioSelecionado.email || !usuarioSelecionado.email.includes("@")) {
      setMensagem("Por favor, digite um email válido.");
      setTipoMensagem("warning");
      return;
    }

    if (!usuarioSelecionado.CPF || !/^\d{11}$/.test(usuarioSelecionado.CPF)) {
      setMensagem("O CPF deve conter exatamente 11 dígitos numéricos.");
      setTipoMensagem("warning");
      return;
    }

    if (novaSenha) {
      if (novaSenha !== confirmarSenha) {
        setMensagem("As senhas não conferem.");
        setTipoMensagem("warning");
        return;
      }
      if (novaSenha.length < 5) {
        setMensagem("A nova senha deve ter pelo menos 5 caracteres.");
        setTipoMensagem("warning");
        return;
      }
    }

    const body = {
      nome: usuarioSelecionado.nome,
      CPF: usuarioSelecionado.CPF,
      email: usuarioSelecionado.email,
      senha: usuarioSelecionado.senhaHash,
      ativo: usuarioSelecionado.ativo,
      perfil_usuario: usuarioSelecionado.perfil_usuario,
      cidade: usuarioSelecionado.cidade,
    };

    if (novaSenha) {
      body.senha = novaSenha;
    }

    try {
      console.log("Enviando body para atualização:", body);
      await usuarioService.updateUsuario(usuarioSelecionado.ID_usuario, body);

      setMensagem("Usuário atualizado com sucesso!");
      setTipoMensagem("success");
      handleFecharEdit();
      fetchUsuarios();
      setNovaSenha('');
      setConfirmarSenha('');
      [refresh]

    } catch (error) {
      console.error("Erro ao atualizar o usuário:");
      setMensagem("Ocorreu um erro ao tentar atualizar. Tente novamente.");
      setTipoMensagem("error");
    } finally {
      setTimeout(() => {
        setMensagem(null);
        setTipoMensagem(null);
      }, 2000);
    }
  };

  const handleAbrirValidacoes = async () => {


    const dadosValidacoes = await validacaoService.getValidacoesPorUsuario(usuarioSelecionado!.ID_usuario!);
    console.log('Validações carregadas:', dadosValidacoes);
    setValidacoes(dadosValidacoes);

    setShowModalValidacoes(true);
  };

  const handleFecharValidacoes = () => {
    setShowModalValidacoes(false);
    setValidacoes([]);
  };


  const excluirUsuario = async () => {
    if (!usuarioParaDeletar?.ID_usuario) {
      console.error("ID do usuário não encontrado para exclusão.");
      return;
    }

    try {
      await usuarioService.deleteUsuario(usuarioParaDeletar.ID_usuario);

      setMensagem("Usuário DELETADO com sucesso!");
      setTipoMensagem("success");
      setRefresh(prev => !prev);

    } catch (error) {
      console.error("Erro ao excluir usuário");
      setMensagem("Erro ao excluir usuário. Tente novamente.");
      setTipoMensagem("error");
    } finally {
      handleFecharConfirm();
    }
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
        <h1 className="mb-4">Lista de Alunos </h1>

        <div className="d-flex justify-content-end mb-3">
          <Button href="create.aluno" className="mt-5 shadow">Adicionar Aluno</Button>
        </div>



        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>id</th>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Status</th>
              <th>Cidade</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              usuarios.map((u, index) => (
                <tr key={index}>
                  <td>{u.ID_usuario}</td>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td>{u.CPF}</td>
                  <td>
                    <span className={`badge fs-6 rounded-pill ms-2 bg-${u.ativo ? 'success' : 'danger'}`}>
                      {u.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td>{cidadeMap.get(u.cidade) || u.cidade}</td>
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
                      onClick={() => handleConfirmarExclusao(u)}                     >
                      <i className="bi bi-trash me-1"></i>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Modal show={showModalVer} onHide={handleFecharVer} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Detalhes do Aluno</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {usuarioSelecionado && (
              <Card className="shadow-sm border-0">
                <Card.Body>

                  <div className="d-flex align-items-center mb-4">
                    <i className="bi bi-person-circle fs-1 me-3 text-primary"></i>
                    <div>
                      <Card.Title as="h2" className="mb-0">{usuarioSelecionado.nome}</Card.Title>
                      <Card.Subtitle className="text-muted">
                        {perfilMap.get(usuarioSelecionado.perfil_usuario) ?? "Não Encontrado"}
                      </Card.Subtitle>
                    </div>
                  </div>

                  <hr />

                  <Row className="g-3">

                    <Col xs={12}>
                      <strong><i className="bi bi-envelope me-2"></i>E-mail:</strong>
                      <p className="ms-4 mb-0">{usuarioSelecionado.email}</p>
                    </Col>

                    <Col md={6} xs={12}>
                      <strong><i className="bi bi-file-earmark-text me-2"></i>CPF:</strong>
                      <p className="ms-4 mb-0">{usuarioSelecionado.CPF}</p>
                    </Col>

                    <Col md={6} xs={12}>
                      <strong><i className="bi bi-geo-alt me-2"></i>Cidade:</strong>
                      <p className="ms-4 mb-0">{cidadeMap.get(usuarioSelecionado.cidade) ?? "Não Encontrada"}</p>
                    </Col>

                    <Col md={6} xs={12}>
                      <strong><i className="bi bi-person-badge me-2"></i>Perfil:</strong>
                      <p className="ms-4 mb-0">{perfilMap.get(usuarioSelecionado.perfil_usuario) ?? "Não Encontrado"}</p>
                    </Col>

                    <Col md={6} xs={12}>
                      <strong><i className="bi bi-check-circle me-2"></i>Status:</strong>
                      <span className={`badge fs-6 rounded-pill ms-2 bg-${usuarioSelecionado.ativo ? 'success' : 'danger'}`}>
                        {usuarioSelecionado.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </Col>

                  </Row>

                </Card.Body>
              </Card>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleFecharVer}>
              Sair
            </Button>

            <Button variant="primary" onClick={handleAbrirValidacoes}>
              <i className="bi bi-check2-square me-2"></i> Ver Validações
            </Button>


          </Modal.Footer>
        </Modal>

        <Modal show={showModalEdit} onHide={handleFecharEdit} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Editar Aluno</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {usuarioSelecionado && (
              <Card className="shadow-sm border-0 p-3">
                <Card.Body>
                  <Form>
                    <Card.Title className="mb-3">Informações do Usuário</Card.Title>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nome</Form.Label>
                          <Form.Control
                            type="text"
                            value={usuarioSelecionado.nome}
                            onChange={(e) =>
                              setUsuarioSelecionado({
                                ...usuarioSelecionado,
                                nome: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={usuarioSelecionado.email}
                            onChange={(e) =>
                              setUsuarioSelecionado({
                                ...usuarioSelecionado,
                                email: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>CPF</Form.Label>
                          <Form.Control
                            type="text"
                            value={usuarioSelecionado.CPF}
                            onChange={(e) =>
                              setUsuarioSelecionado({
                                ...usuarioSelecionado,
                                CPF: e.target.value,
                              })
                            }
                            maxLength={11}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="d-flex align-items-center pt-4">
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            label="Ativo"
                            checked={usuarioSelecionado.ativo}
                            onChange={(e) =>
                              setUsuarioSelecionado({
                                ...usuarioSelecionado,
                                ativo: e.target.checked,
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Perfil</Form.Label>
                          <Form.Select
                            value={usuarioSelecionado.perfil_usuario}
                            onChange={(e) =>
                              setUsuarioSelecionado({
                                ...usuarioSelecionado,
                                perfil_usuario: Number(e.target.value),
                              })
                            }
                          >
                            <option value={"0"}>Selecione o perfil</option>
                            {perfis.map((perfil) => (
                              <option key={perfil.ID_perfil} value={perfil.ID_perfil.toString()}>
                                {perfil.nome}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Cidade</Form.Label>
                          <Form.Select
                            value={usuarioSelecionado.cidade}
                            onChange={(e) =>
                              setUsuarioSelecionado({
                                ...usuarioSelecionado,
                                cidade: Number(e.target.value),
                              })
                            }
                          >
                            <option value={"0"}>Selecione a cidade</option>
                            {cidades.map((cidade) => (
                              <option key={cidade.ID_cidade} value={cidade.ID_cidade.toString()}>
                                {cidade.nome}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <hr className="my-4" />

                    <Card.Title className="mb-3">Alterar Senha</Card.Title>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nova Senha (Opcional)</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Deixe em branco para não alterar"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirmar Nova Senha</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Repita a nova senha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            isInvalid={!!(novaSenha && confirmarSenha && novaSenha !== confirmarSenha)}
                          />
                          <Form.Control.Feedback type="invalid">
                            As senhas não conferem.
                          </Form.Control.Feedback>
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


        <Modal show={showModalConfirm} onHide={handleFecharConfirm} centered>
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Confirmação de Exclusão
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4">
            {usuarioParaDeletar && (
              <>
                <p className="lead">
                  Você tem certeza que deseja EXCLUIR o usuário:
                </p>
                <h4 className="text-danger text-center my-3">
                  {usuarioParaDeletar.nome} (ID: {usuarioParaDeletar.ID_usuario})
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
            <Button variant="danger" onClick={excluirUsuario}>
              <i className="bi bi-trash me-2"></i>
              Excluir Permanentemente
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 


        MODAL VER VALIDAÇÕES
        
        
        */}

        <Modal show={showModalValidacoes} onHide={handleFecharValidacoes} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Validações do Aluno: {usuarioSelecionado?.nome}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {validacoes.length === 0 ? (
              <p className="text-muted">Nenhuma validação encontrada para este Aluno.</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Viagem</th>
                    <th>Tipo</th>
                    <th>Parada</th>
                    <th>Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {validacoes.map((validacao, index) => (
                    <tr key={index}>
                      <td>{`${validacao.viagem?.nome} `}</td>
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

export default Aluno;
