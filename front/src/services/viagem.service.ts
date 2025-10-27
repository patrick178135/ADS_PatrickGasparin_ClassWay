import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002",
});

class ViagemService {

  async getViagens() {
    try {
      const response = await api.get("/viagem");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar viagens:");
      throw error;
    }
  }

  async addViagem(data: any) {
    try {
      const response = await api.post("/viagem", data);
      return response; 
    } catch (error) {
      console.error("Erro ao adicionar viagem:");
      throw error;
    } finally {
      console.log("Requisição de cadastro finalizada");
    }
  }

  async updateViagem(id: number, data: any) {
    try {
      const response = await api.patch(`/viagem/${id}`, data);
      console.log("Resposta do backend:", response.data);

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar viagem:");
      throw error;
    }
  }

  async deleteViagem(id: number) {
    try {
      const response = await api.delete(`/viagem/${id}`);
      return response;
    } catch (error) {
      console.error("Erro ao deletar viagem");
      throw error;
    }
  }

}

export default new ViagemService();
