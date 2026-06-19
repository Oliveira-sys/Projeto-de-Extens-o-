import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./components/Footer";
import CardOcorrencia from "./components/CardOcorrencia";
import Navbar from "./components/Navbar";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./components/Dashboard";

import { 
  listarDenuncias, 
  criarDenuncia, 
  buscarPorProtocolo, 
  verificarSessao 
} from "./services/supabase"; 

export default function App() {
  const [tela, setTela] = useState("home");
  const [denuncias, setDenuncias] = useState([]); // Começa vazio para carregar do banco

  const [buscaProtocolo, setBuscaProtocolo] = useState("");
  const [denunciaEncontrada, setDenunciaEncontrada] = useState(null);
  const [erroBusca, setErroBusca] = useState(false);

  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("Saneamento");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [protocoloGerado, setProtocoloGerado] = useState(null);

  const [enviando, setEnviando] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erroConexao, setErroConexao] = useState(false);
  const [adminAutenticado, setAdminAutenticado] = useState(false);

  useEffect(() => {
    async function inicializar() {
      try {
        setCarregando(true);
        // Busca as denúncias públicas do Supabase
        const dados = await listarDenuncias();
        setDenuncias(dados || []);
        
        // Verifica se o admin já está logado no navegador
        const logado = await verificarSessao();
        setAdminAutenticado(logado);
      } catch (error) {
        console.error("Erro ao conectar ao Supabase:", error);
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
    // Gera o protocolo de 4 dígitos que seu app usa
    const protocolo = Math.floor(1000 + Math.random() * 9000).toString();
    
    try {
      const nova = await criarDenuncia({
        protocolo,
        titulo: novoTitulo,
        categoria: novaCategoria,
        descricao: novaDescricao,
        status: "PENDENTE"
      });

      setDenuncias([nova, ...denuncias]);
      setProtocoloGerado(nova.protocolo || protocolo);
      setNovoTitulo('');
      setNovaDescricao('');
    } catch (error) {
      console.error(error);
      alert('Erro ao registrar denúncia no banco de dados. Tente novamente.');
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
    } catch (error) {
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
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
  };

  // Redireciona o clique do footer baseado na sessão
  const handleCliqueAdmin = () => {
    if (adminAutenticado) {
      setTela("admin-dashboard");
    } else {
      setTela("login-admin");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans antialiased m-0 p-0 overflow-x-hidden">
      
      {/* Esconde a navbar se estiver nas telas de gerenciamento do admin */}
      {tela !== "login-admin" && tela !== "admin-dashboard" && (
        <Navbar
          setTela={setTela}
          setProtocoloGerado={setProtocoloGerado}
          setDenunciaEncontrada={setDenunciaEncontrada}
        />
      )}

      <div className="w-full flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          
          {/* TELA 1: HOME */}
          {tela === "home" && (
            <motion.div key="home" variants={fadeUpVariants} initial="hidden" animate="visible" exit="exit" className="w-full flex-1 flex flex-col">
              <div className="w-full bg-slate-950 text-white py-20 px-6 text-center border-b border-slate-800">
                <div className="max-w-3xl mx-auto">
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">Canal Oficial Urbano</span>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-4 mb-4 text-white">Canal de Denúncias Comunitárias</h2>
                  <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-10">Espaço totalmente anônimo e seguro para relatar problemas de infraestrutura no seu bairro.</p>

                  <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <button onClick={() => setTela("criar")} className="bg-emerald-600 hover:bg-emerald-700 p-6 rounded-xl shadow-lg transition-all hover:-translate-y-1 text-left flex items-start gap-4 group">
                      <span className="text-3xl bg-emerald-500/20 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">📝</span>
                      <div>
                        <h3 className="font-bold text-lg mb-1 text-white">Fazer uma Denúncia</h3>
                        <p className="text-emerald-100/70 text-xs leading-relaxed">Relate buracos na rua, falta de água ou iluminação pública.</p>
                      </div>
                    </button>

                    <button onClick={() => setTela('acompanhar')} className="bg-blue-600 hover:bg-blue-700 p-6 rounded-xl shadow-lg transition-all hover:-translate-y-1 text-left flex items-start gap-4 group">
                      <span className="text-3xl bg-blue-500/20 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">🔍</span>
                      <div>
                        <h3 className="font-bold text-lg mb-1 text-white">Acompanhar Denúncia</h3>
                        <p className="text-blue-100/70 text-xs leading-relaxed">Consulte em tempo real o andamento usando o seu protocolo.</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* LISTAGEM DE ÚLTIMAS OCORRÊNCIAS */}
              <div className="w-full max-w-7xl mx-auto px-6 py-16">
                <div className="flex flex-col items-center mb-10">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Últimas Ocorrências Registradas</h3>
                  <div className="h-1 w-12 bg-emerald-500 rounded mt-2"></div>
                </div>

                {erroConexao ? (
                  <p className="text-center text-red-500 font-semibold">Não foi possível conectar ao banco de dados.</p>
                ) : carregando ? (
                  <p className="text-center text-slate-400 animate-pulse">Carregando ocorrências do banco...</p>
                ) : denuncias.length === 0 ? (
                  <p className="text-center text-slate-400">Nenhuma ocorrência registrada ainda.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {denuncias.slice(0, 4).map((item, index) => (
                      <CardOcorrencia 
                        key={item.id} 
                        item={{ ...item, data: item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : item.data }} 
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
          {tela === "criar" && (
            <motion.div key="criar" variants={fadeUpVariants} initial="hidden" animate="visible" exit="exit" className="w-full flex-1 max-w-2xl mx-auto px-6 py-12 flex flex-col justify-center">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200/80 w-full">
                {!protocoloGerado ? (
                  <>
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Registrar Nova Denúncia</h2>
                    <form onSubmit={handleCriarDenuncia} className="space-y-4">
                      <input required type="text" placeholder="Título Objetivo" value={novoTitulo} onChange={e => setNovoTitulo(e.target.value)} className="w-full border p-3 rounded-lg" />
                      
                      <select value={novaCategoria} onChange={e => setNovaCategoria(e.target.value)} className="w-full border p-3 rounded-lg bg-gray-50">
                        <option value="Saneamento">Saneamento / Água</option>
                        <option value="Infraestrutura">Infraestrutura (Buraco/Asfalto)</option>
                        <option value="Coleta de Lixo">Coleta de Lixo / Descarte</option>
                        <option value="Iluminação">Iluminação Pública</option>
                      </select>

                      <textarea required rows="4" placeholder="Detalhe o ocorrido informando o local..." value={novaDescricao} onChange={e => setNovaDescricao(e.target.value)} className="w-full border p-3 rounded-lg" />
                      
                      <div className="flex gap-4">
                        <button type="button" onClick={() => setTela('home')} className="w-1/2 border py-3 rounded-lg font-bold text-sm">Cancelar</button>
                        <button type="submit" disabled={enviando} className="w-1/2 bg-emerald-600 text-white py-3 rounded-lg font-bold text-sm">{enviando ? 'Enviando...' : 'Enviar Registro'}</button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <span className="text-5xl block mb-4">🎉</span>
                    <h2 className="text-2xl font-black text-emerald-600 mb-1">Ocorrência Protocolada!</h2>
                    <p className="text-gray-500 text-sm mb-6">Guarde o código gerado pelo sistema.</p>
                    <div className="bg-slate-100 border-2 border-dashed p-5 rounded-xl max-w-xs mx-auto mb-8">
                      <span className="text-3xl font-mono font-black text-slate-800 tracking-widest">{protocoloGerado}</span>
                    </div>
                    <button onClick={() => { setTela("acompanhar"); setBuscaProtocolo(protocoloGerado); }} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold text-sm">Consultar Status Agora</button>
                    <button onClick={() => { setTela("home"); setProtocoloGerado(null); }} className="text-slate-500 font-bold block text-xs mx-auto mt-4">Voltar ao Início</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TELA 3: ACOMPANHAR PROTOCOLO */}
          {tela === "acompanhar" && (
            <motion.div key="acompanhar" variants={fadeUpVariants} initial="hidden" animate="visible" exit="exit" className="w-full flex-1 max-w-2xl mx-auto px-6 py-12 flex flex-col justify-center">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200/80 w-full">
                <h2 className="text-2xl font-black text-slate-900 mb-4">Consultar Protocolo</h2>
                <form onSubmit={handleBuscarProtocolo} className="flex gap-2 mb-4">
                  <input type="text" placeholder="Ex: 1024" maxLength="4" value={buscaProtocolo} onChange={e => setBuscaProtocolo(e.target.value)} className="border p-3 rounded-lg flex-1 text-center font-mono font-black text-xl" />
                  <button type="submit" disabled={buscando} className="bg-blue-600 text-white px-6 rounded-lg font-bold text-sm">{buscando ? '...' : 'Pesquisar'}</button>
                </form>

                {denunciaEncontrada && (
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                      <div>
                        <span className="text-xs text-gray-400 block">Título</span>
                        <h4 className="font-bold text-slate-900">{denunciaEncontrada.titulo}</h4>
                      </div>
                      <span className={getStatusBadge(denunciaEncontrada.status)}>{denunciaEncontrada.status}</span>
                    </div>
                    <p className="text-sm bg-gray-50 p-4 rounded-xl"><strong>Relato:</strong> {denunciaEncontrada.descricao}</p>
                    
                    {denunciaEncontrada.retorno && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
                        <strong>💬 Resposta da Prefeitura:</strong> {denunciaEncontrada.retorno}
                      </div>
                    )}
                  </div>
                )}

                {erroBusca && <p className="text-center text-red-500 text-sm mt-4">Nenhum registro encontrado com esse protocolo.</p>}
                <button type="button" onClick={() => { setTela("home"); setDenunciaEncontrada(null); setErroBusca(false); }} className="mt-6 text-gray-500 block text-sm mx-auto">Voltar</button>
              </div>
            </motion.div>
          )}

          {/* 🔐 TELA DE LOGIN DO ADMIN */}
          {tela === "login-admin" && (
            <AdminLogin onLogin={() => {
              setAdminAutenticado(true);
              setTela("admin-dashboard");
            }} />
          )}

          {/* 🛡️ DASHBOARD DO ADMIN (RENDERIZA OS ADMIN CARDS) */}
          {tela === "admin-dashboard" && (
            <AdminDashboard onSair={() => {
              setAdminAutenticado(false);
              setTela("home");
            }} />
          )}

        </AnimatePresence>
      </div>

      {/* Footer só aparece fora do painel administrativo logado */}
      {tela !== "admin-dashboard" && <Footer onAdmin={handleCliqueAdmin} />} 
    </div>
  );
}