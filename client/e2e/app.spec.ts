import { expect, test } from '@playwright/test';

test.describe('Pedalboard Demo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ページタイトルが表示される', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Pedalboard Demo');
    await expect(page.locator('.app-header p')).toHaveText(
      'Guitar Effect Simulator',
    );
  });

  test('ファイル選択のセレクトボックスが表示される', async ({ page }) => {
    // Wait for files to load
    await page.waitForSelector('select#input-file', { timeout: 5000 });
    const select = page.locator('select#input-file');
    await expect(select).toBeVisible();
  });

  test('エフェクトボードが表示される', async ({ page }) => {
    await expect(page.locator('.effector-board')).toBeVisible();
    // At least one effect card should be visible
    await expect(page.locator('.effector-card').first()).toBeVisible();
  });

  test('Process Audio ボタンが表示される', async ({ page }) => {
    const button = page.locator('button.process-button');
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Process Audio');
  });

  test('ファイル未選択時は Process ボタンが無効', async ({ page }) => {
    const button = page.locator('button.process-button');
    await expect(button).toBeDisabled();
  });

  test('Input/Output プレイヤーが表示される', async ({ page }) => {
    const audioPlayers = page.locator('.audio-player');
    await expect(audioPlayers).toHaveCount(2);
    await expect(
      page.locator('.audio-player-label', { hasText: 'Input' }),
    ).toBeVisible();
    await expect(
      page.locator('.audio-player-label', { hasText: 'Output' }),
    ).toBeVisible();
  });
});

test.describe('エフェクト操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('エフェクトをクリックでON/OFF切り替え', async ({ page }) => {
    const firstCard = page.locator('.effector-card').first();
    const checkbox = firstCard.locator('input[type="checkbox"]');

    // Get initial state
    const initialChecked = await checkbox.isChecked();

    // Click to toggle
    await checkbox.click();

    // Verify state changed
    const newChecked = await checkbox.isChecked();
    expect(newChecked).not.toBe(initialChecked);
  });

  test('有効なエフェクトの数が表示される', async ({ page }) => {
    await expect(page.locator('.enabled-count')).toBeVisible();
  });
});

test.describe('音声処理フロー (Local Mode)', () => {
  test('ファイル選択後に処理を実行できる', async ({ page }) => {
    await page.goto('/');

    // Wait for file list to load
    const select = page.locator('select#input-file');
    await expect(select).toBeVisible({ timeout: 5000 });

    // Wait for options to be populated
    await expect(select.locator('option:not([value=""])').first()).toBeAttached(
      { timeout: 5000 },
    );

    // Select the first available file
    const firstOption = await select
      .locator('option:not([value=""])')
      .first()
      .getAttribute('value');

    if (firstOption) {
      await select.selectOption(firstOption);

      // Enable at least one effect
      const firstCheckbox = page
        .locator('.effector-card input[type="checkbox"]')
        .first();
      if (!(await firstCheckbox.isChecked())) {
        await firstCheckbox.click();
      }

      // Click process button
      const processButton = page.locator('button.process-button');
      await expect(processButton).toBeEnabled();
      await processButton.click();

      // Wait for processing to complete
      await expect(processButton).toHaveText('Processing...', {
        timeout: 5000,
      });
      await expect(processButton).toHaveText('Process Audio', {
        timeout: 60000,
      });
    }
  });
});
