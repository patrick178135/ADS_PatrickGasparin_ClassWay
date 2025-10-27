import UsuarioService from "@/src/services/usuario.service";
import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
} from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

type Usuario = {
  ID_usuario?: number;
  nome: string;
  email: string;
  senhaHash: string;
};

const Usuarios = () => {
  const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([])
	const [refresh, setRefresh] = useState(false)


  useEffect(() => {
    fetchUsuarios();
  }, [refresh]);

  const fetchUsuarios = async () => {
    const resultado = await UsuarioService.getUsuarios();
    setListaUsuarios(resultado);
  };

  return (
    <Container className="mt-5 p-5">
      <h2 className="mb-4">
        Lista de Usuários
      </h2>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {
					
					listaUsuarios.map((usuario: Usuario) => (
            <tr key={usuario.ID_usuario}>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Usuarios;
