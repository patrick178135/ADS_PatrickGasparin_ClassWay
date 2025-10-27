import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002",
});

class RotaService {

  async getRotas() {
    try {
      const response = await api.get("/rota");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar rotas:");
      throw error;
    }
  }

  async addRota(data: any) {
    try {
      const response = await api.post("/rota", data);
      return response; 
    } catch (error) {
      console.error("Erro ao adicionar rota:");
      throw error;
    } finally {
      console.log("Requisição de cadastro finalizada");
    }
  }

  async updateRota(id: number, data: any) {
    try {
      const response = await api.patch(`/rota/${id}`, data);
      console.log("Resposta do backend:", response.data);

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar rota:");
      throw error;
    }
  }

  async deleteRota(id: number) {
    try {
      const response = await api.delete(`/rota/${id}`);
      return response;
    } catch (error) {
      console.error("Erro ao deletar rota");
      throw error;
    }
  }

}

export default new RotaService();
