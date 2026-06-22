// @ts-check
// Casos de teste de Autenticação (FR-001, FR-002, FR-003).
const { test } = require('@playwright/test');
const { print, login, expect } = require('./helpers');

test.describe('Autenticação', () => {
  test('TC-01 - Tela de login é exibida com seus elementos', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('FITAPP')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByText('Seu treino na palma da mão')).toBeVisible();
    await expect(page.getByPlaceholder('seu@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••')).toBeVisible();
    await expect(page.getByText('Entrar', { exact: true })).toBeVisible();
    await expect(page.getByText('💡 Contas de teste:')).toBeVisible();
    await print(page, 'TC-01-tela-login');
  });

  test('TC-02 - Login com e-mail não cadastrado exibe erro', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('seu@email.com').fill('naoexiste@email.com');
    await page.getByPlaceholder('••••••').fill('123456');
    await page.getByText('Entrar', { exact: true }).click();
    await expect(page.getByText('E-mail não cadastrado!')).toBeVisible();
    await print(page, 'TC-02-email-nao-cadastrado');
  });

  test('TC-03 - Login com senha incorreta exibe erro', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('seu@email.com').fill('joao@email.com');
    await page.getByPlaceholder('••••••').fill('senha-errada');
    await page.getByText('Entrar', { exact: true }).click();
    await expect(page.getByText('Senha incorreta!')).toBeVisible();
    await print(page, 'TC-03-senha-incorreta');
  });

  test('TC-04 - Login com sucesso leva ao painel', async ({ page }) => {
    await login(page);
    await expect(page.getByText(/Olá, João/)).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('Meus Treinos')).toBeVisible();
    await print(page, 'TC-04-login-sucesso');
  });

  test('TC-10 - Sessão persiste após recarregar a página', async ({ page }) => {
    await login(page);
    await expect(page.getByText(/Olá, João/)).toBeVisible({ timeout: 30_000 });
    await page.reload();
    // continua logado: vê o painel e NÃO volta para o login
    await expect(page.getByText(/Olá, João/)).toBeVisible({ timeout: 30_000 });
    await expect(page.getByPlaceholder('seu@email.com')).toHaveCount(0);
    await print(page, 'TC-10-sessao-persistente');
  });
});
