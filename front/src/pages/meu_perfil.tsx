import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import usuarioService from "../services/usuario.service";
import { Spinner, Container, Button, Modal, Form, Card, Col, Row } from "react-bootstrap"; // Removido Table e ListGroup
import perfilService from "../services/perfil.service";
import cidadeService from "../services/cidade.service";
import { Alert, AlertTitle } from "@mui/material";

type Usuario = {
  ID_usuario?: number;
  nome: string;
  email: string;
  CPF: string;
  senhaHash: string;
  ativo: boolean;
  perfil_usuario: number;
  cidade: number;
};

const MeuPerfil = () => {
  const { usuario: usuarioToken, loading: loadingAuth, carregarUsuario } = useAuth();
  const [perfilData, setPerfilData] = useState<Usuario | null>(null); 
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [tipoMensagem, setTipoMensagem] = useState<"success" | "error" | "warning" | "info" | null>(null);
  const [loading, setLoading] = useState(true); 
  const [cidades, setCidades] = useState<{ ID_cidade: number, nome: string }[]>([]);
  const [perfis, setPerfis] = useState<{ ID_perfil: number, nome: string }[]>([]);
  const [cidadeMap, setCidadeMap] = useState<Map<number, string>>(new Map());
  const [perfilMap, setPerfilMap] = useState<Map<number, string>>(new Map());
  const [refresh, setRefresh] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const fetchPerfil = async () => {
    if (!usuarioToken?.sub) { 
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const dados = await usuarioService.getUsuario(Number(usuarioToken.sub)); 
      setPerfilData(dados);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuario();
    fetchPerfil(); 
    fetchCidades();
    fetchPerfis();
  }, [refresh, usuarioToken?.sub]); 

  const fetchCidades = async () => {
    try {
      const dados = await cidadeService.getCidades();
      setCidades(dados);
      const map = new Map<number, string>();
      dados.forEach((cidade: { ID_cidade: number, nome: string }) => map.set(cidade.ID_cidade, cidade.nome));
      setCidadeMap(map);
    } catch (error) {
      console.error("Erro ao buscar cidades:", error);
    }
  };

  const fetchPerfis = async () => {
    try {
      const dados = await perfilService.getPerfis();
      setPerfis(dados);
      const map = new Map<number, string>();
      dados.forEach((perfil: { ID_perfil: number, nome: string }) => map.set(perfil.ID_perfil, perfil.nome));
      setPerfilMap(map);
    } catch (error) {
      console.error("Erro ao buscar perfis:", error);
    }
  };

  const handleEditar = () => {
    if (perfilData) {
      setUsuarioSelecionado(perfilData);
      setShowModalEdit(true);
    }
  };

  const handleFecharEdit = () => {
    setShowModalEdit(false);
    setUsuarioSelecionado(null);
    setNovaSenha('');
    setConfirmarSenha('');
  };

  const handleSalvar = async () => {
    if (!usuarioSelecionado?.ID_usuario) {
      console.warn("Nenhum usuário selecionado para atualizar.");
      return;
    }

    if (novaSenha) {
      if (novaSenha !== confirmarSenha) {
        setMensagem("As senhas não conferem.");
        setTipoMensagem("warning");
        return;
      }
      if (novaSenha.length < 5) {
        setMensagem("A nova senha deve ter pelo menos 5 caracteres.");
        setTipoMensagem("warning");
        return;
      }
    }

    if (novaSenha) {
      setMensagem("Senha atualizada com sucesso!");
      setTipoMensagem("success");
      
    } else {
      setMensagem("Nenhuma alteração de senha detectada.");
      setTipoMensagem("info");
    }

    handleFecharEdit();
    setRefresh(prev => !prev);
  };


  if (loadingAuth || loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (!usuarioToken) return <p>Usuário não logado</p>;
  if (!perfilData) return <Alert className="mt-5">Nenhum dado de perfil encontrado para o ID {usuarioToken.sub}.</Alert>;

  const usuario = perfilData; 

  return (
    <Container className="mt-5 rounded-4 shadow p-5">

      <h1 className="mb-4">Meu Perfil:</h1>
      
      <Card className="shadow-lg p-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Card.Body>
          
          <div className="d-flex align-items-center mb-4">
            <i className="bi bi-person-circle fs-1 me-3 text-primary"></i>
            <div>
              <Card.Title as="h2" className="mb-0">{usuario.nome}</Card.Title>
              <Card.Subtitle className="text-muted">
                {perfilMap.get(usuario.perfil_usuario) || 'Não Definido'}
              </Card.Subtitle>
            </div>
          </div>

          <hr />

          <Row className="g-3">
            <Col xs={12}>
              <strong><i className="bi bi-envelope me-2"></i>E-mail:</strong> 
              <p className="ms-4 mb-0">{usuario.email}</p>
            </Col>
            <Col md={6} xs={12}>
              <strong><i className="bi bi-file-earmark-text me-2"></i>CPF:</strong> 
              <p className="ms-4 mb-0">{usuario.CPF}</p>
            </Col>
            <Col md={6} xs={12}>
              <strong><i className="bi bi-geo-alt me-2"></i>Cidade:</strong> 
              <p className="ms-4 mb-0">{cidadeMap.get(usuario.cidade) || 'Não Definida'}</p>
            </Col>
            <Col md={6} xs={12}>
              <strong><i className="bi bi-check-circle me-2"></i>Status:</strong> 
              <span className={`badge fs-6 rounded-pill ms-2 bg-${usuario.ativo ? 'success' : 'danger'}`}>
                {usuario.ativo ? "Ativo" : "Inativo"}
              </span>
            </Col>
            <Col md={6} xs={12}>
              <strong><i className="bi bi-person-badge me-2"></i>ID do Usuário:</strong> 
              <p className="ms-4 mb-0">{usuario.ID_usuario}</p>
            </Col>
          </Row>
          
        </Card.Body>
        <Card.Footer className="text-end bg-white border-0 pt-3">
          <Button
            className="shadow"
            variant="warning"
            onClick={handleEditar} 
          >
            <i className="bi bi-key me-1"></i> Alterar Senha
          </Button>
        </Card.Footer>
      </Card>

      <Modal show={showModalEdit} onHide={handleFecharEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Alterar Senha</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content">
            {mensagem && tipoMensagem && (
              <div className="mt-3">
                <Alert severity={tipoMensagem}>
                  <AlertTitle>
                    {tipoMensagem === "success" && "Sucesso"}
                    {tipoMensagem === "info" && "Informação"}
                    {tipoMensagem === "warning" && "Atenção"}
                    {tipoMensagem === "error" && "Erro"}
                  </AlertTitle>
                  {mensagem}
                </Alert>
              </div>
            )}
          </div>

          {usuarioSelecionado && (
            <Form>
              <p className="text-muted">Alterando senha para: <strong>{usuarioSelecionado.nome}</strong></p>
              
              <Form.Group className="mb-2">
                <Form.Label>Nova Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Deixe em branco para não alterar"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Confirmar Nova Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Repita a nova senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  isInvalid={!!(novaSenha && confirmarSenha && novaSenha !== confirmarSenha)}
                />
                <Form.Control.Feedback type="invalid">
                  As senhas não conferem.
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
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
    </Container>
  );
};

export default MeuPerfil;
