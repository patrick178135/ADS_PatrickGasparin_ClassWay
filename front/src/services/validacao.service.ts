import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002",
});

class ValidacaoService {

  async getValidacaos() {
    try {
      const response = await api.get("/validacao");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar Validacaos:");
      throw error;
    }
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
