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

  async getViagensHistoricoAluno(id: number) {
    try {
      const response = await api.get(`/viagem/historico/aluno/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar viagens:");
      throw error;
    }
  }

  async getViagensAgendaAluno(id: number) {
    try {
      const response = await api.get(`/viagem/agenda/aluno/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar viagens:");
      throw error;
    }
  }

  async getViagensHistoricoMotorista(id: number) {
    try {
      const response = await api.get(`/viagem/historico/motorista/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar viagens:");
      throw error;
    }
  }

  async getViagensAgendaMotorista(id: number) {
    try {
      const response = await api.get(`/viagem/agenda/motorista/${id}`);
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

  async adicionarAluno(idViagem: number, idAluno: number) {
    try {
      const response = await api.post(`/viagem/${idViagem}/aluno/${idAluno}`);
      return response;
    } catch (error) {
      console.error(`Erro ao adicionar aluno ${idAluno} à viagem ${idViagem}:`);
      throw error;
    }
  }

  async removerAluno(idViagem: number, idAluno: number) {
    try {
      const response = await api.delete(`/viagem/${idViagem}/aluno/${idAluno}`);
      return response;
    } catch (error) {
      console.error(`Erro ao remover aluno ${idAluno} da viagem ${idViagem}:`);
      throw error;
    }
  }

}

export default new ViagemService();
