import React from 'react';

export default function Navbar({ setTela, setProtocoloGerado, setDenunciaEncontrada }) {
  const resetarEstados = () => {
    setTela('home');
    setProtocoloGerado(null);
    setDenunciaEncontrada(null);
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={resetarEstados}>
          <span className="text-2xl">📢</span>
          <h1 className="font-black text-xl tracking-tight text-slate-900 block">VOZ DA COMUNIDADE</h1>
        </div>
        <nav className="flex items-center gap-6">
          <button onClick={() => setTela('home')} className="text-gray-600 hover:text-slate-900 font-semibold text-sm transition-colors">Home</button>
          <button onClick={() => { setTela('acompanhar'); setDenunciaEncontrada(null); }} className="text-gray-600 hover:text-slate-900 font-semibold text-sm transition-colors">Acompanhar Protocolo</button>
          
          {/* CORRIGIDO AQUI: Alterado de 'dashboard' para 'estatisticas' */}
          <button onClick={() => setTela('estatisticas')} className="text-gray-600 hover:text-slate-900 font-semibold text-sm transition-colors flex items-center gap-1">📊 Dashboard</button>
          
          <button onClick={() => { setTela('criar'); setProtocoloGerado(null); }} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-lg font-bold shadow-sm transition-colors">Fazer uma Denúncia</button>
        </nav>
      </div>
    </header>
  );
}