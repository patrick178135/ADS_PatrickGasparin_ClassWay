import React, { useEffect, useState } from 'react';
import { Button, Container, Form, FormControl, FormGroup, FormLabel, Table, Image, Row, Col } from 'react-bootstrap';
import UsuarioService from '@/src/services/usuario.service';
import { useRouter } from 'next/router';
import { Leckerli_One } from 'next/font/google';

const leckerliOne = Leckerli_One({
  subsets: ['latin'],
  weight: '400',
});


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
  
    try {
      const response = await UsuarioService.login({
        email: currentUsuario.email,
        senha: currentUsuario.senha,
      });
  
      if (response && response.accessToken) {
        setSuccess(true);
        setError(null);
        localStorage.setItem('token', response.accessToken);
        router.push('/home');
      }
    } catch (err: any) {
      console.error("Erro ao fazer login:");
      setError("Credenciais inválidas");
      setSuccess(false);
    }
  };
  

  return (
    <>
    <title>Loign</title>
    
    <div className="row vh-100">
      <div
        className="col-12 col-md-8 d-flex align-items-top p-5 justify-content-center text-white text-center"
        style={{
          backgroundImage: "url('/img/Login.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div>
          <h1 className="display-4 fw-bold">Bem-vindo!</h1>
          <p className="lead">Acesse sua conta para continuar</p>
        </div>
      </div>

      <div className="col-12 col-md-4 d-flex align-items-center justify-content-center bg-light p-3">
        <div style={{ width: '100%', maxWidth: '400px' }} className="p-5 rounded-4 shadow">
          <h1 className={`text-center mb-4 text-primary ${leckerliOne.className}`}>ClassWay</h1>

          <Row>
            <Col className="bg-lightrounded-5">
              <Form onSubmit={handleLogin}>
                <FormGroup className="p-3">
                  <FormLabel className="text-dark ">Email:</FormLabel>
                  <FormControl
                    className='shadow'
                    id='input_login_email'
                    type="text"
                    name="email"
                    value={currentUsuario.email}
                    placeholder="Digite o email do Usuário"
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup className="p-3">
                  <FormLabel className="text-dark">Senha:</FormLabel>
                  <FormControl
                    className='shadow'
                    id='input_login_senha'
                    type="password"
                    name="senha"
                    value={currentUsuario.senha}
                    placeholder="Digite a senha do Usuário"
                    onChange={handleChange}
                  />
                </FormGroup>
                <Container className="p-3">
                  <Button type="submit" className="d-grid gap-2 col-6 mx-auto" id="entrar">
                    Entrar
                  </Button>
                </Container>
                {error && <div className="text-danger text-center">{error}</div>}
                {success && <div className="text-success text-center">Login bem-sucedido!</div>}
              </Form>
              <Container className="text-center p-2">
                <a href="#" className="text-dark">Esqueceu a senha?</a>
              </Container>
            </Col>
          </Row>

          <div className="d-flex justify-content-around p-3">
            <Button className="btn btn-light w-100" href="usuario">
              Lista de Usuários
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};


export default Login;