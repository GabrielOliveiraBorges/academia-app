const API_URL = 'http://localhost:3000';
let usuario = null;
let treinoAtual = null;

document.addEventListener('DOMContentLoaded', () => {
  const dadosUsuario = localStorage.getItem('usuarioLogado');
  if (!dadosUsuario) {
    window.location.href = 'index.html';
    return;
  }

  usuario = JSON.parse(dadosUsuario);
  exibirDadosUsuario();
  carregarTreinos();
  carregarEstatisticas();

  document.getElementById('formTreino').addEventListener('submit', salvarTreino);
});

function exibirDadosUsuario() {
  document.getElementById('nomeUsuario').textContent = usuario.nome;
  document.getElementById('avatarUsuario').textContent = usuario.nome.charAt(0).toUpperCase();
  document.getElementById('saudacao').textContent = `Olá, ${usuario.nome.split(' ')[0]}! 👋`;
}

async function sair() {
  const ok = await confirmarAcao({
    titulo: 'Sair do app?',
    mensagem: 'Você precisará fazer login novamente.',
    icone: '👋',
    textoConfirmar: 'Sair',
    tipo: 'perigo'
  });
  if (ok) {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
  }
}

async function carregarTreinos() {
  const container = document.getElementById('listaTreinos');
  container.innerHTML = '<p class="vazio">Carregando...</p>';

  try {
    const resposta = await fetch(`${API_URL}/treinos`);
    const todos = await resposta.json();
    const treinos = todos.filter(t => String(t.usuario_id) === String(usuario.id));

    if (treinos.length === 0) {
      container.innerHTML = '<p class="vazio">Nenhum treino cadastrado. Clique em "+ Novo Treino" para começar!</p>';
      return;
    }

    container.innerHTML = '';
    treinos.forEach(treino => {
      try {
        container.appendChild(criarCardTreino(treino));
      } catch (err) {
        console.error('Erro ao renderizar treino:', treino, err);
      }
    });
  } catch (erro) {
    console.error('ERRO DETALHADO:', erro);
    container.innerHTML = `<p class="vazio" style="color:#ef4444">Erro: ${erro.message}</p>`;
  }
}
function criarCardTreino(treino) {
  const card = document.createElement('div');
  card.className = 'treino-card';
  card.innerHTML = `
    <span class="tipo">${treino.tipo}</span>
    <h4>${treino.nome}</h4>
    <p style="color:#b0b0b0;font-size:13px">${treino.descricao || 'Sem descrição'}</p>
    <div class="info">
    <span>⏱️ ${formatarDuracao(treino.duracao_minutos)}</span>
    <span>📅 ${formatarData(treino.data_criacao)}</span>
    </div>
    <div class="treino-actions">
      <button class="btn-acao btn-iniciar" onclick="verDetalhes('${treino.id}')">▶ Ver</button>
      <button class="btn-acao btn-editar" onclick="editarTreino('${treino.id}')">✏️</button>
      <button class="btn-acao btn-excluir" onclick="excluirTreino('${treino.id}')">🗑️</button>
    </div>
  `;
  return card;
}

function abrirModalNovo() {
  document.getElementById('tituloModal').textContent = 'Novo Treino';
  document.getElementById('treinoId').value = '';
  document.getElementById('formTreino').reset();
  document.getElementById('duracaoHoras').value = 1;
  document.getElementById('duracaoMinutos').value = 0;
  document.getElementById('modalTreino').classList.add('ativo');
}

async function editarTreino(id) {
  try {
    const resposta = await fetch(`${API_URL}/treinos/${id}`);
    const treino = await resposta.json();
    const totalMin = treino.duracao_minutos || 0;
    document.getElementById('duracaoHoras').value = Math.floor(totalMin / 60);
    document.getElementById('duracaoMinutos').value = totalMin % 60;
    document.getElementById('tituloModal').textContent = 'Editar Treino';
    document.getElementById('treinoId').value = treino.id;
    document.getElementById('nomeTreino').value = treino.nome;
    document.getElementById('tipoTreino').value = treino.tipo;
    document.getElementById('descricaoTreino').value = treino.descricao || '';

    document.getElementById('modalTreino').classList.add('ativo');
  } catch (erro) {
    alert('Erro ao carregar treino');
  }
}


