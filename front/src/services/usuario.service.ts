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
      console.error("Erro ao adicionar usuário:");
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
      console.error("Erro ao buscar Usuário:");
      throw error;
    }
  }

  async getAdmins() {
    try {
      const response = await api.get("/usuario/admin");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar Alunos:");
      throw error;
    }
  }

  async getMotristas() {
    try {
      const response = await api.get("/usuario/motorista");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar Alunos:");
      throw error;
    }
  }

  async getAlunos() {
    try {
      const response = await api.get("/usuario/aluno");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar Alunos:");
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
      console.error("Erro ao fazer login:");
      throw error;
    }
  }

  async updateUsuario(id: number, data: any) {
    try {
      const response = await api.patch(`/usuario/${id}`, data);
      console.log("Resposta do backend:", response.data);

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar usuário:");
      throw error;
    }
  }

  async deleteUsuario(id: number) {
    try {
      const response = await api.delete(`/usuario/${id}`);
      return response;
    } catch (error) {
      console.error("Erro ao deletar usuário");
      throw error;
    }
  }
}

export default new UsuarioService();
