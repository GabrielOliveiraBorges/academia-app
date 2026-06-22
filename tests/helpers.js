// @ts-check
const { expect } = require('@playwright/test');
const path = require('path');

const API = 'http://localhost:3000';
const EVID_DIR = path.join(__dirname, 'evidencias');

/** Salva uma evidência de print em tests/evidencias/<nome>.png */
async function print(page, nome) {
  await page.screenshot({ path: path.join(EVID_DIR, `${nome}.png`), fullPage: true });
}

/** Realiza login pela UI e espera o painel carregar. */
async function login(page, email = 'joao@email.com', senha = '123456') {
  await page.goto('/');
  await page.getByPlaceholder('seu@email.com').fill(email);
  await page.getByPlaceholder('••••••').fill(senha);
  await page.getByText('Entrar', { exact: true }).click();
}

module.exports = { API, EVID_DIR, print, login, expect };