function fecharModal() {
  document.getElementById('modalTreino').classList.remove('ativo');
}

async function salvarTreino(e) {
  e.preventDefault();

  const id = document.getElementById('treinoId').value;
  const treino = {
    nome: document.getElementById('nomeTreino').value,
    tipo: document.getElementById('tipoTreino').value,
    descricao: document.getElementById('descricaoTreino').value,
    duracao_minutos: (parseInt(document.getElementById('duracaoHoras').value) || 0) * 60
      + (parseInt(document.getElementById('duracaoMinutos').value) || 0), usuario_id: usuario.id,
    personal_id: 3,
    data_criacao: new Date().toISOString().split('T')[0]
  };

  try {
    let resposta;
    let treinoSalvo;
    if (id) {
      resposta = await fetch(`${API_URL}/treinos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...treino, id: id })
      });
      treinoSalvo = await resposta.json();
    } else {
      resposta = await fetch(`${API_URL}/treinos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(treino)
      });
      treinoSalvo = await resposta.json();
    }

    if (!resposta.ok) throw new Error('Erro ao salvar');

    fecharModal();
    await carregarTreinos();
    await carregarEstatisticas();

    if (!id && treinoSalvo.id) {
      if (!id && treinoSalvo.id) {
        const quer = await confirmarAcao({
          titulo: 'Treino criado! 🎉',
          mensagem: 'Deseja adicionar exercícios a este treino agora?',
          icone: '💪',
          textoConfirmar: 'Sim, adicionar',
          textoCancelar: 'Depois'
        });
        if (quer) verDetalhes(treinoSalvo.id);
      }
    }
  } catch (erro) {
    alert('Erro ao salvar treino: ' + erro.message);
  }
}

async function excluirTreino(id) {
  const ok = await confirmarAcao({
    titulo: 'Excluir treino?',
    mensagem: 'Todos os exercícios vinculados também serão removidos. Esta ação não pode ser desfeita.',
    icone: '🗑️',
    textoConfirmar: 'Excluir',
    tipo: 'perigo'
  });
  if (!ok) return;

  try {
    const respEx = await fetch(`${API_URL}/treino_exercicios`);
    const todosEx = await respEx.json();
    const exDoTreino = todosEx.filter(te => String(te.treino_id) === String(id));
    for (const te of exDoTreino) {
      await fetch(`${API_URL}/treino_exercicios/${te.id}`, { method: 'DELETE' });
    }

    const resposta = await fetch(`${API_URL}/treinos/${id}`, { method: 'DELETE' });
    if (!resposta.ok) throw new Error('Erro ao excluir');

    mostrarToast('Treino excluído com sucesso!', 'sucesso');
    carregarTreinos();
    carregarEstatisticas();
  } catch (erro) {
    mostrarToast('Erro ao excluir treino', 'erro');
  }
}

