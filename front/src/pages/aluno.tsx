import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import usuarioService from "../services/usuario.service";
import { Table, Spinner, Container, Button } from "react-bootstrap";

type Usuario = {
  nome: string;
  email: string;
  CPF: string;
  senha: string;
  ativo: boolean;
  perfil_usuario: number;
  cidade: number;
};

const Aluno = () => {
  const { usuario, loading: loadingAuth, carregarUsuario } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega o usuário logado
  useEffect(() => {
    carregarUsuario();
  }, []);

  // Carrega todos os usuários
  useEffect(() => {
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
    fetchUsuarios();
  }, []);

  if (loadingAuth) return <Spinner animation="border" />; 
  if (!usuario) return <p>Usuário não logado</p>;
  if (loading) return <Spinner animation="border" />;

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-start">
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
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
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
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Aluno;
