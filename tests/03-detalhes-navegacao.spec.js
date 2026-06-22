// @ts-check
// Casos de teste de Detalhes do treino e Navegação (FR-010, FR-011).
const { test } = require('@playwright/test');
const { print, login, expect } = require('./helpers');

test.describe('Detalhes e Navegação', () => {
  test('TC-11 - Abrir os detalhes de um treino', async ({ page }) => {
    await login(page);
    await expect(page.getByText('Treino A - Peito e Tríceps')).toBeVisible({ timeout: 30_000 });

    await page.getByText('▶ Ver').first().click();
    await expect(page.getByText(/Exercícios \(/)).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('✓ Concluir Treino')).toBeVisible();
    await print(page, 'TC-11-detalhes-treino');
  });

  test('TC-12 - Abrir o formulário de adicionar exercício', async ({ page }) => {
    await login(page);
    await expect(page.getByText('Treino A - Peito e Tríceps')).toBeVisible({ timeout: 30_000 });

    await page.getByText('▶ Ver').first().click();
    await expect(page.getByText(/Exercícios \(/)).toBeVisible({ timeout: 30_000 });
    await page.getByText('+ Adicionar', { exact: true }).click();

    await expect(page.getByText('Selecione...')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('Séries', { exact: true })).toBeVisible();
    await print(page, 'TC-12-form-exercicio');
  });

  test('TC-13 - Cancelar a criação de treino volta ao painel', async ({ page }) => {
    await login(page);
    await expect(page.getByText(/Olá, João/)).toBeVisible({ timeout: 30_000 });

    await page.getByText('+ Novo', { exact: true }).click();
    await expect(page.getByPlaceholder('Ex: Treino A - Peito')).toBeVisible();
    await page.getByText('Cancelar', { exact: true }).click();

    await expect(page.getByText('Meus Treinos')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/Olá, João/)).toBeVisible();
    await print(page, 'TC-13-cancelar-volta-painel');
  });
});
