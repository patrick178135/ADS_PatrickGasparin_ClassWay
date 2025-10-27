import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002",
});

class CidadeService {

  async getCidades() {
    try {
      const response = await api.get("/cidade");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar cidade:");
      throw error;
    }
  }

  async addCidade(data: any) {
    try {
      const response = await api.post("/cidade", data);
      return response; 
    } catch (error) {
      console.error("Erro ao adicionar cidade:");
      throw error;
    } finally {
      console.log("Requisição de cadastro finalizada");
    }
  }

  async updateCidade(id: number, data: any) {
    try {
      const response = await api.patch(`/cidade/${id}`, data);
      console.log("Resposta do backend:", response.data);

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar cidade:");
      throw error;
    }
  }

  async deleteCidade(id: number) {
    try {
      const response = await api.delete(`/cidade/${id}`);
      return response;
    } catch (error) {
      console.error("Erro ao deletar cidade");
      throw error;
    }
  }


}

export default new CidadeService();
