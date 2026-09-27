import { expect, test } from '@playwright/test';

test('client management flow', async ({ page }) => {
    const clientName = `Cliente E2E ${Date.now()}`;
    const updatedName = `${clientName} Atualizado`;

    await page.goto('/login');
    await page.getByLabel('Email address').fill('e2e@orcaflow.test');
    await page.getByRole('textbox', { name: 'Password' }).fill('password');
    await page.getByTestId('login-button').click();

    await page.getByRole('link', { name: 'Clientes' }).click();
    await page.getByTestId('create-client-link').click();

    await page.getByLabel('Nome', { exact: true }).fill(clientName);
    await page.getByLabel('NIF').fill('012345678');
    await page.getByLabel('Email').fill('cliente.e2e@example.test');
    await page.getByTestId('save-client').click();

    await expect(page).toHaveURL(/\/clients\/\d+$/);
    await expect(page.getByRole('heading', { name: clientName })).toBeVisible();

    await page.getByRole('link', { name: 'Clientes' }).first().click();
    await expect(page).toHaveURL(/\/clients$/);
    const clientRow = page.getByRole('row').filter({ hasText: clientName });
    await expect(clientRow.getByRole('cell', { name: clientName })).toBeVisible();
    await clientRow.getByRole('link', { name: 'Consultar' }).click();

    await page.getByTestId('edit-client-link').click();
    await page.getByLabel('Nome', { exact: true }).fill(updatedName);
    await page.getByTestId('save-client').click();
    await expect(page.getByRole('heading', { name: updatedName })).toBeVisible();

    await page.getByTestId('deactivate-client').click();
    await page.getByTestId('confirm-deactivate-client').click();
    await expect(page.getByTestId('client-status')).toHaveText('Inativo');

    await page.getByTestId('sidebar-menu-button').click();
    await page.getByTestId('logout-button').click();
    await expect(page).toHaveURL(/\/$/);
});