async function verDetalhes(treinoId) {
  try {
    const respTreino = await fetch(`${API_URL}/treinos/${treinoId}`);
    const treino = await respTreino.json();
    treinoAtual = treino;

    const respEx = await fetch(`${API_URL}/treino_exercicios`);
    const todosEx = await respEx.json();
    const treinoEx = todosEx.filter(te => String(te.treino_id) === String(treinoId));

    const respCat = await fetch(`${API_URL}/exercicios`);
    const catalogo = await respCat.json();

    let html = `
      <div style="margin-bottom:16px">
        <p style="color:#b0b0b0;margin-bottom:8px">${treino.descricao || ''}</p>
        <span style="background:rgba(255,107,0,0.2);color:#ff6b00;padding:4px 10px;border-radius:4px;font-size:12px">${treino.tipo}</span>
        <span style="color:#b0b0b0;font-size:13px;margin-left:12px">⏱️ ${formatarDuracao(treino.duracao_minutos)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h4 style="color:#ff6b00">Exercícios (${treinoEx.length})</h4>
        <button class="btn-novo" onclick="abrirModalExercicio('${treinoId}')">+ Adicionar Exercício</button>
      </div>
    `;

    if (treinoEx.length === 0) {
      html += '<p class="vazio">Nenhum exercício. Clique em "+ Adicionar Exercício" acima.</p>';
    } else {
      treinoEx.sort((a, b) => a.ordem - b.ordem).forEach(te => {
        const ex = catalogo.find(e => String(e.id) === String(te.exercicio_id));
        const nomeEx = ex ? ex.nome : 'Exercício não encontrado';
        const grupoEx = ex ? ex.grupo_muscular : '-';

        html += `
          <div class="exercicio-item">
            <div style="display:flex;justify-content:space-between;align-items:start;gap:8px">
              <div style="flex:1">
                <h5>${nomeEx}</h5>
                <div class="exercicio-info">
                  <span>💪 ${grupoEx}</span>
                  <span>🔢 ${te.series} séries</span>
                  <span>🔁 ${te.repeticoes} reps</span>
                  <span>⚖️ ${te.carga_kg} kg</span>
                  <span>⏸️ ${formatarDescanso(te.descanso_seg)}</span>   
             </div>
              </div>
              <div style="display:flex;flex-direction:column;gap:4px">
                <button class="btn-acao btn-editar" style="padding:4px 10px;font-size:12px" onclick="editarExercicio('${te.id}','${treinoId}')">✏️</button>
                <button class="btn-acao btn-excluir" style="padding:4px 10px;font-size:12px" onclick="excluirExercicio('${te.id}','${treinoId}')">🗑️</button>
              </div>
            </div>
          </div>
        `;
      });
    }

    document.getElementById('tituloDetalhes').textContent = treino.nome;
    document.getElementById('conteudoDetalhes').innerHTML = html;
    document.getElementById('modalDetalhes').classList.add('ativo');
  } catch (erro) {
    console.error(erro);
    alert('Erro ao carregar detalhes');
  }
}

function fecharDetalhes() {
  document.getElementById('modalDetalhes').classList.remove('ativo');
  treinoAtual = null;
}

