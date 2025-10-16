import React, { useEffect, useState } from 'react';
import { Button, Container, Form, FormControl, FormGroup, FormLabel, Table, Image, Row, Col } from 'react-bootstrap';
import UsuarioService from '@/src/services/usuario.service';
import { useRouter } from 'next/router';

const Login = () => {
  type Usuario = {
    ID_usuario?: number;
    nome: string;
    email: string;
    senha: string;
  };


  const [listaUsuario, setListaUsuarios] = useState<Usuario[]>([]);
  const [currentUsuario, setCurrentUsuario] = useState<Usuario>({
    nome: "",
    email: "",
    senha: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);


  useEffect(() => {
    fetchUsuarios();
  }, []);


  const router = useRouter();


  const fetchUsuarios = async () => {
    const resultado = await UsuarioService.getUsuarios();
    setListaUsuarios(resultado);
  };


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentUsuario({
      ...currentUsuario,
      [name]: value,
    });
  };


  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    const user = listaUsuario.find(
      (usuario) =>
        usuario.email === currentUsuario.email &&
        usuario.senha === currentUsuario.senha
    );

    const response = await UsuarioService.login({
      email: currentUsuario.email,
      senha: currentUsuario.senha,
    });
    
    if (response.accessToken) {
      localStorage.setItem('token', response.accessToken);
      router.push('/dashboard');
    }

  };


  return (
    <Container style={{ width: '500px' }} className='p-5 bg-secondary'>
      <h1 className="d-flex justify-content-center text-light">Entrar</h1>


      <Row>
        <Col className='bg-dark rounded-5'>
          <Form onSubmit={handleLogin}>
            <FormGroup className="p-3">
              <FormLabel className="text-light">Email:</FormLabel>
              <FormControl
                id='input_login_email'
                type="text"
                name="email"
                value={currentUsuario.email}
                placeholder="Digite o email do Usuário"
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup className="p-3">
              <FormLabel className="text-light">Senha:</FormLabel>
              <FormControl
                id='input_login_senha'
                type="password"
                name="senha"
                value={currentUsuario.senha}
                placeholder="Digite a senha do Usuário"
                onChange={handleChange}
              />
            </FormGroup>
            <Container className='p-3'>
              <Button type="submit" className='d-grid gap-2 col-6 mx-auto' id='entrar'> Entrar </Button>
            </Container>
            {error && <div className="text-danger">{error}</div>}
            {success && <div className="text-success">Login bem-sucedido!</div>}
          </Form>
          <Container className='text-center p-2'>
            <a href='' className='mx-auto text-light'> Esqueceu a senha? </a>
          </Container>
        </Col>
      </Row>
      <div className="d-flex justify-content-around p-3 ">
        <Button className="btn btn-light w-100" href="usuario">
          Lista de Usuarios
        </Button>
      </div>
    </Container>
  );
};


export default Login;