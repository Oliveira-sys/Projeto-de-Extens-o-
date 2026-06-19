import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminCard from '../components/AdminCard';
import { listarTodasDenuncias, logoutAdmin } from '../services/supabase';

const FILTROS = ['TODOS', 'PENDENTE', 'EM ANDAMENTO', 'RESOLVIDO'];

export default function AdminDashboard({ onSair }) {
  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('TODOS');

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarTodasDenuncias();
        setDenuncias(dados);
      } catch {
        alert('Erro ao carregar denúncias.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const handleAtualizado = (atualizado) => {
    setDenuncias((prev) =>
      prev.map((d) => (d.id === atualizado.id ? atualizado : d))
    );
  };

  const handleSair = async () => {
    await logoutAdmin();
    onSair();
  };

  const denunciasFiltradas =
    filtro === 'TODOS' ? denuncias : denuncias.filter((d) => d.status === filtro);

  const contagem = {
    PENDENTE: denuncias.filter((d) => d.status === 'PENDENTE').length,
    'EM ANDAMENTO': denuncias.filter((d) => d.status === 'EM ANDAMENTO').length,
    RESOLVIDO: denuncias.filter((d) => d.status === 'RESOLVIDO').length,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-black tracking-tight">Painel Administrativo</h1>
          <p className="text-slate-400 text-xs">Canal de Denúncias Comunitárias</p>
        </div>
        <button
          onClick={handleSair}
          className="text-slate-400 hover:text-red-400 text-xs font-bold transition-colors border border-slate-700 hover:border-red-500/50 px-3 py-1.5 rounded-lg"
        >
          Sair
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Pendentes', valor: contagem.PENDENTE, cor: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
            { label: 'Em Andamento', valor: contagem['EM ANDAMENTO'], cor: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
            { label: 'Resolvidos', valor: contagem.RESOLVIDO, cor: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          ].map(({ label, valor, cor, bg }) => (
            <div key={label} className={`${bg} border rounded-xl p-4 text-center`}>
              <span className={`text-3xl font-black ${cor}`}>{valor}</span>
              <p className="text-slate-400 text-xs mt-1 font-semibold">{label}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTROS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filtro === f
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {f} {f !== 'TODOS' && `(${contagem[f] ?? 0})`}
            </button>
          ))}
        </div>

        {/* Lista de Denúncias */}
        {carregando ? (
          <p className="text-center text-slate-400 animate-pulse py-20">Carregando denúncias...</p>
        ) : denunciasFiltradas.length === 0 ? (
          <p className="text-center text-slate-500 py-20">Nenhuma denúncia encontrada.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {denunciasFiltradas.map((d) => (
              <AdminCard key={d.id} denuncia={d} onAtualizado={handleAtualizado} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
