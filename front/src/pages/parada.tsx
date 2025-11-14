import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { Table, Spinner, Container, Button, Modal, Form, Card, Row, Col, ToastContainer, Toast } from "react-bootstrap";
import cidadeService from "../services/cidade.service";
import paradaService from "../services/parada.service";

type Parada = {
    ID_parada?: number;
    nome: string;
    cidade: number;
};

const Parada = () => {
    const { usuario, loading: loadingAuth, carregarUsuario } = useAuth();
    const [mensagem, setMensagem] = useState<string | null>(null);
    const [tipoMensagem, setTipoMensagem] = useState<"success" | "error" | "warning" | "info" | null>(null);
    const [paradas, setParadas] = useState<Parada[]>([]);
    const [loading, setLoading] = useState(true);
    const [cidades, setCidades] = useState<{ ID_cidade: number, nome: string }[]>([]);
    const [cidadeMap, setCidadeMap] = useState<Map<number, string>>(new Map());
    const [refresh, setRefresh] = useState(false);
    const [showModalVer, setShowModalVer] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [paradaSelecionada, setParadaSelecionada] = useState<Parada | null>(null);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [paradaParaDeletar, setParadaParaDeletar] = useState<Parada | null>(null);

    useEffect(() => {
        carregarUsuario();
        fetchParadas();
        fetchCidades();
    }, [refresh]);

    const fetchCidades = async () => {
        try {
            const dados = await cidadeService.getCidades();
            setCidades(dados);
            const map = new Map<number, string>();
            dados.forEach((cidade: { ID_cidade: number, nome: string }) => map.set(cidade.ID_cidade, cidade.nome));
            setCidadeMap(map);
        } catch (error) {
            console.error("Erro ao buscar cidades:");
        }
    };

    const fetchParadas = async () => {
        try {
            setLoading(true);
            const dados = await paradaService.getParadas();
            setParadas(dados);
        } catch (error) {
            console.error("Erro ao buscar paradas:");
        } finally {
            setLoading(false);
        }
    };

    // Abrir modal Ver
    const handleVer = (parada: Parada) => {
        setParadaSelecionada(parada);
        setShowModalVer(true);
    };

    // Fechar modal Edit
    const handleFecharVer = () => {
        setShowModalVer(false);
        setParadaSelecionada(null);
    };


    // Abrir modal Edit
    const handleEditar = (parada: Parada) => {
        setParadaSelecionada(parada);
        setShowModalEdit(true);
    };

    // Fechar modal Edit
    const handleFecharEdit = () => {
        setShowModalEdit(false);
        setParadaSelecionada(null);
    };

    //Alert
    const handleCloseToast = () => {
        setMensagem(null);
        setTipoMensagem(null);
    };


    const handleConfirmarExclusao = (parada: Parada) => {
        setParadaParaDeletar(parada);
        setShowModalConfirm(true);
    };

    const handleFecharConfirm = () => {
        setShowModalConfirm(false);
        setParadaParaDeletar(null);
    };

    // Atualizar usuário
    const handleSalvar = async () => {
        if (!paradaSelecionada?.ID_parada) {
            console.warn("Nenhuma parada selecionada para atualizar.");
            return;
        }

        const body = {
            nome: paradaSelecionada.nome,
            cidade: paradaSelecionada.cidade,
        };

        try {
            console.log("Enviando body para atualização:", body);
            await paradaService.updateParada(paradaSelecionada.ID_parada, body);
            setMensagem("Parada atualizada com sucesso!");
            setTipoMensagem("success");
            handleFecharEdit();
            fetchParadas();

        } catch (error) {
            console.error("Erro ao atualizar a parada:");
            setMensagem("Ocorreu um erro ao tentar atualizar. Tente novamente.");
            setTipoMensagem("error");
        } finally {
            setTimeout(() => {
                setMensagem(null);
                setTipoMensagem(null);
            }, 2000);
        }
    };


    const excluirParada = async () => {
        if (!paradaParaDeletar?.ID_parada) {
            console.error("ID da parada não encontrado para exclusão.");
            return;
        }

        try {
            await paradaService.deleteParada(paradaParaDeletar.ID_parada)
            setMensagem("Parada DELETADA com sucesso!");
            setTipoMensagem("success");
            setRefresh(prev => !prev);

        } catch (error) {
            console.error("Erro ao excluir parada");
            setMensagem("Erro ao excluir parada. Tente novamente.");
            setTipoMensagem("error");
        } finally {
            handleFecharConfirm();
        }
    };


    if (loadingAuth) return <Spinner animation="border" />;
    if (!usuario)
        return (
          <>
            <p>Usuário não logado</p>
            <a href="login">Voltar para o Login</a>
          </>
        );     
    if (usuario.perfil != 1) return <p>É preciso ser Administrador para acessar essa página</p>;
    if (loading) return <Spinner animation="border" />;

    return (
        <>
        <title>Paradas</title>
        
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
                <h1 className="mb-4">Lista de Parada </h1>


                <div className="d-flex justify-content-end mb-3">
                    <Button href="create.parada" className="mt-5 shadow">Adicionar Parada</Button>
                </div>


                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Nome</th>
                            <th>Cidade</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paradas.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center">
                                    Nenhuma parada encontrado
                                </td>
                            </tr>
                        ) : (
                            paradas.map((u, index) => (
                                <tr key={index}>
                                    <td>{u.ID_parada}</td>
                                    <td>{u.nome}</td>
                                    <td>{cidadeMap.get(u.cidade) || u.cidade}</td>
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
                        <Modal.Title>Detalhes da Parada</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {paradaSelecionada && (
                            <Card className="border-0">
                                <Card.Body>

                                    <div className="d-flex align-items-center mb-4">
                                        <i className="bi bi-geo-alt fs-1 me-3 text-primary"></i>
                                        <div>
                                            <Card.Title as="h2" className="mb-0">{paradaSelecionada.nome}</Card.Title>
                                            <Card.Subtitle className="text-muted">
                                                cidade: {cidadeMap.get(paradaSelecionada.cidade) ?? "Não Encontrado"}
                                            </Card.Subtitle>
                                        </div>
                                    </div>
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
                        <Modal.Title>Editar parada</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {paradaSelecionada && (
                            <Card className="shadow-sm border-0 p-3">
                                <Card.Body>
                                    <Form>
                                        <Card.Title className="mb-3">Informações da Parada</Card.Title>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Nome</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={paradaSelecionada.nome}
                                                        onChange={(e) =>
                                                            setParadaSelecionada({
                                                                ...paradaSelecionada,
                                                                nome: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Cidade</Form.Label>
                                                    <Form.Select
                                                        value={paradaSelecionada.cidade}
                                                        onChange={(e) =>
                                                            setParadaSelecionada({
                                                                ...paradaSelecionada,
                                                                cidade: Number(e.target.value),
                                                            })
                                                        }
                                                    >
                                                        <option value={"0"}>Selecione a cidade</option>
                                                        {cidades.map((cidade) => (
                                                            <option key={cidade.ID_cidade} value={cidade.ID_cidade.toString()}>
                                                                {cidade.nome}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
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
                        {paradaParaDeletar && (
                            <>
                                <p className="lead">
                                    Você tem certeza que deseja EXCLUIR a parada:
                                </p>
                                <h4 className="text-danger text-center my-3">
                                    {paradaParaDeletar.nome} (ID: {paradaParaDeletar.ID_parada})
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
                        <Button variant="danger" onClick={excluirParada}>
                            <i className="bi bi-trash me-2"></i>
                            Excluir Permanentemente
                        </Button>
                    </Modal.Footer>
                </Modal>


            </Container>
        </>
    );
};

export default Parada;
