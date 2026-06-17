import React from 'react';
import { motion } from 'framer-motion';
import CardMetrica from './CardMetricas'; 

export default function Dashboard({ denuncias, handleMudarStatus, getStatusBadge, fadeUpVariants }) {
  return (
    <motion.div 
      key="dashboard" 
      variants={fadeUpVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit" 
      className="w-full max-w-7xl mx-auto px-6 py-10 flex-1 flex flex-col gap-8"
    >
      {/* HEADER DO DASHBOARD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Painel de Gestão Conectado
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Área do Gestor Urbano</h2>
          <p className="text-sm text-slate-500 mt-0.5">Análise de desempenho e controle das demandas comunitárias.</p>
        </div>
        <div className="text-right bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-medium text-slate-600">
          📅 Sessão: <span className="font-bold text-slate-800">{new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {/* GRID DE CARDS DE MÉTRICA AVANÇADO */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardMetrica titulo="Total Registros" listaDados={denuncias} icone="📊" cor="bg-slate-50 text-slate-700 border-slate-200" tipo="normal" />
        <CardMetrica titulo="Pendentes na Fila" listaDados={denuncias} filtroStatus="PENDENTE" icone="⏳" cor="bg-amber-50 text-amber-600 border-amber-100" tipo="normal" />
        <CardMetrica titulo="Casos Resolvidos" listaDados={denuncias} filtroStatus="RESOLVIDO" icone="✅" cor="bg-emerald-50 text-emerald-600 border-emerald-100" tipo="progresso" />
        <CardMetrica titulo="Taxa de Sucesso" listaDados={denuncias} filtroStatus="RESOLVIDO" icone="📈" cor="bg-blue-50 text-blue-600 border-blue-100" tipo="porcentagem" />
      </div>

      {/* SEÇÃO PRINCIPAL BI-PARTIDA */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* TABELA DE GERENCIAMENTO (2/3) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Fila Ativa de Ocorrências</h3>
              <p className="text-xs text-slate-400 mt-0.5">Clique nas ações laterais para atualizar os status.</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-semibold border border-slate-200">
              {denuncias.length} itens no total
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase text-slate-400 tracking-wider bg-slate-50/30">
                  <th className="py-4 px-6 w-24">ID</th>
                  <th className="py-4 px-6">Ocorrência</th>
                  <th className="py-4 px-6 w-32">Status</th>
                  <th className="py-4 px-6 text-right w-44">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {denuncias.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-400">#{item.id}</td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 block">{item.titulo}</span>
                      <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.descricao}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={getStatusBadge(item.status)}>{item.status}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          title="Atender" 
                          onClick={() => handleMudarStatus(item.id, 'EM ANDAMENTO')} 
                          className="px-2.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-xs font-bold border border-blue-100"
                        >
                          Atender
                        </button>
                        <button 
                          title="Resolver" 
                          onClick={() => handleMudarStatus(item.id, 'RESOLVIDO')} 
                          className="px-2.5 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all text-xs font-bold border border-emerald-100"
                        >
                          Resolver
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAINEL LATERAL DE ALERTAS E FEEDBACK (1/3) */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
              <span>🚨</span> Alertas Operacionais
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-800">
                <strong className="block mb-0.5">Saneamento Crítico</strong>
                Há mais de {denuncias.filter(d => d.categoria === 'Saneamento').length} reclamações ativas nesta categoria exigindo despacho emergencial.
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800">
                <strong className="block mb-0.5">Nota do Sistema</strong>
                Todas as modificações feitas nesta tela alteram instantaneamente a visualização pública dos protocolos dos moradores.
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
              <span>📊</span> Volumetria por Setor
            </h3>
            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between font-medium text-slate-600 mb-1">
                  <span>Infraestrutura / Saneamento</span>
                  <span className="font-bold text-slate-900">{denuncias.filter(d => d.categoria === 'Saneamento').length} chamados</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-700 h-full rounded-full" style={{ width: `${denuncias.length > 0 ? (denuncias.filter(d => d.categoria === 'Saneamento').length / denuncias.length) * 100 : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-medium text-slate-600 mb-1">
                  <span>Coleta de Lixo / Limpeza</span>
                  <span className="font-bold text-slate-900">{denuncias.filter(d => d.categoria === 'Coleta de Lixo').length} chamados</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full rounded-full" style={{ width: `${denuncias.length > 0 ? (denuncias.filter(d => d.categoria === 'Coleta de Lixo').length / denuncias.length) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}