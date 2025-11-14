import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Toast, ToastContainer } from "react-bootstrap";
import { Alert, AlertTitle } from "@mui/material";
import perfilService from "../services/perfil.service";
import router from "next/router";
import cidadeService from "../services/cidade.service";
import { useAuth } from "../context/AuthContext";

type Cidade = {
  nome: string;
  UF: string;
};

const Cidade = () => {


  const { usuario, loading, carregarUsuario } = useAuth();
  const [refresh, setRefresh] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [tipoMensagem, setTipoMensagem] = useState<"success" | "error" | "warning" | "info" | null>(null);

  const [currentCidade, setCurrentCidade] = useState<Cidade>({
    nome: "",
    UF: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setCurrentCidade({
      ...currentCidade,
      [name]: value
    });
  };

  const addCidade = async () => {

    if (currentCidade.UF.length !== 2) {
      setMensagem("Campo UF inválido.");
      setTipoMensagem("warning");
      return;
    }

    try {
      const resultado = await cidadeService.addCidade(currentCidade);
      console.log(resultado);

      if (resultado.status === 201) {
        setMensagem("Cidade cadastrada com sucesso!");
        setTipoMensagem("success");

        setCurrentCidade({
          nome: "",
          UF: "",
        });
        router.push("/aluno");
      }
    } catch (error) {
      console.error("Erro ao adicionar cidade:");
      setMensagem("Erro ao cadastrar cidade. Tente novamente.");
      setTipoMensagem("error");
    } finally {
      setTimeout(() => {
        setMensagem(null);
        setTipoMensagem(null);
      }, 4000);
    }
  };

  if (!usuario) {

    return <div> <a>Usuário não Logado</a> <a href="/login">Clique aqui para fazer Login</a></div>
  }
  if (usuario.perfil != 1) return <p>É preciso ser Administrador para acessar essa página</p>;

  const handleCloseToast = () => {
    setMensagem(null);
    setTipoMensagem(null);
  };

  return (
    <>
    <title>Cadastro cidade</title>
    
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
        <Button href="cidade">Voltar</Button>
      </div>

      <div className="d-flex justify-content-end">
        {mensagem && tipoMensagem && (
          <div className="mt-3">

          </div>
        )}
      </div>

      <Card className="shadow-lg p-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card.Header className="text-center">
          <h2 className="mb-0">Cadastrar Cidade</h2>
        </Card.Header>

        <Card.Body>
          <Form>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome:</Form.Label>
                  <Form.Control
                    id="nomeCidade"
                    type="text"
                    name="nome"
                    value={currentCidade.nome}
                    placeholder="Digite o nome da Cidade"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
              <Form.Group className="mb-3">
                  <Form.Label>UF:</Form.Label>
                  <Form.Control
                    id="ufCidade"
                    type="text"
                    name="UF"
                    value={currentCidade.UF}
                    placeholder="Digite a UF"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

          </Form>
        </Card.Body>

        <Card.Footer className="text-end bg-white border-0">
          <Button onClick={addCidade} id="salvarCidade" className="shadow">
            Salvar
          </Button>
        </Card.Footer>
      </Card>

    </Container>
  </>
  );
};

export default Cidade;