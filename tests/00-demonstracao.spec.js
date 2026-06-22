// @ts-check
// Vídeo-tour de demonstração — percorre as principais telas do FitApp num
// fluxo contínuo (gera um único vídeo limpo da aplicação funcionando).
// Não altera dados: usa navegação (Cancelar/Voltar) em vez de gravar.
const { test } = require('@playwright/test');
const { login, expect } = require('./helpers');

// pausa curta só para o vídeo ficar legível
const pausa = (page, ms = 1200) => page.waitForTimeout(ms);

test('DEMO - Tour completo do FitApp', async ({ page }) => {
  // 1) Tela de login
  await page.goto('/');
  await expect(page.getByText('FITAPP')).toBeVisible({ timeout: 60_000 });
  await pausa(page);

  // 2) Autenticação
  await page.getByPlaceholder('seu@email.com').fill('joao@email.com');
  await page.getByPlaceholder('••••••').fill('123456');
  await pausa(page, 800);
  await page.getByText('Entrar', { exact: true }).click();

  // 3) Painel: estatísticas + lista de treinos
  await expect(page.getByText(/Olá, João/)).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('Meus Treinos')).toBeVisible();
  await pausa(page, 1600);

  // 4) Formulário de novo treino (preenche e cancela — sem alterar dados)
  await page.getByText('+ Novo', { exact: true }).click();
  await page.getByPlaceholder('Ex: Treino A - Peito').fill('Treino Demonstração');
  await page.getByPlaceholder('Ex: Peito/Tríceps').fill('Full Body');
  await page.getByPlaceholder('Detalhes do treino...').fill('Exemplo de criação de treino');
  await pausa(page, 1600);
  await page.getByText('Cancelar', { exact: true }).click();
  await expect(page.getByText('Meus Treinos')).toBeVisible();
  await pausa(page, 800);

  // 5) Detalhes do treino (exercícios + concluir)
  await page.getByText('▶ Ver').first().click();
  await expect(page.getByText(/Exercícios \(/)).toBeVisible({ timeout: 30_000 });
  await pausa(page, 1600);

  // 6) Adicionar exercício: abre o seletor e escolhe um exercício
  await page.getByText('+ Adicionar', { exact: true }).click();
  await expect(page.getByText('Selecione...')).toBeVisible({ timeout: 30_000 });
  await pausa(page, 800);
  await page.getByText('Selecione...').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Selecione um exercício')).toBeVisible({ timeout: 10_000 });
  await pausa(page, 2000); // exibe o catálogo de exercícios no vídeo
  await dialog.getByText('Supino Reto').click(); // escolhe um exercício
  await expect(page.getByText('Supino Reto (Peito)')).toBeVisible({ timeout: 10_000 });
  await pausa(page, 1600);

  // fim do tour
});
