import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/usuario" className="ml-4">Usuários</Link>
      </div>
      <button>Sair</button>
    </nav>
  );
};

export default Navbar;