async function abrirModalExercicio(treinoId, exercicioRegId = null) {
  const resp = await fetch(`${API_URL}/exercicios`);
  const catalogo = await resp.json();

  let valores = { exercicio_id: '', series: 3, repeticoes: '10-12', carga_kg: 0, descanso_seg: 60, ordem: 1 };

  if (exercicioRegId) {
    const r = await fetch(`${API_URL}/treino_exercicios/${exercicioRegId}`);
    valores = await r.json();
  }

  const optionsHtml = catalogo.map(e =>
    `<option value="${e.id}" ${String(e.id) === String(valores.exercicio_id) ? 'selected' : ''}>${e.nome} (${e.grupo_muscular})</option>`
  ).join('');

  const html = `
    <h3 style="color:#ff6b00;margin-bottom:20px">${exercicioRegId ? 'Editar' : 'Adicionar'} Exercício</h3>
    <form id="formExercicio">
      <input type="hidden" id="exRegId" value="${exercicioRegId || ''}">
      <input type="hidden" id="exTreinoId" value="${treinoId}">
      <div class="form-group">
        <label>Exercício</label>
        <select id="exExercicioId" required>
          <option value="">Selecione...</option>
          ${optionsHtml}
        </select>
      </div>
      <div class="form-group">
        <label>Séries</label>
        <input type="number" id="exSeries" min="1" max="10" value="${valores.series}" required>
      </div>
      <div class="form-group">
        <label>Repetições (ex: 10 ou 10-12)</label>
        <input type="text" id="exReps" value="${valores.repeticoes}" required>
      </div>
      <div class="form-group">
        <label>Carga (kg)</label>
        <input type="number" id="exCarga" step="0.5" min="0" value="${valores.carga_kg}" required>
      </div>
     <div class="form-group">
  <label>Descanso</label>
      <div style="display:flex;gap:10px">
        <div style="flex:1">
          <input type="number" id="descansoMin" min="0" max="10" value="${Math.floor(valores.descanso_seg / 60)}">
          <small style="color:#b0b0b0;font-size:12px">minutos</small>
        </div>
        <div style="flex:1">
          <input type="number" id="descansoSeg" min="0" max="59" value="${valores.descanso_seg % 60}">
          <small style="color:#b0b0b0;font-size:12px">segundos</small>
        </div>
      </div>
    </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-secundario" onclick="fecharModalExercicio()">Cancelar</button>
        <button type="submit" class="btn">Salvar</button>
      </div>
    </form>
  `;

  document.getElementById('modalDetalhes').classList.remove('ativo');

  let modalEx = document.getElementById('modalExercicio');
  if (!modalEx) {
    modalEx = document.createElement('div');
    modalEx.id = 'modalExercicio';
    modalEx.className = 'modal-overlay';
    modalEx.innerHTML = '<div class="modal" id="modalExercicioContent"></div>';
    document.body.appendChild(modalEx);
  }
  document.getElementById('modalExercicioContent').innerHTML = html;
  modalEx.classList.add('ativo');

  document.getElementById('formExercicio').addEventListener('submit', salvarExercicio);
}

function fecharModalExercicio() {
  const modal = document.getElementById('modalExercicio');
  if (modal) modal.classList.remove('ativo');
  if (treinoAtual) verDetalhes(treinoAtual.id);
}

