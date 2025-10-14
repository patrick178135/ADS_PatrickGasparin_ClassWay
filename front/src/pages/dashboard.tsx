import React from 'react';
import Navbar from '@/src/components/NavBar';

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <main className="p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Bem-vindo ao painel!</p>
      </main>
    </>
  );
};

export default Dashboard;
