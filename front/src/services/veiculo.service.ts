import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002",
});

class VeiculoService {

  async getVeiculos() {
    try {
      const response = await api.get("/veiculo");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar Veiculos:");
      throw error;
    }
  }

  async addVeiculo(data: any) {
    try {
      const response = await api.post("/veiculo", data);
      return response; 
    } catch (error) {
      console.error("Erro ao adicionar Veiculo:");
      throw error;
    } finally {
      console.log("Requisição de cadastro finalizada");
    }
  }

  async updateVeiculo(id: number, data: any) {
    try {
      const response = await api.patch(`/veiculo/${id}`, data);
      console.log("Resposta do backend:", response.data);

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar Veiculo:");
      throw error;
    }
  }

  async deleteVeiculo(id: number) {
    try {
      const response = await api.delete(`/veiculo/${id}`);
      return response;
    } catch (error) {
      console.error("Erro ao deletar Veiculo");
      throw error;
    }
  }

}

export default new VeiculoService();
