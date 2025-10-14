// src/modules/auth/services/auth.service.ts
import api from "@/src/services/api";

export const login = async (email: string, senha: string) => {
  const { data } = await api.post("/auth/login", { email, senha });
  return data; 
};

export const me = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};
