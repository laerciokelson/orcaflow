import { expect, test } from '@playwright/test';

test('application login and logout smoke flow', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/OrçaFlow/);

    await page.getByRole('link', { name: 'Log in' }).click();
    await page.getByLabel('Email address').fill('e2e@orcaflow.test');
    await page.getByRole('textbox', { name: 'Password' }).fill('password');
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await page.getByTestId('sidebar-menu-button').click();
    await page.getByTestId('logout-button').click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
});
