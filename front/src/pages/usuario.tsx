import UsuarioService from "@/src/services/usuario.service";
import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  Table,
} from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

type Usuario = {
  ID_usuario?: number;
  nome: string;
  email: string;
  senhaHash: string;
  perfil_usuario: string;
};

const Usuarios = () => {
  const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([])
  const [showModal, setShowModal] = useState(false)
	const [refresh, setRefresh] = useState(false)
  const [currentUser, setCurrentUser] = useState<Usuario>({
    nome: "",
    email: "",
    senhaHash: "",
    perfil_usuario: "",
  });

  useEffect(() => {
    fetchUsuarios();
  }, [refresh]);

  const fetchUsuarios = async () => {
    const resultado = await UsuarioService.getUsuarios();
    setListaUsuarios(resultado);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setCurrentUser({
      ...currentUser,
      [name]: value,
    });
  };


  return (
    <Container className="mt-5 p-5">
      <h2 className="mb-4">
        Lista de Usuários
        <Button onClick={() => openModal()}>
          <FaPlus></FaPlus>
        </Button>
      </h2>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Senha</th>
            <th>Perfil</th>
          </tr>
        </thead>
        <tbody>
          {
					
					listaUsuarios.map((usuario: Usuario) => (
            <tr key={usuario.ID_usuario}>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>{usuario.senhaHash}</td>
              <td>{usuario.perfil_usuario}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Usuarios;
