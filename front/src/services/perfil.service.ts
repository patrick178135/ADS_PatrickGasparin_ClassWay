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
      console.error("Erro ao buscar perfil:", error);
      throw error;
    }
  }

  async addPerfil(data: any) {
    try {
      const response = await api.post("/perfil", data);
      return response; 
    } catch (error) {
      console.error("Erro ao adicionar perfil:", error);
      throw error;
    } finally {
      console.log("Requisição de cadastro finalizada");
    }
  }



}

export default new PerrfilService();