async function salvarExercicio(e) {
  e.preventDefault();

  const regId = document.getElementById('exRegId').value;
  const treinoId = document.getElementById('exTreinoId').value;

  const dados = {
    treino_id: treinoId,
    exercicio_id: document.getElementById('exExercicioId').value,
    series: parseInt(document.getElementById('exSeries').value),
    repeticoes: document.getElementById('exReps').value,
    carga_kg: parseFloat(document.getElementById('exCarga').value),
    descanso_seg: (parseInt(document.getElementById('descansoMin').value) || 0) * 60
      + (parseInt(document.getElementById('descansoSeg').value) || 0), ordem: 1
  };

  try {
    if (regId) {
      await fetch(`${API_URL}/treino_exercicios/${regId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dados, id: regId })
      });
    } else {
      await fetch(`${API_URL}/treino_exercicios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    }
    fecharModalExercicio();
  } catch (erro) {
    alert('Erro ao salvar exercício');
  }
}

async function editarExercicio(regId, treinoId) {
  abrirModalExercicio(treinoId, regId);
}

async function excluirExercicio(regId, treinoId) {
  const ok = await confirmarAcao({
    titulo: 'Remover exercício?',
    mensagem: 'Este exercício será removido do treino.',
    icone: '🗑️',
    textoConfirmar: 'Remover',
    tipo: 'perigo'
  });
  if (!ok) return;

  try {
    await fetch(`${API_URL}/treino_exercicios/${regId}`, { method: 'DELETE' });
    mostrarToast('Exercício removido!', 'sucesso');
    verDetalhes(treinoId);
  } catch (erro) {
    mostrarToast('Erro ao excluir', 'erro');
  }
}

async function marcarConcluido(e) {
  if (e) e.preventDefault();
  if (!treinoAtual) return;

  const registro = {
    usuario_id: usuario.id,
    treino_id: treinoAtual.id,
    data_execucao: new Date().toISOString().split('T')[0],
    duracao_real: treinoAtual.duracao_minutos,
    concluido: true,
    avaliacao: 5
  };

  try {
    const resposta = await fetch(`${API_URL}/historico_treinos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registro)
    });

    if (!resposta.ok) throw new Error('Erro ao registrar');

    mostrarToast('Treino concluído! Bom trabalho! 💪', 'sucesso');

    setTimeout(() => {
      fecharDetalhes();
      carregarEstatisticas();
    }, 400);
  } catch (erro) {
    mostrarToast('Erro ao registrar treino', 'erro');
  }
}
async function carregarEstatisticas() {
  try {
    const [respTreinos, respHist] = await Promise.all([
      fetch(`${API_URL}/treinos`),
      fetch(`${API_URL}/historico_treinos`)
    ]);

    const todosTreinos = await respTreinos.json();
    const todoHistorico = await respHist.json();

    const treinos = todosTreinos.filter(t => String(t.usuario_id) === String(usuario.id));
    const historico = todoHistorico.filter(h => String(h.usuario_id) === String(usuario.id));

    document.getElementById('totalTreinos').textContent = treinos.length;
    document.getElementById('treinosConcluidos').textContent = historico.filter(h => h.concluido).length;

    if (historico.length > 0) {
      const ultimo = historico.sort((a, b) => new Date(b.data_execucao) - new Date(a.data_execucao))[0];
      document.getElementById('ultimoTreino').textContent = formatarData(ultimo.data_execucao);
    } else {
      document.getElementById('ultimoTreino').textContent = 'Nenhum';
    }
  } catch (erro) {
    console.error('Erro ao carregar estatísticas:', erro);
  }
}

function confirmarAcao(opcoes) {
  return new Promise((resolve) => {
    const {
      titulo = 'Confirmar',
      mensagem = 'Tem certeza?',
      icone = '⚠️',
      textoConfirmar = 'Confirmar',
      textoCancelar = 'Cancelar',
      tipo = 'normal' // 'normal', 'perigo'
    } = opcoes;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay ativo';
    overlay.style.zIndex = '2000';

    const corBotao = tipo === 'perigo'
      ? 'background:#ef4444'
      : 'background:#ff6b00';

    overlay.innerHTML = `
      <div class="modal-confirm">
        <div class="modal-confirm-icon">${icone}</div>
        <h3>${titulo}</h3>
        <p>${mensagem}</p>
        <div class="modal-confirm-actions">
          <button class="btn btn-secundario" id="btnCancelar">${textoCancelar}</button>
          <button class="btn" id="btnConfirmar" style="${corBotao}">${textoConfirmar}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#btnConfirmar').onclick = () => {
      overlay.remove();
      resolve(true);
    };
    overlay.querySelector('#btnCancelar').onclick = () => {
      overlay.remove();
      resolve(false);
    };
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.remove();
        resolve(false);
      }
    };
  });
}

function mostrarToast(mensagem, tipo = 'sucesso') {
  console.log('🍞 mostrarToast chamado:', mensagem, 'em', new Date().toISOString());

  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;

  const icone = tipo === 'sucesso' ? '✅' : tipo === 'erro' ? '❌' : 'ℹ️';
  toast.innerHTML = `
    <span class="toast-icon">${icone}</span>
    <span>${mensagem}</span>
  `;

  document.body.appendChild(toast);

  toast._timer = setTimeout(() => {
    toast.classList.add('saindo');
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 300);
  }, 4500);
}
function formatarDescanso(segundos) {
  const seg = Number(segundos) || 0;
  if (seg <= 0) return '-';
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}min`;
  return `${m}min ${s}s`;
}

function formatarDuracao(minutos) {
  const min = Number(minutos) || 0;
  if (min <= 0) return '-';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function formatarDescanso(segundos) {
  if (!segundos || segundos <= 0) return '-';
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}min`;
  return `${m}min ${s}s`;
}

function formatarData(dataStr) {
  if (!dataStr) return '-';
  const d = new Date(dataStr);
  return d.toLocaleDateString('pt-BR');
}