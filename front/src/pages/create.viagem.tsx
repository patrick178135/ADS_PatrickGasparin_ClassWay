import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Toast, ToastContainer } from "react-bootstrap";
import router from "next/router";
import { useAuth } from "../context/AuthContext";
import paradaService from "../services/parada.service";
import cidadeService from "../services/cidade.service";
import rotaService from "../services/rota.service";
import Parada from "./create.parada";
import viagemService from "../services/viagem.service";
import usuarioService from "../services/usuario.service";
import veiculoService from "../services/veiculo.service";


type Viagem = {
    ID_viagem?: number;
    nome: string;
    data: string;
    admin: number;
    motorista: number;
    rota: number;
    veiculo: number;
    alunos: number[];
};

const Viagem = () => {
    const { usuario, loading, carregarUsuario } = useAuth();
    const [refresh, setRefresh] = useState(false);
    const [mensagem, setMensagem] = useState<string | null>(null);
    const [tipoMensagem, setTipoMensagem] = useState<"success" | "error" | "warning" | "info" | null>(null);
    const [admins, setAdmins] = useState<{ ID_usuario: number, nome: string }[]>([]);
    const [motoristas, setMotoristas] = useState<{ ID_usuario: number, nome: string }[]>([]);
    const [alunos, setAlunos] = useState<{ ID_usuario: number, nome: string }[]>([]);
    const [rotas, setRotas] = useState<{ ID_rota: number, nome: string }[]>([]);
    const [veiculos, setVeiculos] = useState<{ ID_veiculo: number, modelo: string }[]>([]);

    const [currentViagem, setCurrentViagem] = useState<Viagem>({
        nome: "",
        data: "",
        admin: 0,
        motorista: 0,
        rota: 0,
        veiculo: 0,
        alunos: [],
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
    
        setCurrentViagem(prev => ({
            ...prev,
            [name]:
                // A propriedade 'data' não está listada aqui, então ela cai no 'else' e é tratada como string (value), o que está CORRETO para datetime-local.
                name === "admin" || name === "motorista" || name === "rota" || name === "veiculo"
                    ? Number(value)
                    : value,
        }));
    }

    const handleAlunoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const alunoId = Number(event.target.value);
        const isChecked = event.target.checked;

        setCurrentViagem(prev => {
            const currentAlunos = prev.alunos || [];

            if (isChecked) {
                return {
                    ...prev,
                    alunos: [...currentAlunos, alunoId],
                };
            } else {
                return {
                    ...prev,
                    alunos: currentAlunos.filter(id => id !== alunoId),
                };
            }
        });
    };

    const addViagem = async () => {

        try {
            const resultado = await viagemService.addViagem(currentViagem);

            if (resultado.status === 201) {
                setMensagem("Viagem cadastrada com sucesso!");
                setTipoMensagem("success");
                setCurrentViagem({
                    nome: "",
                    data: "",
                    admin: 0,
                    motorista: 0,
                    rota: 0,
                    veiculo: 0,
                    alunos: [],
                });
                setRefresh(!refresh);
                irViagem();
            }
        } catch (error) {
            console.error("Erro ao adicionar Viagem:");
            setMensagem("Erro ao cadastrar Viagem. Tente novamente.");
            setTipoMensagem("error");
        } finally {
            setTimeout(() => {
                setMensagem(null);
                setTipoMensagem(null);
            }, 4000);
        }
    };

    const irViagem = () => {
        router.push("/viagem");
    }

    useEffect(() => {
        fetchAdmins();
        fetchMotoristas();
        fetchRotas();
        fetchVeiculos();
        fetchAlunos();
    }, []);

    const fetchAdmins = async () => {
        const resultado = await usuarioService.getAdmins();
        setAdmins(resultado);
    };


    const fetchMotoristas = async () => {
        const resultado = await usuarioService.getMotristas();
        setMotoristas(resultado);
    };

    const fetchRotas = async () => {
        const resultado = await rotaService.getRotas();
        setRotas(resultado);
    };

    const fetchVeiculos = async () => {
        const resultado = await veiculoService.getVeiculos();
        setVeiculos(resultado);
    };

    const fetchAlunos = async () => {
        const resultado = await usuarioService.getAlunos();
        setAlunos(resultado);
    };

    const handleCloseToast = () => {
        setMensagem(null);
        setTipoMensagem(null);
    };

    if (!usuario) {

        return <div> <a>Usuário não Logado</a> <a href="/login">Clique aqui para fazer Login</a></div>
    }
    if (usuario.perfil != 1) return <p>É preciso ser Administrador para acessar essa página</p>;


    return (
        <>
        <title>Cadastro Viagem</title>
        
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
                    <Button href="viagem">Voltar</Button>
                </div>

                <div className="d-flex justify-content-end">
                    {mensagem && tipoMensagem && (
                        <div className="mt-3">

                        </div>
                    )}
                </div>

                <Card className="shadow-lg p-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <Card.Header className="text-center">
                        <h2 className="mb-0">Cadastrar Viagem</h2>
                    </Card.Header>

                    <Card.Body>
                        <Form>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nome da Viagem:</Form.Label>
                                        <Form.Control
                                            id="nomeViagem"
                                            type="text"
                                            name="nome"
                                            value={currentViagem.nome}
                                            placeholder="Digite o nome da Viagem"
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Data e Hora da Viagem:</Form.Label>
                                            <Form.Control
                                                id="dataHora"
                                                type="datetime-local"
                                                name="data"
                                                value={currentViagem.data}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Administrador que criou a viagem:</Form.Label>
                                            <Form.Select
                                                name="admin"
                                                value={currentViagem.admin}
                                                onChange={handleChange}
                                            >
                                                <option value={0}>Selecione o Administrador</option>
                                                {admins.map((usuario) => (
                                                    <option key={usuario.ID_usuario} value={usuario.ID_usuario}>
                                                        {usuario.nome}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Motorista:</Form.Label>
                                            <Form.Select
                                                name="motorista"
                                                value={currentViagem.motorista}
                                                onChange={handleChange}
                                            >
                                                <option value={0}>Selecione o Motorista</option>
                                                {motoristas.map((usuario) => (
                                                    <option key={usuario.ID_usuario} value={usuario.ID_usuario}>
                                                        {usuario.nome}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Rota:</Form.Label>
                                            <Form.Select
                                                name="rota"
                                                value={currentViagem.rota}
                                                onChange={handleChange}
                                            >
                                                <option value={0}>Selecione a Rota</option>
                                                {rotas.map((rota) => (
                                                    <option key={rota.ID_rota} value={rota.ID_rota}>
                                                        {rota.nome}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Veículo:</Form.Label>
                                            <Form.Select
                                                name="veiculo"
                                                value={currentViagem.veiculo}
                                                onChange={handleChange}
                                            >
                                                <option value={0}>Selecione o Veículo</option>
                                                {veiculos.map((veiculo) => (
                                                    <option key={veiculo.ID_veiculo} value={veiculo.ID_veiculo}>
                                                        {veiculo.modelo}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Selecione os Alunos:</Form.Label>

                                            <Card className="p-3 border">
                                                {alunos.length === 0 ? (
                                                    <p className="text-muted mb-0">Nenhuma Aluno cadastrado.</p>
                                                ) : (
                                                    alunos.map((aluno) => (
                                                        <Form.Check
                                                            key={aluno.ID_usuario}
                                                            type="checkbox"
                                                            id={`aluno-${aluno.ID_usuario}`}
                                                            label={aluno.nome}
                                                            value={aluno.ID_usuario}
                                                            checked={currentViagem.alunos.includes(aluno.ID_usuario)}
                                                            onChange={handleAlunoChange}
                                                        />
                                                    ))
                                                )}
                                            </Card>

                                        </Form.Group>
                                    </Col>
                                </Row>

                            </Row>

                        </Form>
                    </Card.Body>

                    <Card.Footer className="text-end bg-white border-0">
                        <Button onClick={addViagem} id="salvarViagem" className="shadow">
                            Salvar
                        </Button>
                    </Card.Footer>
                </Card>

            </Container>
        </>

    );

};

export default Viagem;