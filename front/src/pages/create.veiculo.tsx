import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Toast, ToastContainer } from "react-bootstrap";
import router from "next/router";
import { useAuth } from "../context/AuthContext";
import veiculoService from "../services/veiculo.service";

type Veiculo = {
    montadora: string;
    modelo: string;
    placa: string;
    capacidade: number;
    ativo: boolean
};

const Veiculo = () => {
    const { usuario, loading, carregarUsuario } = useAuth();
    const [refresh, setRefresh] = useState(false);
    const [mensagem, setMensagem] = useState<string | null>(null);
    const [tipoMensagem, setTipoMensagem] = useState<"success" | "error" | "warning" | "info" | null>(null);

    const [currentVeiculo, setCurrentVeiculo] = useState<Veiculo>({
        montadora: "",
        modelo: "",
        placa: "",
        capacidade: 0,
        ativo: true
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setCurrentVeiculo({
            ...currentVeiculo,
            [name]:
                name === "capacidade" 
                    ? Number(value)
                    : value,
        });
    };

    const addVeiculo = async () => {

        if (currentVeiculo.placa.length !== 7) {
            setMensagem("A Placa deve ter exatamente 7 dígitos.");
            setTipoMensagem("warning");
            return;
        }

        try {
            const resultado = await veiculoService.addVeiculo(currentVeiculo);
            console.log(resultado);

            if (resultado.status === 201) {
                setMensagem("Veículo cadastrado com sucesso!");
                setTipoMensagem("success");
                setCurrentVeiculo({
                    montadora: "",
                    modelo: "",
                    placa: "",
                    capacidade: 0,
                    ativo: true
                });
                setRefresh(!refresh);
                irVeiculo();
            }
        } catch (error) {
            console.error("Erro ao adicionar veículo:");
            setMensagem("Erro ao cadastrar veículo. Tente novamente.");
            setTipoMensagem("error");
        } finally {
            setTimeout(() => {
                setMensagem(null);
                setTipoMensagem(null);
            }, 4000);
        }
    };

    const irVeiculo = () => {
        router.push("/veiculo");
    }


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
                    <Button href="veiculo">Voltar</Button>
                </div>

                <div className="d-flex justify-content-end">
                    {mensagem && tipoMensagem && (
                        <div className="mt-3">

                        </div>
                    )}
                </div>

                <Card className="shadow-lg p-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <Card.Header className="text-center">
                        <h2 className="mb-0">Cadastrar Veículo</h2>
                    </Card.Header>

                    <Card.Body>
                        <Form>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Montadora:</Form.Label>
                                        <Form.Control
                                            id="montadoraVeiculo"
                                            type="text"
                                            name="montadora"
                                            value={currentVeiculo.montadora}
                                            placeholder="Digite o nome da montadora do veículo"
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Modelo:</Form.Label>
                                        <Form.Control
                                            id="modeloVeiculo"
                                            type="text"
                                            name="modelo"
                                            value={currentVeiculo.modelo}
                                            placeholder="Digite o modelo do veículo"
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Placa:</Form.Label>
                                        <Form.Control
                                            id="placaVeiculo"
                                            type="text"
                                            name="placa"
                                            value={currentVeiculo.placa}
                                            placeholder="Digite a placa do veículo"
                                            onChange={handleChange}
                                            maxLength={7}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Capacidade:</Form.Label>
                                        <Form.Control
                                            id="capacidadeVeiculo"
                                            type="number"
                                            name="capacidade"
                                            value={currentVeiculo.capacidade}
                                            placeholder="Informe a capacidade do Veículo"
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            id="ativoVeiculo"
                                            name="ativo"
                                            checked={currentVeiculo.ativo}
                                            label="Veículo ativo"
                                            onChange={(e) =>
                                                setCurrentVeiculo({ ...currentVeiculo, ativo: e.target.checked })
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                        </Form>
                    </Card.Body>

                    <Card.Footer className="text-end bg-white border-0">
                        <Button onClick={addVeiculo} id="salvarVeiculo" className="shadow">
                            Salvar
                        </Button>
                    </Card.Footer>
                </Card>

            </Container>
        </>

    );

};

export default Veiculo;