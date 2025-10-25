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
      console.error("Erro ao buscar cidade:", error);
      throw error;
    }
  }

  async addCidade(data: any) {
    try {
      const response = await api.post("/cidade", data);
      return response; 
    } catch (error) {
      console.error("Erro ao adicionar cidade:", error);
      throw error;
    } finally {
      console.log("Requisição de cadastro finalizada");
    }
  }


}

export default new CidadeService();
