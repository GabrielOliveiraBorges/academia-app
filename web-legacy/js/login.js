const API_URL = 'http://localhost:3000';

const formLogin = document.getElementById('formLogin');
const mensagemErro = document.getElementById('mensagemErro');

if (localStorage.getItem('usuarioLogado')) {
  window.location.href = 'home.html';
}

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  mensagemErro.style.display = 'none';

  try {
    const resposta = await fetch(`${API_URL}/usuarios?email=${email}`);

    if (!resposta.ok) {
      throw new Error('Erro ao conectar com o servidor');
    }

    const usuarios = await resposta.json();

    if (usuarios.length === 0) {
      mostrarErro('E-mail não cadastrado!');
      return;
    }

    const usuario = usuarios[0];

    if (usuario.senha !== senha) {
      mostrarErro('Senha incorreta!');
      return;
    }

    localStorage.setItem('usuarioLogado', JSON.stringify({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo
    }));

    window.location.href = 'home.html';

  } catch (erro) {
    console.error('Erro no login:', erro);
    mostrarErro('Erro ao conectar com o servidor. Verifique se o json-server está rodando na porta 3000.');
  }
});

function mostrarErro(mensagem) {
  mensagemErro.textContent = mensagem;
  mensagemErro.style.display = 'block';
}
