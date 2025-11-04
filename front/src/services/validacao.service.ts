import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002",
});

class ValidacaoService {

  async getValidacoesPorViagem(idViagem: number) {
    try {
      const response = await api.get(`/validacao/viagem/${idViagem}`); 
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar Validações para a Viagem ${idViagem}:`);
      throw error;
    }
  }

  async getValidacoesPorUsuario(idUsuario: number) {
    try {
      const response = await api.get(`/validacao/usuario/${idUsuario}`); 
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar Validações para o usuário ${idUsuario}:`);
      throw error;
    }
  }

  async getValidacoes() {
    try {
      const response = await api.get("/validacao");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar Validacaos:");
      throw error;
    }
  }

  async criarValidacoesEmLote(validacoes: any[]) {
    return await api.post("/validacao/lote", validacoes);
  }

  async addValidacao(data: any) {
    try {
      const response = await api.post("/validacao", data);
      return response; 
    } catch (error) {
      console.error("Erro ao adicionar Validacao:");
      throw error;
    } finally {
      console.log("Requisição de cadastro finalizada");
    }
  }

  async updateValidacao(id: number, data: any) {
    try {
      const response = await api.patch(`/validacao/${id}`, data);
      console.log("Resposta do backend:", response.data);

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar Validacao:");
      throw error;
    }
  }

  async deleteValidacao(id: number) {
    try {
      const response = await api.delete(`/validacao/${id}`);
      return response;
    } catch (error) {
      console.error("Erro ao deletar Validacao");
      throw error;
    }
  }

}

export default new ValidacaoService();
