import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002",
});

class UsuarioService {

  async addUsuario(data: any) {
    try {
      const response = await api.post("/usuario", data);
      return response; // retorna o objeto completo (status, data etc.)
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      throw error;
    } finally {
      console.log("Requisição de cadastro finalizada");
    }
  }


  async getUsuarios() {
    try {
      const response = await api.get("/usuario");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  }

  
  async login(data: { email: string; senha: string }) {
    try {
      const response = await api.post("/auth", data);
      const token = response.data.token;

      // Armazena o token no localStorage (para manter login)
      if (token) {
        localStorage.setItem("token", token);
      }

      return response.data; // retorna { token, user, ... }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  }
}

export default new UsuarioService();
