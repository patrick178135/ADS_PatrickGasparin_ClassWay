import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { Table, Spinner, Container, Button, Modal, Form, Card, Row, Col, ToastContainer, Toast } from "react-bootstrap";
import cidadeService from "../services/cidade.service";
import rotaService from "../services/rota.service";
import paradaService from "../services/parada.service";

type Rota = {
    ID_rota?: number;
    nome: string;
    partida: number;
    destino: number;
    paradas: { ID_parada: number; cidade: number }[];
};

const Rota = () => {
    const { usuario, loading: loadingAuth, carregarUsuario } = useAuth();
    const [mensagem, setMensagem] = useState<string | null>(null);
    const [tipoMensagem, setTipoMensagem] = useState<"success" | "error" | "warning" | "info" | null>(null);
    const [rotas, setRotas] = useState<Rota[]>([]);
    const [loading, setLoading] = useState(true);
    const [cidades, setCidades] = useState<{ ID_cidade: number, nome: string }[]>([]);
    const [cidadeMap, setCidadeMap] = useState<Map<number, string>>(new Map());
    const [paradas, setParadas] = useState<{ ID_parada: number, nome: string, cidade: number }[]>([]);
    const [paradaMap, setParadaMap] = useState<Map<number, string>>(new Map());
    const [refresh, setRefresh] = useState(false);
    const [showModalVer, setShowModalVer] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [rotaSelecionada, setRotaSelecionada] = useState<Rota | null>(null);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [rotaParaDeletar, setRotaParaDeletar] = useState<Rota | null>(null);
    const [showModalParadas, setShowModalParadas] = useState(false);

    useEffect(() => {
        carregarUsuario();
        fetchRotas();
        fetchCidades();
        fetchParadas();
    }, [refresh]);

    const fetchCidades = async () => {
        try {
            const dados = await cidadeService.getCidades();
            setCidades(dados);
            const map = new Map<number, string>();
            dados.forEach((cidade: { ID_cidade: number, nome: string }) => map.set(cidade.ID_cidade, cidade.nome));
            setCidadeMap(map);
            console.log('Cidade Map Atualizado:', Array.from(cidadeMap.entries()));
        } catch (error) {
            console.error("Erro ao buscar cidades:");
        }
    };

    const fetchRotas = async () => {
        try {
            setLoading(true);
            const dados = await rotaService.getRotas();
            setRotas(dados);
        } catch (error) {
            console.error("Erro ao buscar rotas:");
        } finally {
            setLoading(false);
        }
    };

    const fetchParadas = async () => {
        try {
            const dados = await paradaService.getParadas();
            setParadas(dados);
            const map = new Map<number, string>();
            dados.forEach((parada: { ID_parada: number, nome: string }) => map.set(parada.ID_parada, parada.nome));
            setParadaMap(map);
            console.log('Parada Map Atualizado:', Array.from(paradaMap.entries()));
        } catch (error) {
            console.error("Erro ao buscar paradas:");
        }
    };

    // Abrir modal Ver
    const handleVer = (rota: Rota) => {
        setRotaSelecionada(rota); 
        setShowModalVer(true); 
        console.log('Rota Selecionada Atualizadaaaaa:', rota);
    };

    // Fechar modal ver
    const handleFecharVer = () => {
        setShowModalVer(false);
        setRotaSelecionada(null);
    };


    // Abrir modal Edit
    const handleEditar = (rota: Rota) => {
        setRotaSelecionada(rota);
        setShowModalEdit(true);
    };

    // Fechar modal Edit
    const handleFecharEdit = () => {
        setShowModalEdit(false);
        setRotaSelecionada(null);
    };

    //Alert
    const handleCloseToast = () => {
        setMensagem(null);
        setTipoMensagem(null);
    };


    const handleConfirmarExclusao = (rota: Rota) => {
        setRotaParaDeletar(rota);
        setShowModalConfirm(true);
    };

    const handleFecharConfirm = () => {
        setShowModalConfirm(false);
        setRotaParaDeletar(null);
    };

    const handleAbrirParadas = () => {
        setShowModalParadas(true);
    };

    // Fechar modal Paradas
    const handleFecharParadas = () => {
        setShowModalParadas(false);
    };

    // Atualizar 
    const handleSalvar = async () => {
        if (!rotaSelecionada?.ID_rota) {
            console.warn("Nenhuma rota selecionada para atualizar.");
            return;
        }

        const body = {
            nome: rotaSelecionada.nome,
            partida: rotaSelecionada.partida,
            destino: rotaSelecionada.destino,
            paradas: rotaSelecionada.paradas.map(p => p.ID_parada),
        };

        try {
            console.log("Enviando body para atualização:", body);
            await rotaService.updateRota(rotaSelecionada.ID_rota, body);

            setMensagem("Rota atualizada com sucesso!");
            setTipoMensagem("success");
            handleFecharEdit();
            fetchRotas();
        } catch (error) {
            console.error("Erro ao atualizar Rota:");
            setMensagem("Ocorreu um erro ao tentar atualizar. Tente novamente.");
            setTipoMensagem("error");
        } finally {
            setTimeout(() => {
                setMensagem(null);
                setTipoMensagem(null);
            }, 2000);
        }
    };


    const excluirRota = async () => {
        if (!rotaParaDeletar?.ID_rota) {
            console.error("ID da Rota não encontrado para exclusão.");
            return;
        }

        try {
            await rotaService.deleteRota(rotaParaDeletar?.ID_rota);

            setMensagem("Rota DELETADA com sucesso!");
            setTipoMensagem("success");
            setRefresh(prev => !prev);

        } catch (error) {
            console.error("Erro ao excluir Rota");
            setMensagem("Erro ao excluir Rota. Tente novamente.");
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
        <title>Rotas</title>
        
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
                <h1 className="mb-4">Lista de Rota </h1>

                <div className="d-flex justify-content-end mb-3">
                    <Button href="create.rota" className="mt-5 shadow">Adicionar Rota</Button>
                </div>



                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Nome</th>
                            <th>Partida</th>
                            <th>Destino</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rotas.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    Nenhuma rota encontrada
                                </td>
                            </tr>
                        ) : (
                            rotas.map((u, index) => (
                                <tr key={index}>
                                    <td>{u.ID_rota}</td>
                                    <td>{u.nome}</td>
                                    <td>{cidadeMap.get(u.partida) || u.partida}</td>
                                    <td>{cidadeMap.get(u.destino) || u.destino}</td>
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
                                            onClick={() => handleConfirmarExclusao(u)}                     
                                        >
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
                        <Modal.Title>Detalhes da Rota</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {rotaSelecionada && (
                            <Card className="shadow-sm border-0">
                                <Card.Body>

                                    <div className="d-flex align-items-center mb-4">
                                        <i className="bi bi-map fs-1 me-3 text-primary"></i>
                                        <div>
                                            <Card.Title as="h2" className="mb-0">{rotaSelecionada.nome}</Card.Title>
                                        </div>
                                    </div>

                                    <hr />

                                    <Row className="g-3">

                                        <Col md={6} xs={12}>
                                            <strong><i className="bi bi-geo-alt me-2"></i>Partida:</strong>
                                            <p className="ms-4 mb-0">{cidadeMap.get(rotaSelecionada.partida) ?? "Não Encontrada"}</p>
                                        </Col>

                                        <Col md={6} xs={12}>
                                            <strong><i className="bi bi-geo-alt me-2"></i>Destino:</strong>
                                            <p className="ms-4 mb-0">{cidadeMap.get(rotaSelecionada.destino) ?? "Não Encontrada"}</p>
                                        </Col>

                                    </Row>

                                </Card.Body>
                            </Card>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        {rotaSelecionada && rotaSelecionada.paradas?.length > 0 && (
                            <Button variant="info" onClick={handleAbrirParadas}>
                                <i className="bi bi-pin-map me-2"></i>Ver Paradas ({rotaSelecionada.paradas.length})
                            </Button>
                        )}

                        <Button variant="secondary" onClick={handleFecharVer}>
                            Sair
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModalEdit} onHide={handleFecharEdit} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Rota</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {rotaSelecionada && (
                            <Card className="shadow-sm border-0 p-3">
                                <Card.Body>
                                    <Form>
                                        <Card.Title className="mb-3">Informações da Rota</Card.Title>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Nome</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={rotaSelecionada.nome}
                                                        onChange={(e) =>
                                                            setRotaSelecionada({
                                                                ...rotaSelecionada,
                                                                nome: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <hr className="my-4" />

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Partida</Form.Label>
                                                    <Form.Select
                                                        value={rotaSelecionada.partida}
                                                        onChange={(e) =>
                                                            setRotaSelecionada({
                                                                ...rotaSelecionada,
                                                                partida: Number(e.target.value),
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
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Destino</Form.Label>
                                                    <Form.Select
                                                        value={rotaSelecionada.destino}
                                                        onChange={(e) =>
                                                            setRotaSelecionada({
                                                                ...rotaSelecionada,
                                                                destino: Number(e.target.value),
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
                                            <Col>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Selecione as Paradas:</Form.Label>
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
                                                                    checked={rotaSelecionada.paradas.some(
                                                                        (p) => p.ID_parada === parada.ID_parada
                                                                    )}
                                                                    onChange={(e) => {
                                                                        const checked = e.target.checked;
                                                                        const novasParadas = checked
                                                                            ? [...rotaSelecionada.paradas, parada]
                                                                            : rotaSelecionada.paradas.filter(
                                                                                (p) => p.ID_parada !== parada.ID_parada
                                                                            );
                                                                        setRotaSelecionada({ ...rotaSelecionada, paradas : novasParadas });
                                                                    }}
                                                                />
                                                            ))
                                                        )}
                                                    </Card>
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
                        {rotaParaDeletar && (
                            <>
                                <p className="lead">
                                    Você tem certeza que deseja EXCLUIR a Rota:
                                </p>
                                <h4 className="text-danger text-center my-3">
                                    {rotaParaDeletar.nome} (ID: {rotaParaDeletar.ID_rota})
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
                        <Button variant="danger" onClick={excluirRota}>
                            <i className="bi bi-trash me-2"></i>
                            Excluir Permanentemente
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModalParadas} onHide={handleFecharParadas} >
                    <Modal.Header closeButton>
                        <Modal.Title>Paradas da Rota: {rotaSelecionada?.nome}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {rotaSelecionada && rotaSelecionada.paradas?.length > 0 ? (
                            <ol>
                                {rotaSelecionada.paradas.map((parada) => (
                                    <li key={parada.ID_parada}>
                                    {paradaMap.get(parada.ID_parada) || `Parada ID ${parada.ID_parada} (Não Encontrada)`} 
                                    <span className="mx-2">|</span>
                                    Cidade: {cidadeMap.get(parada.cidade) || `Cidade ID ${parada.cidade} (Não Encontrada)`}
                                </li>
                                ))}
                            </ol>
                        ) : (
                            <p>Esta rota não possui paradas intermediárias.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleFecharParadas}>
                            Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>



            </Container>
        </>
    );
};

export default Rota;
