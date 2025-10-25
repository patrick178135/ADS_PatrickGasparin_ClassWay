import { useEffect, useState } from "react";
import { Button, Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { Alert, AlertTitle } from "@mui/material";
import perfilService from "../services/perfil.service";
import router from "next/router";

type Perfil = {
  nome: string;
};

const Perfil = () => {
  const [refresh, setRefresh] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [tipoMensagem, setTipoMensagem] = useState<"success" | "error" | "warning" | "info" | null>(null);

  const [currentPerfil, setCurrentPerfil] = useState<Perfil>({
    nome: "",
  });

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
      console.error("Erro ao adicionar perfil:", error);
      setMensagem("Erro ao cadastrar perfil. Tente novamente.");
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
            id="nomePerfil"
            type="text"
            name="nome"
            value={currentPerfil.nome}
            placeholder="Digite o nome do Perfil"
            onChange={handleChange}
          />
        </FormGroup>

        <div className="d-flex justify-content-end p-2">
          <Button onClick={addPerfil} id="salvarCidade">
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

export default Perfil;