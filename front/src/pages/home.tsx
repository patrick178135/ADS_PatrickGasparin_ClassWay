import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { Libre_Caslon_Text } from "next/font/google";
import router from "next/router";

const libreCaslon = Libre_Caslon_Text({
  subsets: ['latin'],
  weight: '400',
});

const Home = () => {
  const { usuario, loading, carregarUsuario } = useAuth();
  const [horaAtual, setHoraAtual] = useState(new Date());

  // carrega o usuário e atualiza o relógio a cada 1000 milissegundo 
  useEffect(() => {
    carregarUsuario();
    const interval = setInterval(() => {
      setHoraAtual(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (!usuario)
    return (
      <>
        <p>Usuário não logado</p>
        <a href="login">Voltar para o Login</a>
      </>
    ); 

  const dataFormatada = horaAtual.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const horaFormatada = horaAtual.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <>
    <title>Home</title>
    
    <body className={`${libreCaslon.className} bg-`} > 


      <div className="container text-center mt-5" >
        <h2 className="mb-5 text-dark">Bem-vindo, {usuario.nome}!</h2>
        <p className="text-dark mb-5 ">{dataFormatada}</p>
        <h1 className="display-1 fw-bold text-primary m-5">{horaFormatada}</h1>
      </div>
    </body>
    </>
  );
};

export default Home;
