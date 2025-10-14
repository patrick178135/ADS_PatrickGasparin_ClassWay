import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/src/context/AuthContext";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, senha);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Erro ao logar");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email" />
        <input value={senha} onChange={(e)=>setSenha(e.target.value)} placeholder="senha" type="password" />
        <button type="submit">Entrar</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
