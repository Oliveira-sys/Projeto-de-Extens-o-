import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { loginAdmin } from '../services/supabase';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro(false);
    try {
      await loginAdmin(email, senha);
      onLogin();
    } catch (err) {
      setErro(true);
      setSenha('');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl"
      >
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">🛡️</span>
          <h1 className="text-xl font-black text-white tracking-tight">Área Administrativa</h1>
          <p className="text-slate-400 text-sm mt-1">Acesso restrito à prefeitura</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              E-mail
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErro(false); }}
              placeholder="admin@prefeitura.gov.br"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Senha de acesso
            </label>
            <input
              required
              type="password"
              value={senha}
              onChange={(e) => { setSenha(e.target.value); setErro(false); }}
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          {erro && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-xs font-semibold text-center"
            >
              E-mail ou senha incorretos.
            </motion.p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white py-3 rounded-lg font-bold text-sm transition-colors shadow-lg mt-2"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
