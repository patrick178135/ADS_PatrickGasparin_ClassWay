import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { Table, Spinner, Container, Button, Modal, Form, Card, Row, Col, ToastContainer, Toast } from "react-bootstrap";
import veiculoService from "../services/veiculo.service";

type Veiculo = {
    ID_veiculo?: number;
    montadora: string;
    modelo: string;
    placa: string;
    capacidade: number;
    ativo: boolean;
};

const Veiculo = () => {
    const { usuario, loading: loadingAuth, carregarUsuario } = useAuth();
    const [mensagem, setMensagem] = useState<string | null>(null);
    const [tipoMensagem, setTipoMensagem] = useState<"success" | "error" | "warning" | "info" | null>(null);
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [showModalVer, setShowModalVer] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState<Veiculo | null>(null);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [veiculoParaDeletar, setVeiculoParaDeletar] = useState<Veiculo | null>(null);

    useEffect(() => {
        carregarUsuario();
        fetchVeiculos();
    }, [refresh]);

    const fetchVeiculos = async () => {
        try {
            setLoading(true);
            const dados = await veiculoService.getVeiculos();
            setVeiculos(dados);
        } catch (error) {
            console.error("Erro ao buscar veiculos:");
        } finally {
            setLoading(false);
        }
    };

    // Abrir modal Ver
    const handleVer = (veiculo: Veiculo) => {
        setVeiculoSelecionado(veiculo);
        setShowModalVer(true);
    };

    // Fechar modal Edit
    const handleFecharVer = () => {
        setShowModalVer(false);
        setVeiculoSelecionado(null);
    };


    // Abrir modal Edit
    const handleEditar = (veiculo: Veiculo) => {
        setVeiculoSelecionado(veiculo);
        setShowModalEdit(true);
    };

    // Fechar modal Edit
    const handleFecharEdit = () => {
        setShowModalEdit(false);
        setVeiculoSelecionado(null);
    };

    //Alert
    const handleCloseToast = () => {
        setMensagem(null);
        setTipoMensagem(null);
    };


    const handleConfirmarExclusao = (veiculo: Veiculo) => {
        setVeiculoParaDeletar(veiculo);
        setShowModalConfirm(true);
    };

    const handleFecharConfirm = () => {
        setShowModalConfirm(false);
        setVeiculoParaDeletar(null);
    };

    // Atualizar usuário
    const handleSalvar = async () => {

        if (!veiculoSelecionado?.ID_veiculo) {
            console.warn("Nenhum verfil selecionado para atualizar.");
            return;
        }

        if (veiculoSelecionado.placa.length !== 7) {
            setMensagem("A Placa deve ter exatamente 7 dígitos.");
            setTipoMensagem("warning");
            return;
        }

        const body = {
            montadora: veiculoSelecionado?.montadora,
            modelo: veiculoSelecionado?.modelo,
            placa: veiculoSelecionado?.placa,
            capacidade: veiculoSelecionado?.capacidade,
            ativo: veiculoSelecionado?.ativo,
        };

        try {
            console.log("Enviando body para atualização:", body);
            await veiculoService.updateVeiculo(veiculoSelecionado?.ID_veiculo, body);
            setMensagem("Veículo atualizado com sucesso!");
            setTipoMensagem("success");
            handleFecharEdit();
            fetchVeiculos();

        } catch (error) {
            console.error("Erro ao atualizar o veículo:", error);
            setMensagem("Ocorreu um erro ao tentar atualizar. Tente novamente.");
            setTipoMensagem("error");
        } finally {
            setTimeout(() => {
                setMensagem(null);
                setTipoMensagem(null);
            }, 2000);
        }
    };


    const excluirVeiculo = async () => {

        if (!veiculoParaDeletar?.ID_veiculo) {
            console.error("ID do veículo não encontrado para exclusão.");
            return;
        }

        try {
            await veiculoService.deleteVeiculo(veiculoParaDeletar.ID_veiculo);
            setMensagem("Veículo DELETADO com sucesso!");
            setTipoMensagem("success");
            setRefresh(prev => !prev);

        } catch (error) {
            console.error("Erro ao excluir veículo");
            setMensagem("Erro ao excluir veículo. Tente novamente.");
            setTipoMensagem("error");
        } finally {
            handleFecharConfirm();
        }
    };


    if (loadingAuth) return <Spinner animation="border" />;
    if (!usuario) return <p>Usuário não logado</p>;
    if (loading) return <Spinner animation="border" />;

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

            <Container className="mt-5 rounded-4 shadow p-5">
                <h1 className="mb-4">Lista de Veículos </h1>

                <div className="d-flex justify-content-end mb-3">
                    <Button href="create.veiculo" className="mt-5 shadow">Adicionar Veículo</Button>
                </div>

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Montadora</th>
                            <th>Modelo</th>
                            <th>Placa</th>
                            <th>Capacidade</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {veiculos.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center">
                                    Nenhum veículo encontrado
                                </td>
                            </tr>
                        ) : (
                            veiculos.map((u, index) => (
                                <tr key={index}>
                                    <td>{u.ID_veiculo}</td>
                                    <td>{u.montadora}</td>
                                    <td>{u.modelo}</td>
                                    <td>{u.placa}</td>
                                    <td>{u.capacidade}</td>
                                    <td>
                                        <span className={`badge fs-6 rounded-pill ms-2 bg-${u.ativo ? 'success' : 'danger'}`}>
                                            {u.ativo ? "Ativo" : "Inativo"}
                                        </span>
                                    </td>
                                    <td className="d-flex justify-content-center">
                                        <Button
                                            className="m-1 shadow"
                                            variant="outline-warning"
                                            size="sm"
                                            onClick={() => handleEditar(u)}
                                        >
                                            <i className="bi bi-pencil me-1"></i>
                                        </Button>

                                        <Button
                                            className="m-1 shadow"
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => handleVer(u)}
                                        >
                                            <i className="bi bi-eye me-1"></i>
                                        </Button>

                                        <Button
                                            className="m-1 shadow"
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleConfirmarExclusao(u)}                     >
                                            <i className="bi bi-trash me-1"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>

                <Modal show={showModalVer} onHide={handleFecharVer} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Detalhes do Veículo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {veiculoSelecionado && (
                            <Card className="shadow-sm border-0">
                                <Card.Body>

                                    <div className="d-flex align-items-center mb-4">
                                        <i className="bi bi-bus-front-fill fs-1 me-3 text-primary"></i>
                                        <div>
                                            <Card.Title as="h2" className="mb-0">{veiculoSelecionado.modelo}</Card.Title>
                                            <Card.Subtitle className="text-muted">{veiculoSelecionado.montadora}</Card.Subtitle>
                                        </div>
                                    </div>

                                    <hr />

                                    <Row className="g-3">

                                        <Col xs={12}>
                                            <strong><i className="bi bi-textarea-resize me-2"></i>Placa:</strong>
                                            <p className="ms-4 mb-0">{veiculoSelecionado.placa}</p>
                                        </Col>

                                        <Col md={6} xs={12}>
                                            <strong><i className="bi bi-people  me-2"></i>Capacidade:</strong>
                                            <p className="ms-4 mb-0">{veiculoSelecionado.capacidade}</p>
                                        </Col>

                                        <Col md={6} xs={12}>
                                            <strong><i className="bi bi-check-circle me-2"></i>Status:</strong>
                                            <span className={`badge fs-6 rounded-pill ms-2 bg-${veiculoSelecionado.ativo ? 'success' : 'danger'}`}>
                                                {veiculoSelecionado.ativo ? "Ativo" : "Inativo"}
                                            </span>
                                        </Col>

                                    </Row>

                                </Card.Body>
                            </Card>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleFecharVer}>
                            Sair
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModalEdit} onHide={handleFecharEdit} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Veículo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {veiculoSelecionado && (
                            <Card className="shadow-sm border-0 p-3">
                                <Card.Body>
                                    <Form>
                                        <Card.Title className="mb-3">Informações do Veículo</Card.Title>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Montadora</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={veiculoSelecionado.montadora}
                                                        onChange={(e) =>
                                                            setVeiculoSelecionado({
                                                                ...veiculoSelecionado,
                                                                montadora: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Modelo</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={veiculoSelecionado.modelo}
                                                        onChange={(e) =>
                                                            setVeiculoSelecionado({
                                                                ...veiculoSelecionado,
                                                                modelo: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Placa</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={veiculoSelecionado.placa}
                                                        onChange={(e) =>
                                                            setVeiculoSelecionado({
                                                                ...veiculoSelecionado,
                                                                placa: e.target.value,
                                                            })
                                                        }
                                                        maxLength={7}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Capacidade</Form.Label>
                                                    <Form.Control
                                                        value={veiculoSelecionado.capacidade}
                                                        onChange={(e) =>
                                                            setVeiculoSelecionado({
                                                                ...veiculoSelecionado,
                                                                capacidade: Number(e.target.value),
                                                            })
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="d-flex align-items-center pt-4">
                                                <Form.Group className="mb-3">
                                                    <Form.Check
                                                        type="checkbox"
                                                        label="Ativo"
                                                        checked={veiculoSelecionado.ativo}
                                                        onChange={(e) =>
                                                            setVeiculoSelecionado({
                                                                ...veiculoSelecionado,
                                                                ativo: e.target.checked,
                                                            })
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                    </Form>
                                </Card.Body>
                            </Card>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleFecharEdit}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSalvar}>
                            Salvar
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={showModalConfirm} onHide={handleFecharConfirm} centered>
                    <Modal.Header closeButton className="bg-danger text-white">
                        <Modal.Title>
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            Confirmação de Exclusão
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="py-4">
                        {veiculoParaDeletar && (
                            <>
                                <p className="lead">
                                    Você tem certeza que deseja EXCLUIR o veículo:
                                </p>
                                <h4 className="text-danger text-center my-3">
                                    {veiculoParaDeletar.modelo} (ID: {veiculoParaDeletar.ID_veiculo})
                                </h4>
                                <p className="text-muted text-center">
                                    Esta ação é irreversível.
                                </p>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleFecharConfirm}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={excluirVeiculo}>
                            <i className="bi bi-trash me-2"></i>
                            Excluir Permanentemente
                        </Button>
                    </Modal.Footer>
                </Modal>


            </Container>
        </>
    );
};

export default Veiculo;
