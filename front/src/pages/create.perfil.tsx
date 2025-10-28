import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Toast, ToastContainer } from "react-bootstrap";
import { Alert, AlertTitle } from "@mui/material";
import perfilService from "../services/perfil.service";
import router from "next/router";
import { useAuth } from "../context/AuthContext";

type Perfil = {
  nome: string;
};

const Perfil = () => {
  const { usuario, loading, carregarUsuario } = useAuth();
  const [refresh, setRefresh] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [tipoMensagem, setTipoMensagem] = useState<"success" | "error" | "warning" | "info" | null>(null);

  const [currentPerfil, setCurrentPerfil] = useState<Perfil>({
    nome: "",
  });

  if (!usuario) {

    return <div> <a>Usuário não Logado</a> <a href="/login">Clique aqui para fazer Login</a></div>
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setCurrentPerfil({
      ...currentPerfil,
      [name]: value
    });
  };

  const addPerfil = async () => {

    try {
      const resultado = await perfilService.addPerfil(currentPerfil);
      console.log(resultado);

      if (resultado.status === 201) {
        setMensagem("Perfil cadastrado com sucesso!");
        setTipoMensagem("success");

        setCurrentPerfil({
          nome: "",
        });
        router.push("/aluno");
      }
    } catch (error) {
      console.error("Erro ao adicionar perfil:");
      setMensagem("Erro ao cadastrar perfil. Tente novamente.");
      setTipoMensagem("error");
    } finally {
      setTimeout(() => {
        setMensagem(null);
        setTipoMensagem(null);
      }, 4000);
    }
  };

  const handleCloseToast = () => {
    setMensagem(null);
    setTipoMensagem(null);
  };


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

    <Container className="mt-5">

      <div className="d-flex justify-content-start mb-4">
        <Button href="perfil">Voltar</Button>
      </div>

      <div className="d-flex justify-content-end">
        {mensagem && tipoMensagem && (
          <div className="mt-3">

          </div>
        )}
      </div>

      <Card className="shadow-lg p-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card.Header className="text-center">
          <h2 className="mb-0">Cadastrar Perfil</h2>
        </Card.Header>

        <Card.Body>
          <Form>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome:</Form.Label>
                  <Form.Control
                    id="nomePerfil"
                    type="text"
                    name="nome"
                    value={currentPerfil.nome}
                    placeholder="Digite o nome do Perfil"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

          </Form>
        </Card.Body>

        <Card.Footer className="text-end bg-white border-0">
          <Button onClick={addPerfil} id="salvarPerfil" className="shadow">
            Salvar
          </Button>
        </Card.Footer>
      </Card>

    </Container>
  </>
  );
};

export default Perfil;