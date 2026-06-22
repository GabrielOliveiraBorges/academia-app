import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Fallback manual: IPv4 da máquina onde roda o json-server.
// Só é usado no celular se a detecção automática abaixo falhar.
// Para descobrir: rode `ipconfig` (Windows) e use o Endereço IPv4.
const IP_LAN = '192.168.100.10';

// No Expo Go, descobre o IP da máquina a partir do próprio servidor Expo
// (o mesmo host que o celular usou para achar o Metro). Assim o app funciona
// em QUALQUER Wi-Fi, sem precisar editar o IP manualmente.
function hostDoExpo() {
  const candidatos = [
    Constants.expoConfig?.hostUri,
    Constants.expoGoConfig?.debuggerHost,
    Constants.manifest2?.extra?.expoGo?.debuggerHost,
    Constants.manifest?.debuggerHost,
  ];
  for (const c of candidatos) {
    if (typeof c === 'string' && c.length > 0) {
      return c.split(':')[0]; // "192.168.0.5:8081" -> "192.168.0.5"
    }
  }
  return null;
}

function resolverApiUrl() {
  // No navegador (Expo Web / testes Playwright): mesmo host, porta 3000.
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `http://${window.location.hostname}:3000`;
  }
  // No celular (Expo Go): IP detectado automaticamente; senão, o fallback.
  const host = hostDoExpo() || IP_LAN;
  return `http://${host}:3000`;
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
