import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Toast, ToastContainer } from "react-bootstrap";
import { Alert, AlertTitle } from "@mui/material";
import usuarioService from "../services/usuario.service";
import cidadeService from "../services/cidade.service";
import perfilService from "../services/perfil.service";
import router from "next/router";
import { useAuth } from "../context/AuthContext";

type Usuario = {
  nome: string;
  email: string;
  CPF: string;
  senha: string;
  ativo: boolean;
  perfil_usuario: number;
  cidade: number;
};

const Usuarios = () => {
  const { usuario, loading, carregarUsuario } = useAuth();
  const [refresh, setRefresh] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [tipoMensagem, setTipoMensagem] = useState<"success" | "error" | "warning" | "info" | null>(null);
  const [perfis, setPerfis] = useState<{ ID_perfil: number, nome: string }[]>([]);
  const [cidades, setCidades] = useState<{ ID_cidade: number, nome: string }[]>([]);

  const [currentUsuario, setCurrentUsuario] = useState<Usuario>({
    nome: "",
    email: "",
    CPF: "",
    senha: "",
    ativo: true,
    perfil_usuario: 0,
    cidade: 0,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setCurrentUsuario({
      ...currentUsuario,
      [name]:
        name === "perfil_usuario" || name === "cidade"
          ? Number(value)
          : value,
    });
  };

  const addUsuario = async () => {
    if (currentUsuario.senha.length < 5) {
      setMensagem("A senha deve ter no mínimo 5 caracteres.");
      setTipoMensagem("warning");
      return;
    }

    if (!currentUsuario.email.includes("@")) {
      setMensagem("Digite um email válido.");
      setTipoMensagem("warning");
      return;
    }

    if (currentUsuario.CPF.length !== 11) {
      setMensagem("O CPF deve ter exatamente 11 dígitos.");
      setTipoMensagem("warning");
      return;
    }

    if (!/^\d{11}$/.test(currentUsuario.CPF)) {
      setMensagem("O CPF deve conter exatamente 11 dígitos numéricos.");
      setTipoMensagem("warning");
      return;
    }

    try {
      const resultado = await usuarioService.addUsuario(currentUsuario);
      console.log(resultado);

      if (resultado.status === 201) {
        setMensagem("Usuário cadastrado com sucesso!");
        setTipoMensagem("success");
        setCurrentUsuario({
          nome: "",
          email: "",
          CPF: "",
          senha: "",
          ativo: true,
          perfil_usuario: 0,
          cidade: 0,
        });
        setRefresh(!refresh);
        irUsuario();
      }
    } catch (error) {
      console.error("Erro ao adicionar usuário:");
      setMensagem("Erro ao cadastrar usuário. Tente novamente.");
      setTipoMensagem("error");
    } finally {
      setTimeout(() => {
        setMensagem(null);
        setTipoMensagem(null);
      }, 4000);
    }
  };

  useEffect(() => {
    fetchPerfis();
    fetchCidades();
  }, []);

  const fetchPerfis = async () => {
    const resultado = await perfilService.getPerfis();
    setPerfis(resultado);
  };

  const fetchCidades = async () => {
    const resultado = await cidadeService.getCidades();
    setCidades(resultado);
  };

  const irUsuario = () => {
    router.push("/usuario");
  }


  const handleCloseToast = () => {
    setMensagem(null);
    setTipoMensagem(null);
  };



  if (!usuario) {

    return <div> <a>Usuário não Logado</a> <a href="/login">Clique aqui para fazer Login</a></div>
  }
  if (usuario.perfil != 1) return <p>É preciso ser Administrador para acessar essa página</p>;


  return (
    <>
    <title>Cadastro Usuário</title>
    
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

      <Container className="mt-5">

        <div className="d-flex justify-content-start mb-4">
          <Button href="aluno">Voltar</Button>
        </div>

        <div className="d-flex justify-content-end">
          {mensagem && tipoMensagem && (
            <div className="mt-3">

            </div>
          )}
        </div>

        <Card className="shadow-lg p-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Card.Header className="text-center">
            <h2 className="mb-0">Cadastrar Usuário</h2>
          </Card.Header>

          <Card.Body>
            <Form>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome:</Form.Label>
                    <Form.Control
                      id="nomeUsuario"
                      type="text"
                      name="nome"
                      value={currentUsuario.nome}
                      placeholder="Digite o nome do Usuário"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                      id="emailUsuario"
                      type="email"
                      name="email"
                      value={currentUsuario.email}
                      placeholder="Digite o email do Usuário"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>CPF:</Form.Label>
                    <Form.Control
                      id="CPFUsuario"
                      type="text"
                      name="CPF"
                      value={currentUsuario.CPF}
                      placeholder="Digite o CPF do Usuário"
                      onChange={handleChange}
                      maxLength={11}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Senha:</Form.Label>
                    <Form.Control
                      id="senhaUsuario"
                      type="password"
                      name="senha"
                      value={currentUsuario.senha}
                      placeholder="Digite uma senha para o Usuário"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Perfil:</Form.Label>
                    <Form.Select
                      name="perfil_usuario"
                      value={currentUsuario.perfil_usuario}
                      onChange={handleChange}
                    >
                      <option value={0}>Selecione o perfil</option>
                      {perfis.map((perfil) => (
                        <option key={perfil.ID_perfil} value={perfil.ID_perfil}>
                          {perfil.nome}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cidade:</Form.Label>
                    <Form.Select
                      name="cidade"
                      value={currentUsuario.cidade}
                      onChange={handleChange}
                    >
                      <option value={0}>Selecione a cidade</option>
                      {cidades.map((cidade) => (
                        <option key={cidade.ID_cidade} value={cidade.ID_cidade}>
                          {cidade.nome}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="ativoUsuario"
                      name="ativo"
                      checked={currentUsuario.ativo}
                      label="Usuário ativo"
                      onChange={(e) =>
                        setCurrentUsuario({ ...currentUsuario, ativo: e.target.checked })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

            </Form>
          </Card.Body>

          <Card.Footer className="text-end bg-white border-0">
            <Button onClick={addUsuario} id="salvarAluno" className="shadow">
              Salvar
            </Button>
          </Card.Footer>
        </Card>

      </Container>
    </>

  );

};

export default Usuarios;