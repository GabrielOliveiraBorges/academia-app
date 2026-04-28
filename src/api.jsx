export const API_URL = 'http://192.168.100.10:3000';

async function request(path, options = {}) {
  const resposta = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} em ${path}`);
  }
  if (options.method === 'DELETE') return null;
  return resposta.json();
}

export const api = {
  buscarUsuarioPorEmail: (email) =>
    request(`/usuarios?email=${encodeURIComponent(email)}`),

  listarTreinos: () => request('/treinos'),
  obterTreino: (id) => request(`/treinos/${id}`),
  criarTreino: (treino) =>
    request('/treinos', { method: 'POST', body: JSON.stringify(treino) }),
  atualizarTreino: (id, treino) =>
    request(`/treinos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...treino, id }),
    }),
  excluirTreino: (id) => request(`/treinos/${id}`, { method: 'DELETE' }),

  listarExercicios: () => request('/exercicios'),

  listarTreinoExercicios: () => request('/treino_exercicios'),
  obterTreinoExercicio: (id) => request(`/treino_exercicios/${id}`),
  criarTreinoExercicio: (te) =>
    request('/treino_exercicios', { method: 'POST', body: JSON.stringify(te) }),
  atualizarTreinoExercicio: (id, te) =>
    request(`/treino_exercicios/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...te, id }),
    }),
  excluirTreinoExercicio: (id) =>
    request(`/treino_exercicios/${id}`, { method: 'DELETE' }),

  listarHistorico: () => request('/historico_treinos'),
  registrarHistorico: (registro) =>
    request('/historico_treinos', {
      method: 'POST',
      body: JSON.stringify(registro),
    }),
};
