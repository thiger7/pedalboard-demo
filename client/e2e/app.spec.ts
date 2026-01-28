import { expect, test } from "@playwright/test";

test.describe("Pedalboard Demo", () => {
  test("ページが正しく表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText("Pedalboard Demo");
    await expect(page.locator("text=Guitar Effect Simulator")).toBeVisible();
  });

  test("Effect Chain セクションが表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Effect Chain")).toBeVisible();
  });

  test("エフェクトカードが表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".effector-card").first()).toBeVisible();
  });

  test("エフェクトのON/OFFを切り替えられる", async ({ page }) => {
    await page.goto("/");
    const firstCheckbox = page.locator(".effector-toggle input").first();
    const initialState = await firstCheckbox.isChecked();
    await firstCheckbox.click();
    await expect(firstCheckbox).toHaveJSProperty("checked", !initialState);
  });

  test("Process Audio ボタンが表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Process Audio")).toBeVisible();
  });

  test("ファイル未選択時は Process ボタンが無効", async ({ page }) => {
    await page.goto("/");
    const button = page.locator("button:has-text('Process Audio')");
    await expect(button).toBeDisabled();
  });
});
