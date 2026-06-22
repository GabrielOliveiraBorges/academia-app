// @ts-check
// Casos de teste de Treinos / Painel (FR-004 a FR-008).
const { test } = require('@playwright/test');
const { API, print, login, expect } = require('./helpers');

const NOME_TESTE = 'Treino TESTE E2E';

async function treinosDoJoao(page) {
  const r = await page.request.get(`${API}/treinos`);
  const todos = await r.json();
  return todos.filter((t) => String(t.usuario_id) === '1');
}

test.describe('Treinos e Painel', () => {
  test('TC-05 - Painel exibe as estatísticas (Total/Concluídos/Último)', async ({ page }) => {
    await login(page);
    await expect(page.getByText(/Olá, João/)).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('Total', { exact: true })).toBeVisible();
    await expect(page.getByText('Concluídos', { exact: true })).toBeVisible();
    await expect(page.getByText('Último', { exact: true })).toBeVisible();
    await print(page, 'TC-05-painel-estatisticas');
  });

  test('TC-06 - Lista exibe os treinos do usuário logado', async ({ page }) => {
    await login(page);
    await expect(page.getByText('Treino A - Peito e Tríceps')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('Treino B - Costas e Bíceps')).toBeVisible();
    await expect(page.getByText('Treino C - Pernas')).toBeVisible();
    await print(page, 'TC-06-lista-treinos');
  });

  test('TC-07 - Criar um novo treino', async ({ page }) => {
    await login(page);
    await expect(page.getByText(/Olá, João/)).toBeVisible({ timeout: 30_000 });

    const antes = (await treinosDoJoao(page)).length;

    await page.getByText('+ Novo', { exact: true }).click();
    await page.getByPlaceholder('Ex: Treino A - Peito').fill(NOME_TESTE);
    await page.getByPlaceholder('Ex: Peito/Tríceps').fill('Full Body');
    await page.getByPlaceholder('Detalhes do treino...').fill('Treino criado pelo teste automatizado');
    await print(page, 'TC-07-formulario-preenchido');
    await page.getByText('Salvar', { exact: true }).click();

    // o treino é persistido via POST /treinos
    await expect
      .poll(async () => (await treinosDoJoao(page)).length, { timeout: 20_000 })
      .toBe(antes + 1);
    await print(page, 'TC-07-treino-criado');

    // limpeza: remove o treino de teste para manter o db.json estável
    const criados = (await treinosDoJoao(page)).filter((t) => t.nome === NOME_TESTE);
    for (const t of criados) {
      await page.request.delete(`${API}/treinos/${t.id}`);
    }
  });

  test('TC-08 - Validação: nome e tipo são obrigatórios', async ({ page }) => {
    await login(page);
    await expect(page.getByText(/Olá, João/)).toBeVisible({ timeout: 30_000 });

    const antes = (await treinosDoJoao(page)).length;

    await page.getByText('+ Novo', { exact: true }).click();
    await expect(page.getByPlaceholder('Ex: Treino A - Peito')).toBeVisible();
    // tenta salvar com os campos vazios
    await page.getByText('Salvar', { exact: true }).click();

    // permanece no formulário e nenhum treino é criado
    await expect(page.getByPlaceholder('Ex: Treino A - Peito')).toBeVisible();
    const depois = (await treinosDoJoao(page)).length;
    expect(depois).toBe(antes);
    await print(page, 'TC-08-validacao-campos-obrigatorios');
  });

  test('TC-09 - Editar um treino existente', async ({ page }) => {
    // guarda o estado original do treino 1 para restaurar ao final
    const original = await (await page.request.get(`${API}/treinos/1`)).json();
    const nomeEditado = 'Treino A - EDITADO';

    await login(page);
    await expect(page.getByText('Treino A - Peito e Tríceps')).toBeVisible({ timeout: 30_000 });

    await page.getByText('✏️ Editar').first().click();
    const campoNome = page.getByPlaceholder('Ex: Treino A - Peito');
    await expect(campoNome).toBeVisible();
    await campoNome.fill(nomeEditado);
    await print(page, 'TC-09-editando-treino');
    await page.getByText('Salvar', { exact: true }).click();

    // volta ao painel com o novo nome
    await expect(page.getByText(nomeEditado)).toBeVisible({ timeout: 30_000 });
    await print(page, 'TC-09-treino-editado');

    // restaura o estado original
    await page.request.put(`${API}/treinos/1`, { data: original });
  });
});
