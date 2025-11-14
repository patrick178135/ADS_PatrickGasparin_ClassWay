import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import usuarioService from "../services/usuario.service";
import { Table, Spinner, Container, Button, Modal, Form, Card, Row, Col, ToastContainer, Toast } from "react-bootstrap";
import rotaService from "../services/rota.service";
import viagemService from "../services/viagem.service";
import veiculoService from "../services/veiculo.service";

type Viagem = {
    ID_viagem?: number;
    nome: string;
    data: string;
    admin: number;
    motorista: number;
    rota: number;
    veiculo: number;
    alunos: { ID_usuario: number; nome: string }[];
};
const ViagemAgenda = () => {
    const { usuario, loading: loadingAuth, carregarUsuario } = useAuth();
    const [mensagem, setMensagem] = useState<string | null>(null);
    const [tipoMensagem, setTipoMensagem] = useState<"success" | "error" | "warning" | "info" | null>(null);
    const [viagens, setViagens] = useState<Viagem[]>([]);
    const [loading, setLoading] = useState(true);
    const [admins, setAdmins] = useState<{ ID_usuario: number, nome: string }[]>([]);
    const [adminMap, setAdminMap] = useState<Map<number, string>>(new Map());
    const [motoristas, setMotoristas] = useState<{ ID_usuario: number, nome: string }[]>([]);
    const [motoristaMap, setMotoristaMap] = useState<Map<number, string>>(new Map());
    const [rotas, setRotas] = useState<{ ID_rota: number, nome: string }[]>([]);
    const [rotaMap, setRotaMap] = useState<Map<number, any>>(new Map());
    const [veiculos, setVeiculos] = useState<{ ID_veiculo: number, modelo: string }[]>([]);
    const [VeiculoMap, setVeiculoMap] = useState<Map<number, string>>(new Map());
    const [refresh, setRefresh] = useState(false);
    const [showModalVer, setShowModalVer] = useState(false);
    const [viagemSelecionada, setViagemSelecionada] = useState<Viagem | null>(null);


    // formatar data no formato dia/mês/ano hora:minuto
    const formatarData = (dataString: string): string => {
        try {
            const data = new Date(dataString);
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            const hora = String(data.getHours()).padStart(2, '0');
            const minuto = String(data.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
        } catch (error) {
            return dataString;
        }
    };

    useEffect(() => {
        const carregarDadosDoAluno = async () => {
            console.log("useEffect disparado: Usuário definido. Buscando viagens para o ID:", usuario!.sub);
            setLoading(true); 
            try {
                const dadosViagens = await viagemService.getViagensAgendaAluno(usuario!.sub);
                setViagens(dadosViagens);

                await Promise.all([
                    fetchAdmins(),
                    fetchMotoristas(),
                    fetchRotas(),
                    fetchVeiculos()
                ]);

            } catch (error) {
                console.error("Erro ao carregar dados da página:");
                setMensagem("Falha ao carregar as viagens. Tente novamente.");
                setTipoMensagem("error");
            } finally {
                setLoading(false);
            }
        };

        if (usuario) {
            carregarDadosDoAluno();
        } else {
            setViagens([]);
        }

    }, [usuario, refresh]);

    const fetchAdmins = async () => {
        try {
            const dados = await usuarioService.getAdmins();
            setAdmins(dados);
            const map = new Map<number, string>();
            dados.forEach((admin: { ID_usuario: number, nome: string }) => map.set(admin.ID_usuario, admin.nome));
            setAdminMap(map);
            console.log('Administrador Map Atualizado:', Array.from(adminMap.entries()));
        } catch (error) {
            console.error("Erro ao buscar Administradores:");
        }
    };

    const fetchMotoristas = async () => {
        try {
            const dados = await usuarioService.getMotristas();
            setMotoristas(dados);
            const map = new Map<number, string>();
            dados.forEach((motorista: { ID_usuario: number, nome: string }) => map.set(motorista.ID_usuario, motorista.nome));
            setMotoristaMap(map);
            console.log('Motorista Map Atualizado:', Array.from(motoristaMap.entries()));
        } catch (error) {
            console.error("Erro ao buscar motoristas:");
        }
    };

    const fetchRotas = async () => {
        try {
            const dados = await rotaService.getRotas();
            setRotas(dados);

            const map = new Map<number, any>();
            dados.forEach((rota: any) => map.set(rota.ID_rota, rota));
            setRotaMap(map);

            console.log("Rotas carregadas:", dados); // só pra debug
        } catch (error) {
            console.error("Erro ao buscar rotas:", error);
        }
    };
    const fetchVeiculos = async () => {
        try {
            const dados = await veiculoService.getVeiculos();
            setVeiculos(dados);
            const map = new Map<number, string>();
            dados.forEach((veiculo: { ID_veiculo: number, modelo: string }) => map.set(veiculo.ID_veiculo, veiculo.modelo));
            setVeiculoMap(map);
            console.log('Veículo Map Atualizado:', Array.from(VeiculoMap.entries()));
        } catch (error) {
            console.error("Erro ao buscar veículos:");
        }
    };


    // Abrir modal Ver
    const handleVer = (viagem: Viagem) => {
        setViagemSelecionada(viagem);
        setShowModalVer(true);
        console.log('Viagem Selecionada Atualizada:', viagem);
    };

    // Fechar modal ver
    const handleFecharVer = () => {
        setShowModalVer(false);
        setViagemSelecionada(null);
    };

    //Alert
    const handleCloseToast = () => {
        setMensagem(null);
        setTipoMensagem(null);
    };


    if (loadingAuth) return <Spinner animation="border" />;
    if (!usuario)
        return (
            <>
                <p>Usuário não logado</p>
                <a href="login">Voltar para o Login</a>
            </>
        );
    if (usuario.perfil != 3) return <p>É preciso ser Aluno para acessar essa página</p>;
    if (loading) return <Spinner animation="border" />;

    console.log("Renderizando: Tabela de viagens com", viagens.length, "itens.");

    return (

        <>
            <title>Agenda de Viagens</title>

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
                <h1 className="mb-4">Agenda de viagens de {usuario?.nome ?? "Usuário"}  </h1>

                {/* 


        TABELA 


        */}

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Nome</th>
                            <th>data</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {viagens.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    Nenhuma viagem encontrada
                                </td>
                            </tr>
                        ) : (
                            viagens.map((u, index) => (
                                <tr key={index}>
                                    <td>{u.ID_viagem}</td>
                                    <td>{u.nome}</td>
                                    <td>{formatarData(u.data)}</td>
                                    <td className="d-flex justify-content-center">

                                        <Button
                                            className="m-1 shadow"
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => handleVer(u)}
                                        >
                                            <i className="bi bi-eye me-1"></i>
                                        </Button>

                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>

                {/* 


        MODAL VER 
        

        */}


                <Modal show={showModalVer} onHide={handleFecharVer} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Detalhes da Viagem</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {viagemSelecionada && (
                            <Card className="shadow-sm border-0">
                                <Card.Body>
                                    <div className="d-flex align-items-center mb-4">
                                        <i className="bi bi-ticket-perforated fs-1 me-3 text-primary"></i>
                                        <div>
                                            <Card.Title as="h2" className="mb-0">{viagemSelecionada.nome}</Card.Title>
                                        </div>
                                    </div>

                                    <hr />

                                    <Row className="g-3">

                                        <Col xs={12}>
                                            <strong><i className="bi bi-textarea-resize me-2"></i>Data:</strong>
                                            <p className="ms-4 mb-0">{formatarData(viagemSelecionada.data)}</p>
                                        </Col>

                                        <Col md={6} xs={12}>
                                            <strong><i className="bi bi-person-gear me-2"></i>Administrador:</strong>
                                            <p className="ms-4 mb-0">{adminMap.get(viagemSelecionada.admin) ?? "Não Encontrada"}</p>
                                        </Col>

                                        <Col md={6} xs={12}>
                                            <strong><i className="bi bi-person-badge me-2"></i>Motorista:</strong>
                                            <p className="ms-4 mb-0">{motoristaMap.get(viagemSelecionada.motorista) ?? "Não Encontrada"}</p>
                                        </Col>

                                        <Col md={6} xs={12}>
                                            <strong><i className="bi bi-map me-2"></i>Rota:</strong>
                                            <p className="ms-4 mb-0">{rotaMap.get(viagemSelecionada.rota)?.nome ?? "Não Encontrada"}</p>
                                        </Col>

                                        <Col md={6} xs={12}>
                                            <strong><i className="bi bi-bus-front-fill me-2"></i>Veículo:</strong>
                                            <p className="ms-4 mb-0">{VeiculoMap.get(viagemSelecionada.veiculo) ?? "Não Encontrada"}</p>
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

            </Container>
        </>
    );
};

export default ViagemAgenda;
