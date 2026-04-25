import { test, expect } from "@playwright/test";

test.describe("Language Switcher", () => {
  test("keeps same section path when switching languages", async ({ page }) => {
    await page.goto("/pt/idiomas-biblicos/");

    await expect(page).toHaveURL(/\/pt\/idiomas-biblicos\/?$/);

    await page.getByRole("link", { name: "English" }).click();

    await expect(page).toHaveURL(/\/en\/idiomas-biblicos\/?$/);
  });

  test("keeps interlinear route, query and hash when switching languages", async ({ page }) => {
    await page.goto("/pt/interlinear/b19a/?book=gen&chapter=1&verse=2#tabela-interlinear");

    await page.getByRole("link", { name: "English" }).click();

    await expect(page).toHaveURL(/\/en\/interlinear\/b19a\//);

    const url = new URL(page.url());
    expect(url.pathname).toBe("/en/interlinear/b19a/");
    expect(url.searchParams.get("book")).toBe("gen");
    expect(url.searchParams.get("chapter")).toBe("1");
    expect(url.searchParams.get("verse")).toBe("2");
    expect(url.hash).toBe("#tabela-interlinear");
  });
});
