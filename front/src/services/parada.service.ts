import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002",
});

class ParadaService {

  async getParadas() {
    try {
      const response = await api.get("/parada");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar Paradas:");
      throw error;
    }
  }

  async addParada(data: any) {
    try {
      const response = await api.post("/parada", data);
      return response; 
    } catch (error) {
      console.error("Erro ao adicionar Parada:");
      throw error;
    } finally {
      console.log("Requisição de cadastro finalizada");
    }
  }

  async updateParada(id: number, data: any) {
    try {
      const response = await api.patch(`/parada/${id}`, data);
      console.log("Resposta do backend:", response.data);

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar Parada:");
      throw error;
    }
  }

  async deleteParada(id: number) {
    try {
      const response = await api.delete(`/parada/${id}`);
      return response;
    } catch (error) {
      console.error("Erro ao deletar Parada");
      throw error;
    }
  }

}

export default new ParadaService();
