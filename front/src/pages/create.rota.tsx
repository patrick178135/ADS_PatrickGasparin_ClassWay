import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Toast, ToastContainer } from "react-bootstrap";
import router from "next/router";
import { useAuth } from "../context/AuthContext";
import paradaService from "../services/parada.service";
import cidadeService from "../services/cidade.service";
import rotaService from "../services/rota.service";
import Parada from "./create.parada";


type Rota = {
    nome: string;
    partida: number;
    destino: number;
    paradas: number[];
};

const Rota = () => {
    const { usuario, loading, carregarUsuario } = useAuth();
    const [refresh, setRefresh] = useState(false);
    const [mensagem, setMensagem] = useState<string | null>(null);
    const [tipoMensagem, setTipoMensagem] = useState<"success" | "error" | "warning" | "info" | null>(null);
    const [cidades, setCidades] = useState<{ ID_cidade: number, nome: string }[]>([]);
    const [paradas, setParadas] = useState<{ ID_parada: number, nome: string }[]>([]);

    const [currentRota, setCurrentRota] = useState<Rota>({
        nome: "",
        partida: 0,
        destino: 0,
        paradas: []
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setCurrentRota(prev => ({
            ...prev,
            [name]:
                name === "partida" || name === "destino"
                    ? Number(value)
                    : value,
        }));
    }

    const handleParadaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const paradaId = Number(event.target.value);
        const isChecked = event.target.checked;

        setCurrentRota(prev => {
            const currentParadas = prev.paradas || [];

            if (isChecked) {
                return {
                    ...prev,
                    paradas: [...currentParadas, paradaId],
                };
            } else {
                return {
                    ...prev,
                    paradas: currentParadas.filter(id => id !== paradaId),
                };
            }
        });
    };

    const addRota = async () => {
        console.log(currentRota)

        try {
            const resultado = await rotaService.addRota(currentRota);
            console.log(resultado);

            if (resultado.status === 201) {
                setMensagem("Rota cadastrada com sucesso!");
                setTipoMensagem("success");
                setCurrentRota({
                    nome: "",
                    partida: 0,
                    destino: 0,
                    paradas: []
                });
                setRefresh(!refresh);
                irRota();
            }
        } catch (error) {
            console.error("Erro ao adicionar Rota:");
            setMensagem("Erro ao cadastrar Rota. Tente novamente.");
            setTipoMensagem("error");
        } finally {
            setTimeout(() => {
                setMensagem(null);
                setTipoMensagem(null);
            }, 4000);
        }
    };

    const irRota = () => {
        router.push("/rota");
    }

    useEffect(() => {
        fetchCidades();
        fetchParadas();
    }, []);

    const fetchCidades = async () => {
        const resultado = await cidadeService.getCidades();
        setCidades(resultado);
    };


    const fetchParadas = async () => {
        const resultado = await paradaService.getParadas();
        setParadas(resultado);
    };

    const handleCloseToast = () => {
        setMensagem(null);
        setTipoMensagem(null);
    };

    if (!usuario) {

        return <div> <a>Usuário não Logado</a> <a href="/login">Clique aqui para fazer Login</a></div>
    }

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
                    <Button href="rota">Voltar</Button>
                </div>

                <div className="d-flex justify-content-end">
                    {mensagem && tipoMensagem && (
                        <div className="mt-3">

                        </div>
                    )}
                </div>

                <Card className="shadow-lg p-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <Card.Header className="text-center">
                        <h2 className="mb-0">Cadastrar Rota</h2>
                    </Card.Header>

                    <Card.Body>
                        <Form>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nome da Rota:</Form.Label>
                                        <Form.Control
                                            id="nomeRota"
                                            type="text"
                                            name="nome"
                                            value={currentRota.nome}
                                            placeholder="Digite o nome da Rota"
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Cidade de Partida:</Form.Label>
                                            <Form.Select
                                                name="partida"
                                                value={currentRota.partida}
                                                onChange={handleChange}
                                            >
                                                <option value={0}>Selecione a cidade</option>
                                                {cidades.map((cidade) => (
                                                    <option key={cidade.ID_cidade} value={cidade.ID_cidade}>
                                                        {cidade.nome}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Cidade de Destino:</Form.Label>
                                            <Form.Select
                                                name="destino"
                                                value={currentRota.destino}
                                                onChange={handleChange}
                                            >
                                                <option value={0}>Selecione a cidade</option>
                                                {cidades.map((cidade) => (
                                                    <option key={cidade.ID_cidade} value={cidade.ID_cidade}>
                                                        {cidade.nome}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Selecione as paradas:</Form.Label>

                                            <Card className="p-3 border">
                                                {paradas.length === 0 ? (
                                                    <p className="text-muted mb-0">Nenhuma parada cadastrada.</p>
                                                ) : (
                                                    paradas.map((parada) => (
                                                        <Form.Check
                                                            key={parada.ID_parada}
                                                            type="checkbox"
                                                            id={`parada-${parada.ID_parada}`}
                                                            label={parada.nome}
                                                            value={parada.ID_parada}
                                                            checked={currentRota.paradas.includes(parada.ID_parada)}
                                                            onChange={handleParadaChange} 
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
                        <Button onClick={addRota} id="salvarRota" className="shadow">
                            Salvar
                        </Button>
                    </Card.Footer>
                </Card>

            </Container>
        </>

    );

};

export default Rota;