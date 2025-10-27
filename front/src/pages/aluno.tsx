import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import usuarioService from "../services/usuario.service";
import { Table, Spinner, Container, Button, Modal, Form } from "react-bootstrap";
import perfilService from "../services/perfil.service";
import cidadeService from "../services/cidade.service";
import { Alert, AlertTitle } from "@mui/material";

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
  const [currentUsuario, setCurrentUsuario] = useState<Usuario>({
    nome: "",
    email: "",
    CPF: "",
    senhaHash: "",
    ativo: true,
    perfil_usuario: 0,
    cidade: 0,
  });


  const [showModalVer, setShowModalVer] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

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
      console.error("Erro ao buscar cidades:", error);
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
      console.error("Erro ao buscar perfis:", error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const dados = await usuarioService.getAlunos();
      setUsuarios(dados);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
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
  
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      setMensagem("Ocorreu um erro ao tentar atualizar. Tente novamente.");
      setTipoMensagem("error");
    }
  };
  

  const excluirUsuario = async (usuarioParaExcluir: Usuario) => {
    if (!usuarioParaExcluir.ID_usuario) {
      console.error("ID do usuário não encontrado para exclusão.");
      return;
    }

    try {
      const resultado = await usuarioService.deleteUsuario(usuarioParaExcluir.ID_usuario);
      setRefresh(!refresh)

    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };


  if (loadingAuth) return <Spinner animation="border" />;
  if (!usuario) return <p>Usuário não logado</p>;
  if (loading) return <Spinner animation="border" />;

  return (
    <Container className="mt-5 rounded-4 shadow">
      <div className="d-flex justify-content-end mb-3">
        <Button href="create.usuario" className="mt-5 shadow">Adicionar Aluno</Button>
      </div>

      <h1 className="mb-4">Lista de Alunos</h1>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Ativo</th>
            <th>Perfil</th>
            <th>Cidade</th>
            <th>Ações</th>
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
                <td>{u.ativo ? "Sim" : "Não"}</td>
                <td>{perfilMap.get(u.perfil_usuario) || u.perfil_usuario}</td>
                <td>{cidadeMap.get(u.cidade) || u.cidade}</td>
                <td>
                  <Button
                    className="m-1 shadow"
                    variant="warning"
                    size="sm"
                    onClick={() => handleEditar(u)}
                  >
                    <i className="bi bi-pencil me-1"></i> Editar
                  </Button>

                  <Button
                    className="m-1 shadow"
                    variant="primary"
                    size="sm"
                    onClick={() => handleVer(u)}
                  >
                    <i className="bi bi-eye me-1"></i> Ver
                  </Button>

                  <Button
                    className="m-1 shadow"
                    variant="danger"
                    size="sm"
                    onClick={() => excluirUsuario(u)}
                  >
                    <i className="bi bi-trash me-1"></i> Excluir
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModalVer} onHide={handleFecharVer}>
        <Modal.Header closeButton>
          <Modal.Title>Aluno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {usuarioSelecionado && (
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={usuarioSelecionado.nome}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={usuarioSelecionado.email}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>CPF</Form.Label>
                <Form.Control
                  type="text"
                  value={usuarioSelecionado.CPF}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Check
                  type="checkbox"
                  label="Ativo"
                  checked={usuarioSelecionado.ativo}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Perfil</Form.Label>
                <Form.Control
                  value={perfilMap.get(usuarioSelecionado.perfil_usuario) ?? "Não Encontrado"}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Cidade</Form.Label>
                <Form.Control
                  value={cidadeMap.get(usuarioSelecionado.cidade) ?? "Não Encontrado"}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFecharVer}>
            Sair
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalEdit} onHide={handleFecharEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Aluno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content">
            {mensagem && tipoMensagem && (
              <div className="mt-3">
                <Alert severity={tipoMensagem}>
                  <AlertTitle>
                    {tipoMensagem === "success" && "Sucesso"}
                    {tipoMensagem === "info" && "Informação"}
                    {tipoMensagem === "warning" && "Atenção"}
                    {tipoMensagem === "error" && "Erro"}
                  </AlertTitle>
                  {mensagem}
                </Alert>
              </div>
            )}
          </div>
          {usuarioSelecionado && (
            <Form>
              <Form.Group className="mb-2">
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

              <Form.Group className="mb-2">
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

              <Form.Group className="mb-2">
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

              <Form.Group className="mb-2">
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

              <Form.Group className="mb-2">
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

              <Form.Group className="mb-2">
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

              <Form.Group className="mb-2">
                <Form.Label>Nova Senha (Opcional)</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Deixe em branco para não alterar"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-2">
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
            </Form>
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
    </Container>
  );
};

export default Aluno;
