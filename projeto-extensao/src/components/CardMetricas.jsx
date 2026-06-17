import React from 'react';
import { motion } from 'framer-motion';

export default function CardMetrica({ titulo, icone, cor, listaDados = [], filtroStatus, tipo = 'normal' }) {

  const totalGeral = listaDados.length;
  const valorContagem = filtroStatus 
    ? listaDados.filter(d => d.status === filtroStatus).length
    : totalGeral;

  const porcentagem = totalGeral > 0 ? Math.round((valorContagem / totalGeral) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-slate-300 hover:shadow-md transition-all duration-300"
    >
      {/* Efeito de brilho de fundo no hover */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-50 rounded-full blur-xl group-hover:bg-slate-100 transition-colors duration-300 -z-10" />

      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
            {titulo}
          </span>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
            {valorContagem}
            {tipo === 'porcentagem' && <span className="text-lg font-bold text-slate-400">%</span>}
          </h3>
        </div>
        <div className={`p-2.5 rounded-xl text-xl shadow-xs border ${cor}`}>
          {icone}
        </div>
      </div>

      {/* DETALHAMENTO EXTRA BASEADO NO TIPO DO CARD */}
      {tipo === 'progresso' && (
        <div className="mt-2">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-500 font-medium">Meta de Conclusão</span>
            <span className="font-bold text-slate-800">{porcentagem}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${porcentagem}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-emerald-500 h-full rounded-full"
            />
          </div>
        </div>
      )}

      {tipo === 'porcentagem' && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <span className="text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
            ↑ Eficiência
          </span>
          <span className="text-slate-500 font-medium">dos problemas resolvidos.</span>
        </div>
      )}

      {tipo === 'normal' && (
        <div className="mt-2 text-xs text-slate-400 font-medium flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" />
          Atualizado em tempo real
        </div>
      )}

    </motion.div>
  );
}