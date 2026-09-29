import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects, disciplines, timeline } from "../src/data.js";

test("portfolio content has unique projects and complete case studies", () => {
  assert.equal(
    new Set(projects.map((project) => project.id)).size,
    projects.length,
  );
  for (const project of projects) {
    assert.ok(
      project.title && project.description && project.outcome && project.alt,
    );
    assert.ok(project.scope.length >= 3);
    assert.ok(project.image.startsWith("/images/"));
  }
  assert.equal(disciplines.length, 4);
  assert.equal(timeline[0].year, "2020");
});

test("desktop and mobile portfolio interactions", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
      colorScheme: "dark",
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
    assert.match(await page.title(), /Aakash K/);
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (value) => (document.documentElement.dataset.theme = value),
        theme,
      );
      const report = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      assert.deepEqual(
        report.violations.map((item) => item.id),
        [],
        `${theme} theme accessibility: ${JSON.stringify(report.violations.map((item) => item.nodes.map((node) => ({ target: node.target, summary: node.failureSummary }))))}`,
      );
    }
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator(".project-card").count(), 4);
    await page
      .getByRole("button", { name: "Brand strategy", exact: true })
      .click();
    assert.equal(await page.locator(".project-card").count(), 1);
    await page.locator(".project-card").click();
    assert.equal(await page.locator("dialog").evaluate((el) => el.open), true);
    assert.match(
      await page.locator("#project-title").textContent(),
      /People into brands/,
    );
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog").evaluate((el) => el.open), false);
    await page.getByRole("button", { name: "All work", exact: true }).click();
    assert.equal(await page.locator(".project-card").count(), 4);
    await page.getByRole("button", { name: "Switch to light mode" }).click();
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      "light",
    );
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      "light",
    );
    await page
      .getByRole("button", { name: /Speaker Ideas deserve a voice/ })
      .click();
    assert.equal(await page.locator("#discipline-3").isVisible(), true);
    await page.getByRole("button", { name: "Copy email address" }).click();
    assert.equal(
      await page.evaluate(() => navigator.clipboard.readText()),
      "itzaakash15@gmail.com",
    );
    const brokenImages = await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter((img) => img.complete && img.naturalWidth === 0)
          .map((img) => img.src),
      );
    assert.deepEqual(brokenImages, []);
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 850 });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        true,
        `No horizontal overflow at ${width}px`,
      );
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Open menu" }).click();
    assert.equal(await page.getByRole("navigation").isVisible(), true);
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "About", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("button", { name: "Open menu" })
        .getAttribute("aria-expanded"),
      "false",
    );
    assert.deepEqual(errors, []);
    await context.close();
  } finally {
    await browser.close();
  }
});
