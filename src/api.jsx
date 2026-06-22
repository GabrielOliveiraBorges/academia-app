import { Platform } from 'react-native';

// IPv4 da máquina onde roda o json-server (usado pelo Expo Go no celular).
// Para descobrir: rode `ipconfig` (Windows) e use o Endereço IPv4.
const IP_LAN = '192.168.100.10';

function resolverApiUrl() {
  // No navegador (Expo Web / testes Playwright), fala com o json-server no
  // mesmo host (localhost), dispensando edição manual de IP.
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `http://${window.location.hostname}:3000`;
  }
  // No celular via Expo Go, é preciso o IP da máquina na mesma rede Wi-Fi.
  return `http://${IP_LAN}:3000`;
}

export const API_URL = resolverApiUrl();

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
