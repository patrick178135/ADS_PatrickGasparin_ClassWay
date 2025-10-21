import { useState } from "react";
import { Button, Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { Alert, AlertTitle } from "@mui/material";
import usuarioService from "../services/usuario.service";

type Usuario = {
  nome: string;
  email: string;
  CPF: string; // string para manter zeros à esquerda
  senha: string;
  ativo: boolean;
  perfil_usuario: number;
  cidade: number;
};

const Usuarios = () => {
  const [refresh, setRefresh] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [tipoMensagem, setTipoMensagem] = useState<"success" | "error" | "warning" | "info" | null>(null);

  const [currentUsuario, setCurrentUsuario] = useState<Usuario>({
    nome: "",
    email: "",
    CPF: "",
    senha: "",
    ativo: true,
    perfil_usuario: 0,
    cidade: 0,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    // 🔎 Validações de campos
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
      }
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      setMensagem("Erro ao cadastrar usuário. Tente novamente.");
      setTipoMensagem("error");
    } finally {
      // 🕒 Faz o alerta sumir automaticamente após 4 segundos
      setTimeout(() => {
        setMensagem(null);
        setTipoMensagem(null);
      }, 4000);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-start">
        <Button href="aluno">Voltar</Button>
      </div>

      <div className="d-flex justify-content-center">
        <h2>Cadastrar Usuário</h2>
      </div>

      <Form>
        <FormGroup className="p-2">
          <FormLabel className="text-white">Nome:</FormLabel>
          <FormControl
            id="nomeUsuario"
            type="text"
            name="nome"
            value={currentUsuario.nome}
            placeholder="Digite o nome do Usuário"
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="p-2">
          <FormLabel className="text-white">Email:</FormLabel>
          <FormControl
            id="emailUsuario"
            type="email"
            name="email"
            value={currentUsuario.email}
            placeholder="Digite o email do Usuário"
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="p-2">
          <FormLabel className="text-white">CPF:</FormLabel>
          <FormControl
            id="CPFUsuario"
            type="text"
            name="CPF"
            value={currentUsuario.CPF}
            placeholder="Digite o CPF do Usuário"
            onChange={handleChange}
            maxLength={11}
          />
        </FormGroup>

        <FormGroup className="p-2">
          <FormLabel className="text-white">Senha:</FormLabel>
          <FormControl
            id="senhaUsuario"
            type="password"
            name="senha"
            value={currentUsuario.senha}
            placeholder="Digite uma senha para o Usuário"
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="p-2">
          <FormLabel className="text-white">Ativo:</FormLabel>
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
        </FormGroup>

        <FormGroup className="p-2">
          <FormLabel className="text-white">Perfil:</FormLabel>
          <FormControl
            id="perfilUsuario"
            type="number"
            name="perfil_usuario"
            value={currentUsuario.perfil_usuario}
            placeholder="Digite o ID do perfil"
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="p-2">
          <FormLabel className="text-white">Cidade:</FormLabel>
          <FormControl
            id="cidadeUsuario"
            type="number"
            name="cidade"
            value={currentUsuario.cidade}
            placeholder="Digite o ID da cidade"
            onChange={handleChange}
          />
        </FormGroup>

        <div className="d-flex justify-content-end p-2">
          <Button onClick={addUsuario} id="salvarAluno">
            Salvar
          </Button>
        </div>
      </Form>

      {/* 🟢 ALERTAS MUI */}
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

export default Usuarios;
