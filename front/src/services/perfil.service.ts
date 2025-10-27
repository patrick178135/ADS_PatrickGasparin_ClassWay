import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002",
});

class PerrfilService {

  async getPerfis() {
    try {
      const response = await api.get("/perfil");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil:");
      throw error;
    }
  }

  async addPerfil(data: any) {
    try {
      const response = await api.post("/perfil", data);
      return response; 
    } catch (error) {
      console.error("Erro ao adicionar perfil:");
      throw error;
    } finally {
      console.log("Requisição de cadastro finalizada");
    }
  }

  async updatePerfil(id: number, data: any) {
    try {
      const response = await api.patch(`/perfil/${id}`, data);
      console.log("Resposta do backend:", response.data);

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:");
      throw error;
    }
  }

  async deletePerfil(id: number) {
    try {
      const response = await api.delete(`/perfil/${id}`);
      return response;
    } catch (error) {
      console.error("Erro ao deletar perfil");
      throw error;
    }
  }

}

export default new PerrfilService();
