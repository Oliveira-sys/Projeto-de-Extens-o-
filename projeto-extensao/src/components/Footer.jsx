import React from 'react';

export default function Footer({ onAdmin }) {
  return (
    <footer className="w-full bg-white py-5 border-t border-gray-200 flex flex-col items-center gap-2">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        Sistema de Extensão Comunitária | Anonimato Conforme LGPD
      </p>
      <button
        onClick={onAdmin}
        className="text-[10px] text-gray-300 hover:text-gray-500 transition-colors"
      >
        Área Restrita
      </button>
    </footer>
  );
}
