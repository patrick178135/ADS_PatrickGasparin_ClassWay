import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import usuarioService from "../services/usuario.service";
import { Table, Spinner, Container, Button, Modal, Form } from "react-bootstrap";

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
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);

  useEffect(() => {
    carregarUsuario();
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const dados = await usuarioService.getUsuarios();
      setUsuarios(dados);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal
  const handleEditar = (user: Usuario) => {
    setUsuarioSelecionado(user);
    setShowModal(true);
  };

  // Fechar modal
  const handleFechar = () => {
    setShowModal(false);
    setUsuarioSelecionado(null);
  };

  // Atualizar usuário
  const handleSalvar = async () => {
    if (!usuarioSelecionado?.ID_usuario) {
      console.log("chegou aqui:");
      return;
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
  
    try {
      console.log("Enviando body:", body);
      await usuarioService.updateUsuario(usuarioSelecionado.ID_usuario, body);
      handleFechar();
      fetchUsuarios();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };
  

  if (loadingAuth) return <Spinner animation="border" />;
  if (!usuario) return <p>Usuário não logado</p>;
  if (loading) return <Spinner animation="border" />;

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-start mb-3">
        <Button href="create.usuario">Adicionar Aluno</Button>
      </div>

      <h1 className="mb-4">Lista de Usuários</h1>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
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
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>{u.CPF}</td>
                <td>{u.ativo ? "Sim" : "Não"}</td>
                <td>{u.perfil_usuario}</td>
                <td>{u.cidade}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEditar(u)}
                  >
                    Editar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleFechar}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="string"
                  value={usuarioSelecionado.senhaHash}
                  onChange={(e) =>
                    setUsuarioSelecionado({
                      ...usuarioSelecionado,
                      senhaHash: e.target.value,
                    })
                  }
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
                <Form.Control
                  type="number"
                  value={usuarioSelecionado.perfil_usuario}
                  onChange={(e) =>
                    setUsuarioSelecionado({
                      ...usuarioSelecionado,
                      perfil_usuario: Number(e.target.value),
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Cidade</Form.Label>
                <Form.Control
                  type="number"
                  value={usuarioSelecionado.cidade}
                  onChange={(e) =>
                    setUsuarioSelecionado({
                      ...usuarioSelecionado,
                      cidade: Number(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFechar}>
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
