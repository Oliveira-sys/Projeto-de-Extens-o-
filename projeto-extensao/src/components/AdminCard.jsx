import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { atualizarDenuncia } from '../services/supabase';

const STATUS_OPTIONS = ['PENDENTE', 'EM ANDAMENTO', 'RESOLVIDO'];

const STATUS_CORES = {
  PENDENTE: 'bg-amber-500',
  'EM ANDAMENTO': 'bg-blue-600',
  RESOLVIDO: 'bg-emerald-600',
};

export default function AdminCard({ denuncia, onAtualizado }) {
  const [status, setStatus] = useState(denuncia.status);
  const [retorno, setRetorno] = useState(denuncia.retorno || '');
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const atualizado = await atualizarDenuncia(denuncia.id, { status, retorno: retorno || null });
      onAtualizado(atualizado);
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2500);
    } catch {
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const alterado = status !== denuncia.status || retorno !== (denuncia.retorno || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4"
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-0.5">
            Protocolo #{denuncia.protocolo}
          </span>
          <h3 className="text-white font-bold text-sm leading-tight truncate">{denuncia.titulo}</h3>
          <p className="text-slate-400 text-xs mt-0.5">{denuncia.categoria} · {new Date(denuncia.created_at).toLocaleDateString('pt-BR')}</p>
        </div>
        <span className={`${STATUS_CORES[status] ?? 'bg-gray-600'} text-white text-[10px] font-black px-2 py-1 rounded whitespace-nowrap shrink-0`}>
          {status}
        </span>
      </div>

      {/* Descrição */}
      <p className="text-slate-400 text-xs leading-relaxed border-t border-slate-700 pt-3">
        {denuncia.descricao}
      </p>

      {/* Alterar Status */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Alterar Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Retorno ao Cidadão */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Retorno ao Cidadão
        </label>
        <textarea
          rows={3}
          value={retorno}
          onChange={(e) => setRetorno(e.target.value)}
          placeholder="Ex: Equipe técnica foi acionada. Prazo estimado: 5 dias úteis."
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-xs leading-relaxed outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500 resize-none"
        />
      </div>

      {/* Botão Salvar */}
      <button
        onClick={handleSalvar}
        disabled={salvando || !alterado}
        className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
          salvo
            ? 'bg-emerald-500 text-white'
            : alterado
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
        }`}
      >
        {salvo ? '✓ Salvo!' : salvando ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </motion.div>
  );
}
