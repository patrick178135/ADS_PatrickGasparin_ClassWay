import { useEffect, useState } from "react";
import { Button, Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
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

  if (!usuario) {

    return <div> <a>Usuário não Logado</a> <a href="/login">Clique aqui para fazer Login</a></div>
  }

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
      console.error("Erro ao adicionar cidade:", error);
      setMensagem("Erro ao cadastrar cidade. Tente novamente.");
      setTipoMensagem("error");
    } finally {
      setTimeout(() => {
        setMensagem(null);
        setTipoMensagem(null);
      }, 4000);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-start">
        <Button href="#">Voltar</Button>
      </div>

      <div className="d-flex justify-content-center">
        <h2>Cadastrar Perfil</h2>
      </div>

      <Form>
        <FormGroup className="p-2">
          <FormLabel className="text-white">Nome:</FormLabel>
          <FormControl
            id="nomeCidade"
            type="text"
            name="nome"
            value={currentCidade.nome}
            placeholder="Digite o nome da Cidade"
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="p-2">
          <FormLabel className="text-white">UF:</FormLabel>
          <FormControl
            id="UF"
            type="text"
            name="UF"
            value={currentCidade.UF}
            placeholder="Digite a UF"
            onChange={handleChange}
          />
        </FormGroup>


        <div className="d-flex justify-content-end p-2">
          <Button onClick={addCidade} id="salvarCidade">
            Salvar
          </Button>
        </div>
      </Form>

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
  );
};

export default Cidade;