import React from 'react';
import { motion } from 'framer-motion';

export default function CardOcorrencia({ item, index, getStatusBadge }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
    >
      <div>
        <div className="flex justify-between items-start mb-4 gap-2">
          <span className="text-[11px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded uppercase tracking-wide">{item.categoria}</span>
          <span className={getStatusBadge(item.status)}>{item.status}</span>
        </div>
        <h4 className="font-bold text-slate-900 text-base mb-1 line-clamp-1">{item.titulo}</h4>
        <p className="text-[11px] text-gray-400 font-medium mb-3">Registrado em: {item.data}</p>
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{item.descricao}</p>
      </div>
    </motion.div>
  );
}