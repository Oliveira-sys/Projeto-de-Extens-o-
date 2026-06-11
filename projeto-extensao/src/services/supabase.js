import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Lista todas as denúncias, da mais recente para a mais antiga.
 */
export async function listarDenuncias() {
  const { data, error } = await supabase
    .from('denuncias')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Insere uma nova denúncia no banco.
 * @param {{ protocolo: string, titulo: string, categoria: string, descricao: string }} denuncia
 */
export async function criarDenuncia(denuncia) {
  const { data, error } = await supabase
    .from('denuncias')
    .insert([denuncia])
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Busca por protocolo de 4 dígitos. Retorna null se não encontrada.
 * @param {string} protocolo
 */
export async function buscarPorProtocolo(protocolo) {
  const { data, error } = await supabase
    .from('denuncias')
    .select('*')
    .eq('protocolo', protocolo)
    .single();
  if (error) return null;
  return data;
}

/**
 * Lista TODAS as denúncias para o painel admin (mais recentes primeiro).
 */
export async function listarTodasDenuncias() {
  const { data, error } = await supabase
    .from('denuncias')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Atualiza o status e/ou retorno de uma denúncia pelo id.
 * @param {string} id
 * @param {{ status?: string, retorno?: string }} campos
 */
export async function atualizarDenuncia(id, campos) {
  const { data, error } = await supabase
    .from('denuncias')
    .update(campos)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// --- Autenticação Admin ---

export async function loginAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function logoutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function verificarSessao() {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
}


