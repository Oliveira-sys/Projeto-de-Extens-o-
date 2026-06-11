import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';
import CardOcorrencia from './components/CardOcorrencia';
import Navbar from './components/Navbar';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { listarDenuncias, criarDenuncia, buscarPorProtocolo, verificarSessao } from './services/supabase';


export default function App() {
  const [tela, setTela] = useState('home');
  const [adminAutenticado, setAdminAutenticado] = useState(false);
  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroConexao, setErroConexao] = useState(false);

  const [buscaProtocolo, setBuscaProtocolo] = useState('');
  const [denunciaEncontrada, setDenunciaEncontrada] = useState(null);
  const [erroBusca, setErroBusca] = useState(false);

  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('Saneamento');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [protocoloGerado, setProtocoloGerado] = useState(null);

  const [enviando, setEnviando] = useState(false);
  const [buscando, setBuscando] = useState(false);

  // Carrega as denúncias do banco e verifica sessão ao montar o componente
  useEffect(() => {
    async function inicializar() {
      try {
        setCarregando(true);
        const [dados, logado] = await Promise.all([
          listarDenuncias(),
          verificarSessao()
        ]);
        setDenuncias(dados);
        setAdminAutenticado(logado);
      } catch {
        setErroConexao(true);
      } finally {
        setCarregando(false);
      }
    }
    inicializar();
  }, []);

  const handleCriarDenuncia = async (e) => {
    e.preventDefault();
    setEnviando(true);
    const protocolo = Math.floor(1000 + Math.random() * 9000).toString();
    try {
      const nova = await criarDenuncia({
        protocolo,
        titulo: novoTitulo,
        categoria: novaCategoria,
        descricao: novaDescricao,
      });
      setDenuncias([nova, ...denuncias]);
      setProtocoloGerado(nova.protocolo);
      setNovoTitulo('');
      setNovaDescricao('');
    } catch {
      alert('Erro ao registrar denúncia. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const handleBuscarProtocolo = async (e) => {
    e.preventDefault();
    setBuscando(true);
    try {
      const resultado = await buscarPorProtocolo(buscaProtocolo.trim());
      if (resultado) {
        setDenunciaEncontrada(resultado);
        setErroBusca(false);
      } else {
        setDenunciaEncontrada(null);
        setErroBusca(true);
      }
    } catch {
      setDenunciaEncontrada(null);
      setErroBusca(true);
    } finally {
      setBuscando(false);
    }
  };


  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDENTE': return 'bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded';
      case 'EM ANDAMENTO': return 'bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded';
      case 'RESOLVIDO': return 'bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded';
      default: return 'bg-gray-500 text-white';
    }
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
  };

  // Renderiza área admin separada (fora do layout normal)
  if (tela === 'admin-login') {
    return <AdminLogin onLogin={() => { setAdminAutenticado(true); setTela('admin'); }} />;
  }
  if (tela === 'admin') {
    if (!adminAutenticado) {
      return <AdminLogin onLogin={() => { setAdminAutenticado(true); setTela('admin'); }} />;
    }
    return <AdminDashboard onSair={() => { setAdminAutenticado(false); setTela('home'); }} />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans antialiased m-0 p-0 overflow-x-hidden">

      {/* Componente Header */}
      <Navbar
        setTela={setTela}
        setProtocoloGerado={setProtocoloGerado}
        setDenunciaEncontrada={setDenunciaEncontrada}
      />

      {/*  PRINCIPAL */}
      <div className="w-full flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">

          {/* TELA 1: HOME PRINCIPAL */}
          {tela === 'home' && (
            <motion.div key="home" variants={fadeUpVariants} initial="hidden" animate="visible" exit="exit" className="w-full flex-1 flex flex-col">
              <div className="w-full bg-slate-950 text-white py-20 px-6 text-center border-b border-slate-800">
                <div className="max-w-3xl mx-auto">
                  <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">Canal Oficial Urbano</motion.span>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-4 mb-4 text-white">Canal de Denúncias Comunitárias</h2>
                  <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-10">Espaço totalmente anônimo e seguro para relatar problemas de infraestrutura no seu bairro.</p>

                  <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <button onClick={() => setTela('criar')} className="bg-emerald-600 hover:bg-emerald-700 p-6 rounded-xl shadow-lg transition-all hover:-translate-y-1 text-left flex items-start gap-4 group">
                      <span className="text-3xl bg-emerald-500/20 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">📝</span>
                      <div>
                        <h3 className="font-bold text-lg mb-1 text-white">Fazer uma Denúncia</h3>
                        <p className="text-emerald-100/70 text-xs leading-relaxed">Relate buracos na rua, falta de água, iluminação precária ou lixo acumulado.</p>
                      </div>
                    </button>

                    <button onClick={() => setTela('acompanhar')} className="bg-blue-600 hover:bg-blue-700 p-6 rounded-xl shadow-lg transition-all hover:-translate-y-1 text-left flex items-start gap-4 group">
                      <span className="text-3xl bg-blue-500/20 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">🔍</span>
                      <div>
                        <h3 className="font-bold text-lg mb-1 text-white">Acompanhar Denúncia</h3>
                        <p className="text-blue-100/70 text-xs leading-relaxed">Consulte em tempo real o andamento e o status do seu registro usando o protocolo.</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-7xl mx-auto px-6 py-16">
                <div className="flex flex-col items-center mb-10">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Últimas Ocorrências Registradas</h3>
                  <div className="h-1 w-12 bg-emerald-500 rounded mt-2"></div>
                </div>

                {erroConexao ? (
                  <p className="text-center text-red-500 font-semibold">Não foi possível conectar ao banco de dados.</p>
                ) : carregando ? (
                  <p className="text-center text-slate-400 animate-pulse">Carregando ocorrências...</p>
                ) : denuncias.length === 0 ? (
                  <p className="text-center text-slate-400">Nenhuma ocorrência registrada ainda.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {denuncias.slice(0, 4).map((item, index) => (
                      <CardOcorrencia
                        key={item.id}
                        item={{ ...item, data: new Date(item.created_at).toLocaleDateString('pt-BR') }}
                        index={index}
                        getStatusBadge={getStatusBadge}
                      />
                    ))}
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* TELA 2: FORMULÁRIO DE CADASTRO */}
          {tela === 'criar' && (
            <motion.div key="criar" variants={fadeUpVariants} initial="hidden" animate="visible" exit="exit" className="w-full flex-1 max-w-2xl mx-auto px-6 py-12 flex flex-col justify-center">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200/80 w-full">
                {!protocoloGerado ? (
                  <>
                    <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Registrar Nova Denúncia</h2>
                    <p className="text-sm text-gray-500 mb-6">O preenchimento é simplificado e protege a sua identidade através do anonimato.</p>

                    <form onSubmit={handleCriarDenuncia} className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">O que está acontecendo? (Título Objetivo)</label>
                        <input required type="text" value={novoTitulo} onChange={e => setNovoTitulo(e.target.value)} placeholder="Ex: Vazamento de água limpa na calçada" className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Categoria do Problema</label>
                        <select value={novaCategoria} onChange={e => setNovaCategoria(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm cursor-pointer">
                          <option value="Saneamento">Saneamento / Água</option>
                          <option value="Infraestrutura">Infraestrutura (Buraco/Asfalto)</option>
                          <option value="Coleta de Lixo">Coleta de Lixo / Descarte</option>
                          <option value="Iluminação">Iluminação Pública</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Descrição do Problema e Localização</label>
                        <textarea required rows="4" value={novaDescricao} onChange={e => setNovaDescricao(e.target.value)} placeholder="Detalhe o ocorrido informando a rua, número aproximado ou pontos de referência..." className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm leading-relaxed"></textarea>
                      </div>

                      <div className="flex gap-4 pt-2">
                        <button type="button" onClick={() => setTela('home')} className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors">Cancelar</button>
                        <button type="submit" disabled={enviando} className="w-1/2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-3 rounded-lg font-bold text-sm shadow-sm transition-colors">{enviando ? 'Enviando...' : 'Enviar Registro'}</button>
                      </div>
                    </form>
                  </>
                ) : (
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
                    <span className="text-5xl block mb-4">🎉</span>
                    <h2 className="text-2xl font-black text-emerald-600 mb-1 tracking-tight">Ocorrência Protocolada!</h2>
                    <p className="text-gray-500 text-sm mb-6">Guarde o código gerado pelo sistema. Ele é a sua única chave de acesso.</p>

                    <motion.div initial={{ rotate: -2 }} animate={{ rotate: 0 }} className="bg-slate-100 border-2 border-dashed border-slate-300 p-5 rounded-xl max-w-xs mx-auto mb-8">
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block mb-1">Código de Protocolo</span>
                      <span className="text-3xl font-mono font-black text-slate-800 tracking-widest">{protocoloGerado}</span>
                    </motion.div>

                    <div className="flex flex-col gap-3 max-w-sm mx-auto">
                      <button onClick={() => { setTela('acompanhar'); setBuscaProtocolo(protocoloGerado); setDenunciaEncontrada(denuncias[0]); }} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-bold text-sm transition-colors shadow">Consultar Status Agora</button>
                      <button onClick={() => setTela('home')} className="text-slate-500 font-bold hover:text-slate-800 text-xs transition-colors py-2">Voltar ao Início</button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* TELA 3: ACOMPANHAR PROTOCOLO */}
          {tela === 'acompanhar' && (
            <motion.div key="acompanhar" variants={fadeUpVariants} initial="hidden" animate="visible" exit="exit" className="w-full flex-1 max-w-2xl mx-auto px-6 py-12 flex flex-col justify-center">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200/80 w-full">
                <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Consultar Protocolo</h2>
                <p className="text-sm text-gray-500 mb-6">Insira o identificador numérico de 4 dígitos para checar o progresso.</p>

                <form onSubmit={handleBuscarProtocolo} className="flex gap-3 mb-8">
                  <input required type="text" maxLength="4" placeholder="Ex: 1024" value={buscaProtocolo} onChange={e => setBuscaProtocolo(e.target.value)} className="flex-1 border border-gray-300 rounded-lg p-3 bg-gray-50 font-mono text-center text-xl font-black tracking-widest outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
                  <input type="hidden" />
                  <button type="submit" disabled={buscando} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 rounded-lg font-bold text-sm shadow-sm transition-colors">{buscando ? '...' : 'Pesquisar'}</button>
                </form>

                <AnimatePresence>
                  {denunciaEncontrada && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-gray-200 pt-6 space-y-5 overflow-hidden">
                      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-gray-200/60">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold block tracking-wider uppercase mb-0.5">Título do Registro</span>
                          <h4 className="text-base font-bold text-slate-900">{denunciaEncontrada.titulo}</h4>
                        </div>
                        <span className={getStatusBadge(denunciaEncontrada.status)}>{denunciaEncontrada.status}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-400 block font-bold uppercase tracking-wider mb-0.5">Eixo / Categoria</span>
                          <span className="font-bold text-slate-700 text-sm">{denunciaEncontrada.categoria}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-bold uppercase tracking-wider mb-0.5">Abertura do Processo</span>
                          <span className="font-bold text-slate-700 text-sm">{new Date(denunciaEncontrada.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider mb-1.5">Relato Completo</span>
                        <p className="text-sm text-slate-600 bg-gray-50 p-4 rounded-xl border border-gray-200/40 leading-relaxed">{denunciaEncontrada.descricao}</p>
                      </div>

                      {denunciaEncontrada.retorno && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                          <span className="text-xs text-emerald-700 block font-bold uppercase tracking-wider mb-1.5">💬 Retorno da Prefeitura</span>
                          <p className="text-sm text-emerald-800 leading-relaxed">{denunciaEncontrada.retorno}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {erroBusca && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-semibold text-center">
                    Nenhuma denúncia encontrada com o protocolo <strong>{buscaProtocolo}</strong>.
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>


      <Footer onAdmin={() => setTela('admin-login')} />
    </div>
  );
}