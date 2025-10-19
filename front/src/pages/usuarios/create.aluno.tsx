import { useState, FormEvent } from "react";
import { useRouter } from "next/router";

export default function CreateAluno() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [idade, setIdade] = useState<number | "">("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const novoAluno = { nome, email, idade };

    try {
      const resposta = await fetch("http://localhost:8080/alunos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoAluno),
      });

      if (resposta.ok) {
        setMensagem("Aluno cadastrado com sucesso!");
        setTimeout(() => router.push("/alunos"), 2000);
      } else {
        setMensagem("Erro ao cadastrar aluno.");
      }
    } catch (erro) {
      console.error(erro);
      setMensagem("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Cadastrar Aluno</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">Nome</label>
          <input
            id="nome"
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">E-mail</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="idade" className="form-label">Idade</label>
          <input
            id="idade"
            type="number"
            className="form-control"
            value={idade}
            onChange={(e) => setIdade(e.target.value ? parseInt(e.target.value) : "")}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </form>

      {mensagem && (
        <div className="alert alert-info mt-3" role="alert">
          {mensagem}
        </div>
      )}
    </div>
  );
}
